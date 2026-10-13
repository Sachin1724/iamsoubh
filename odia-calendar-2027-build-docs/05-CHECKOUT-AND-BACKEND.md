# 05 · Checkout and Backend

There are two modes, switched by `checkoutMode` in the config:

| Mode | When | What it is |
|---|---|---|
| **`custom`** (main) | Default | Our order selector and address sheet, Razorpay Standard Checkout, serverless functions, and a Supabase tally that enforces the 500-box cap, with a verified webhook |
| **`payment-buttons`** (fallback) | No time for a backend | Two Razorpay Payment Buttons with their own stock. The stepper and address sheet are hidden, and Soubh updates the counter by hand |

Build `custom` first, but keep the fallback working behind the flag. It is the launch-day safety net.

---

## 1. Architecture (custom mode)

```
Browser (static Astro page)
  │  GET  /api/stock              → remaining, soldOut, familyAvailable (edge cache 30s)
  │  GET  /api/pincode?pin=       → city, state (cached proxy to India Post)
  │  POST /api/create-order       → reserves boxes (15 min hold) + creates Razorpay order
  │        └─ opens Razorpay Checkout (checkout.js) with order_id
  │  POST /api/verify-payment     → checks signature, marks paid, returns order number
  │  GET  /api/order-status?o=    → for /thank-you (status + order number, no personal data)
  │  POST /api/waitlist           → batch 2 WhatsApp numbers
  ▼
Razorpay ──webhook──► POST /api/razorpay-webhook (payment.captured / order.paid) → marks paid
  ▼
Supabase Postgres: settings · orders · waitlist · webhook_events
```

**Rules that must not be broken**
1. **The price is calculated on the server** from server-side config. Never trust an amount sent from the browser.
2. **There is one shared tally** of boxes: Single = 1 box, Family pack = 3 boxes, cap 500.
3. **Paid status comes from a verified signature** (the verify call or the webhook), never from the browser's success callback alone, because people close tabs.
4. Every write is **idempotent**. The verify call and the webhook can both arrive in either order.

---

## 2. Environment variables

| Name | Where | Notes |
|---|---|---|
| `RAZORPAY_KEY_ID` | Server | Test key during development, live key at launch |
| `RAZORPAY_KEY_SECRET` | Server only | Never shipped to the browser |
| `RAZORPAY_WEBHOOK_SECRET` | Server only | Set when creating the webhook in the dashboard |
| `PUBLIC_RAZORPAY_KEY_ID` | Browser | Same value as `RAZORPAY_KEY_ID` |
| `SUPABASE_URL` | Server | |
| `SUPABASE_SERVICE_ROLE_KEY` | Server only | Functions only. The browser never talks to Supabase |
| `ALERT_WEBHOOK_URL` | Server | Optional: Telegram, Slack or an email service, for overflow and error alerts |
| `PUBLIC_WEB3FORMS_KEY` | Browser | Quote popup (an access key, safe to expose) |

---

## 3. Database (Supabase)

Run this once in the SQL editor. **Turn on RLS on every table with no policies**, so only the service role (our functions) can read or write.

```sql
-- One row of settings. The cap lives here too, so it can be changed without a deploy.
create table settings (
  id int primary key default 1 check (id = 1),
  cap int not null default 500,
  hold_minutes int not null default 15
);
insert into settings default values;

create table orders (
  id                 uuid primary key default gen_random_uuid(),
  razorpay_order_id  text unique,
  razorpay_payment_id text,
  product            text not null check (product in ('single','family','bulk')),
  qty                int  not null check (qty > 0),
  boxes              int  not null check (boxes > 0),
  amount_paise       int  not null check (amount_paise >= 0),
  status             text not null default 'held'
                     check (status in ('held','paid','expired','failed','overflow','refunded')),
  name text, phone text, email text,
  pincode text, city text, state text, address text, landmark text,
  gift_note text,
  utm jsonb not null default '{}'::jsonb,
  order_number       int,          -- running box count at payment, shown as "Order n of 500"
  hold_expires_at    timestamptz not null,
  created_at         timestamptz not null default now(),
  paid_at            timestamptz
);
create index orders_status_hold_idx on orders (status, hold_expires_at);

create table waitlist (
  phone text primary key,
  utm jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table webhook_events (
  event_id text primary key,
  received_at timestamptz not null default now()
);

alter table settings enable row level security;
alter table orders enable row level security;
alter table waitlist enable row level security;
alter table webhook_events enable row level security;

-- Boxes currently taken = paid + unexpired holds
create or replace function boxes_taken(p_exclude uuid default null) returns int
language sql stable as $$
  select coalesce(sum(boxes),0)::int from orders
  where id is distinct from p_exclude
    and (status = 'paid' or (status = 'held' and hold_expires_at >= now()));
$$;

-- Reserve boxes atomically. Locking the settings row serialises every reservation,
-- so two buyers can never take the last box together.
create or replace function reserve_boxes(
  p_product text, p_qty int, p_boxes int, p_amount int, p_customer jsonb, p_utm jsonb
) returns table (order_id uuid, remaining int)
language plpgsql security definer as $$
declare v_cap int; v_hold int; v_taken int; v_id uuid;
begin
  select cap, hold_minutes into v_cap, v_hold from settings where id = 1 for update;
  update orders set status = 'expired' where status = 'held' and hold_expires_at < now();
  v_taken := boxes_taken();
  if v_cap - v_taken < p_boxes then
    raise exception 'OUT_OF_STOCK:%', greatest(v_cap - v_taken, 0);
  end if;
  insert into orders (product, qty, boxes, amount_paise, name, phone, email, pincode, city, state,
                      address, landmark, gift_note, utm, hold_expires_at)
  values (p_product, p_qty, p_boxes, p_amount,
          p_customer->>'name', p_customer->>'phone', p_customer->>'email', p_customer->>'pincode',
          p_customer->>'city', p_customer->>'state', p_customer->>'address', p_customer->>'landmark',
          p_customer->>'giftNote', coalesce(p_utm,'{}'::jsonb), now() + make_interval(mins => v_hold))
  returning id into v_id;
  return query select v_id, v_cap - v_taken - p_boxes;
end $$;

-- Mark paid. Safe to call many times, from verify or webhook, in any order.
create or replace function mark_paid(p_rzp_order text, p_payment text)
returns table (status text, order_number int)
language plpgsql security definer as $$
#variable_conflict use_column   -- the OUT names "status" and "order_number" match table columns
declare v_cap int; o orders%rowtype; v_other int; v_after int;
begin
  select cap into v_cap from settings where id = 1 for update;
  select * into o from orders where razorpay_order_id = p_rzp_order for update;
  if not found then raise exception 'ORDER_NOT_FOUND'; end if;
  if o.status = 'paid' then return query select o.status, o.order_number; return; end if;

  v_other := boxes_taken(o.id);
  if v_cap - v_other >= o.boxes then
    -- Fits (also covers a late payment after the hold ran out, if stock is still free)
    select coalesce(sum(boxes),0)::int + o.boxes into v_after from orders where status = 'paid';
    update orders set status = 'paid', razorpay_payment_id = p_payment, paid_at = now(),
                      order_number = v_after
     where id = o.id;
    return query select 'paid'::text, v_after;
  else
    -- Paid after the hold expired and the boxes went to someone else: refund needed
    update orders set status = 'overflow', razorpay_payment_id = p_payment, paid_at = now() where id = o.id;
    return query select 'overflow'::text, null::int;
  end if;
end $$;

create or replace view stock as
  select s.cap, s.cap - boxes_taken() as remaining from settings s where s.id = 1;

create or replace view paid_orders as
  select order_number, razorpay_order_id, razorpay_payment_id, product, qty, boxes,
         amount_paise / 100 as amount_inr, name, phone, email, address, landmark, city, state,
         pincode, gift_note, utm, paid_at
  from orders where status = 'paid' order by paid_at;
```

**Bulk boxes in batch 1.** When Soubh confirms a bulk order that ships with batch 1 (up to **[confirm: 50]** boxes in total), add a row by hand with `product = 'bulk'`, `status = 'paid'` and the box count, so the public tally stays honest. Bulk orders are invoiced separately and never go through the page.

---

## 4. Functions

Use Vercel functions (`/api/*.ts`) or Netlify functions. Node 20. Validate every request body with `zod`.

### `GET /api/stock`
- Reads the `stock` view, plus `config.forceSoldOut`.
- Returns `{ cap, remaining, soldOut: remaining <= 0 || forceSoldOut, familyAvailable: remaining >= 3 }`.
- Header `Cache-Control: public, s-maxage=30, stale-while-revalidate=30`.

### `POST /api/create-order`
Request:
```json
{
  "product": "family",
  "qty": 1,
  "customer": { "name": "", "phone": "9xxxxxxxxx", "email": "", "pincode": "751001",
                "city": "", "state": "", "address": "", "landmark": "", "giftNote": "" },
  "utm": { "source": "", "medium": "", "campaign": "", "content": "" },
  "reuseOrderId": "optional db order id from an earlier attempt"
}
```
Steps:
1. Reject if `forceSoldOut`, or if `product` or `qty` is outside the limits (Single 1–9, Family 1–3).
2. **Reuse:** if `reuseOrderId` is still `held` and unexpired with the same product and qty, return its Razorpay order again (no new hold).
3. `boxes = product === 'family' ? 3 * qty : qty`, and `amount = (product === 'family' ? 749 : 299) * qty * 100` paise, **from server config**.
4. `rpc('reserve_boxes', …)`. On `OUT_OF_STOCK:n`, respond `409 { code: 'OUT_OF_STOCK', remaining: n }`.
5. Create the Razorpay order:
   ```js
   await razorpay.orders.create({
     amount, currency: 'INR',
     receipt: dbOrderId,                       // ≤ 40 chars; a uuid is 36
     notes: {                                   // ≤ 15 keys, each value ≤ 256 chars
       db_order_id: dbOrderId, product, qty: String(qty), boxes: String(boxes),
       name, phone, pincode, city, state,
       address: address.slice(0, 250), landmark: landmark?.slice(0, 120) ?? '',
       gift_note: giftNote?.slice(0, 200) ?? ''
     }
   });
   ```
   If this call fails, set the order to `failed` (which releases the hold) and return `502`.
6. Save `razorpay_order_id` on the row.
7. Respond `{ dbOrderId, razorpayOrderId, amount, keyId, holdExpiresAt }`.

### Opening Razorpay Checkout (browser)
Load `https://checkout.razorpay.com/v1/checkout.js` only when the checkout sheet first opens (inject the script tag). Then:
```js
const rzp = new Razorpay({
  key: keyId,
  order_id: razorpayOrderId,
  amount, currency: 'INR',
  name: 'IAMSOUBH',
  description: product === 'family' ? 'Odia Viral Calendar 2027 · Family Pack' : 'Odia Viral Calendar 2027 · Single Box',
  prefill: { name, email, contact: '+91' + phone },
  notes: { db_order_id: dbOrderId },
  theme: { color: '#C8221A' },
  timeout: 900,                       // matches the 15-minute hold
  retry: { enabled: true },
  modal: { confirm_close: true, ondismiss: onDismiss },
  handler: async (res) => {           // { razorpay_payment_id, razorpay_order_id, razorpay_signature }
    await fetch('/api/verify-payment', { method: 'POST', body: JSON.stringify(res) });
    location.href = '/thank-you?o=' + res.razorpay_order_id;
  }
});
rzp.on('payment.failed', onFailed);
rzp.open();
```

### `POST /api/verify-payment`
1. `expected = HMAC_SHA256(razorpay_order_id + "|" + razorpay_payment_id, RAZORPAY_KEY_SECRET)` in hex. Compare it with `razorpay_signature` using a timing-safe compare.
2. If it matches, `rpc('mark_paid', …)` and return `{ status, orderNumber }`.
3. On a mismatch, return `400` and change nothing.
4. If the status is `overflow`, send an alert (see below) and return `{ status: 'overflow' }`. The thank-you page then shows: "Your payment came in just after the last box went. Soubh will refund you in full within 48 hours." **[confirm wording]**

### `POST /api/razorpay-webhook`
- In the Razorpay Dashboard → Webhooks, add `https://{domain}/api/razorpay-webhook` with the events **`payment.captured`**, **`order.paid`** and **`payment.failed`**, and set the secret.
- Read the **raw body** (disable body parsing). Verify `X-Razorpay-Signature = HMAC_SHA256(rawBody, RAZORPAY_WEBHOOK_SECRET)`.
- Dedupe with the `x-razorpay-event-id` header in the `webhook_events` table: insert it, and if it already exists, return 200 straight away.
- `payment.captured` / `order.paid`: `mark_paid(payload.payment.entity.order_id, payload.payment.entity.id)`. Alert on `overflow`.
- `payment.failed`: log only. The hold expires by itself.
- Always respond `200` within a few seconds. Do slow work (alerts) without blocking the response.

**Auto-capture:** make sure payments are set to **capture automatically** in the Razorpay Dashboard (payment capture settings). Otherwise `payment.captured` never fires and authorised payments get auto-refunded.

### `GET /api/order-status?o={razorpay_order_id}`
Returns `{ status, orderNumber, boxes, product }` with **no personal data**. The thank-you page polls it every 2 s for up to 20 s while the status is `held` (the payment is still confirming).

### `GET /api/pincode?pin=`
A proxy to `https://api.postalpincode.in/pincode/{pin}`. Return `{ city: PostOffice[0].District, state: PostOffice[0].State }`, cache it for 7 days, and time out after 3 s. Failure returns `404` and the form stays editable.

### `POST /api/waitlist`
`{ phone, utm }` → upsert into `waitlist`. Always `200` (dedupe silently).

### Alerts
On `overflow` or any 5xx in the order functions, POST a short message to `ALERT_WEBHOOK_URL` with the order id, amount and phone, so Soubh can refund the same day.

---

## 5. Holds and the 500 cap

| Event | Effect on the tally |
|---|---|
| `create-order` succeeds | Boxes are **held** for 15 min |
| Payment verified (verify or webhook) | The hold becomes **permanent** (`paid`) |
| 15 min pass with no payment | The hold **expires** lazily (counted as free from that moment; the status flips on the next reservation) |
| Razorpay order creation fails | `failed`, released at once |
| Payment lands after expiry, stock still free | Still `paid` (no harm) |
| Payment lands after expiry, stock gone | `overflow` → alert → full refund from the dashboard, status set to `refunded` |
| Under 3 boxes left | `familyAvailable: false`, the family card shows "Sold out" |
| 0 left | `soldOut: true`, the page flips to the sold-out state by itself |

There is no cron job; expiry is calculated at read time.

---

## 6. Sold-out switch

- **Automatic** when `remaining <= 0`.
- **Manual override:** `forceSoldOut: true` in `site.config.ts` (redeploy), or the `FORCE_SOLD_OUT` env var (no rebuild needed if `/api/stock` reads it).
- Either one flips every button, the sticky bar and section 06 to the batch 2 waitlist versions (copy in `03-COPY.md`).

---

## 7. After payment

- `/thank-you?o=…`: poll `order-status`. When paid, show "You're in. Order {n} of 500." plus the ship date, the WhatsApp community link, the story template download and "Send to family".
- Fire the Meta `Purchase` event **once**, with `value`, `currency: 'INR'` and `eventID = razorpay_payment_id`. Guard it with `sessionStorage` so a reload never double-counts. Fire GA4 `purchase` with `transaction_id` set to the same id.
- The order confirmation on WhatsApp and email is sent by Soubh's process, from the template in the sales checklist. Automation can come later.

---

## 8. Order operations

- **Daily export:** Supabase → `paid_orders` view → CSV → upload to Shiprocket or Delhivery. The columns match the order sheet: order ID, product, boxes, name, phone, address, pincode, gift note.
- **Packing:** every family pack gets one of each 13th parba (Sahi Jata, Sitalsasthi, Gajalaxmi Puja). Singles get the three 13ths shuffled evenly.
- **Refunds** are done from the Razorpay dashboard, then the row is set to `refunded`.

---

## 9. Fallback mode: `payment-buttons`

Set `checkoutMode: 'payment-buttons'` in the config.

1. In the Razorpay Dashboard, create **two Payment Buttons**:
   - "Single Box": amount type **Item with Quantity**, ₹299, stock **350**.
   - "Family Pack (x3)": amount type **Item with Quantity**, ₹749, stock **50** (= 150 boxes; 350 + 150 = 500).
   - Add custom fields: Name, WhatsApp, Email, Full address, Pincode, Landmark, Gift note (optional).
   - Set the success redirect to `https://{domain}/thank-you`.
2. Put both button ids in the config (`paymentButtons.single`, `paymentButtons.family`).
3. On the page, the option cards swap which button is shown:
   ```html
   <form><script src="https://checkout.razorpay.com/v1/payment-button.js"
     data-payment_button_id="pl_XXXX" async></script></form>
   ```
   Style the surrounding area to match. The Razorpay button itself keeps Razorpay's look.
4. **Hide** the stepper, the live total and the address sheet. Quantity and address are collected in Razorpay's own form.
5. **The counter is manual:** Soubh sets `manualRemaining` in the config from the dashboard. The 300 threshold rule still applies, and it is never an invented number.
6. In this mode the thank-you page cannot show "Order n of 500". Show "You're in." without the number.
