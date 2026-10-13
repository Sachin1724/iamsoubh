-- Odia Viral Calendar 2027 — batch 1 schema.
-- Run once in the Supabase SQL editor.

create table settings (
  id int primary key default 1 check (id = 1),
  cap int not null default 500,
  hold_minutes int not null default 15
);
insert into settings default values;

create table orders (
  id                  uuid primary key default gen_random_uuid(),
  razorpay_order_id   text unique,
  razorpay_payment_id text,
  product             text not null check (product in ('single','family','bulk')),
  qty                 int  not null check (qty > 0),
  boxes               int  not null check (boxes > 0),
  amount_paise        int  not null check (amount_paise >= 0),
  status              text not null default 'held'
                      check (status in ('held','paid','expired','failed','overflow','refunded')),
  name text, phone text, email text,
  pincode text, city text, state text, address text, landmark text,
  gift_note text,
  utm jsonb not null default '{}'::jsonb,
  order_number        int,
  hold_expires_at     timestamptz not null,
  created_at          timestamptz not null default now(),
  paid_at             timestamptz
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
#variable_conflict use_column
declare v_cap int; o orders%rowtype; v_other int; v_after int;
begin
  select cap into v_cap from settings where id = 1 for update;
  select * into o from orders where razorpay_order_id = p_rzp_order for update;
  if not found then raise exception 'ORDER_NOT_FOUND'; end if;
  if o.status = 'paid' then return query select o.status, o.order_number; return; end if;

  v_other := boxes_taken(o.id);
  if v_cap - v_other >= o.boxes then
    select coalesce(sum(boxes),0)::int + o.boxes into v_after from orders where status = 'paid';
    update orders set status = 'paid', razorpay_payment_id = p_payment, paid_at = now(),
                      order_number = v_after
     where id = o.id;
    return query select 'paid'::text, v_after;
  else
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

-- ── Fulfillment (admin) ────────────────────────────────────
alter table orders add column if not exists courier text;
alter table orders add column if not exists tracking_number text;
alter table orders add column if not exists tracking_url text;
alter table orders add column if not exists shipped_at timestamptz;

-- 'shipped' joins the status set; everything else is unchanged.
alter table orders drop constraint if exists orders_status_check;
alter table orders add constraint orders_status_check
  check (status in ('held','paid','shipped','expired','failed','overflow','refunded'));

-- One row per message actually sent, so webhook retries cannot double-mail.
create table if not exists email_log (
  order_id uuid not null references orders(id) on delete cascade,
  kind     text not null check (kind in ('confirmed','shipped')),
  sent_at  timestamptz not null default now(),
  primary key (order_id, kind)
);
alter table email_log enable row level security;

-- "How many ordered, from where." Read this in the Supabase table editor.
create or replace view orders_by_state as
  select coalesce(state,'(unknown)') as state,
         count(*)::int as orders,
         sum(boxes)::int as boxes,
         sum(amount_paise)/100 as amount_inr
  from orders where status in ('paid','shipped')
  group by 1 order by boxes desc;

create or replace view orders_by_city as
  select coalesce(state,'(unknown)') as state, coalesce(city,'(unknown)') as city,
         count(*)::int as orders, sum(boxes)::int as boxes
  from orders where status in ('paid','shipped')
  group by 1,2 order by boxes desc;

-- The fulfillment checklist feeds off this.
create or replace view fulfillment_queue as
  select id, order_number, status, name, phone, email, boxes, product,
         address, landmark, city, state, pincode, gift_note,
         courier, tracking_number, tracking_url, paid_at, shipped_at
  from orders where status in ('paid','shipped') order by paid_at;
