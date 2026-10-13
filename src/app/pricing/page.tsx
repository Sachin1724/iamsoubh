import { PolicyPage } from "@/components/PolicyPage";
import { products } from "@/config/site-config";

export const metadata = { title: "Pricing · The Odia Viral Calendar 2027" };

export default function Pricing() {
  return (
    <PolicyPage title="Pricing">
      <p>All prices are in Indian Rupees and include applicable taxes.</p>

      <h2>Batch 1 pre-order</h2>
      <ul>
        <li>
          <strong>Single Box</strong> — <span className="rupee">₹</span>
          {products.single.price}. One box, twelve festival cards and one sealed 13th parba.
        </li>
        <li>
          <strong>Family Pack (x3)</strong> — <span className="rupee">₹</span>
          {products.family.price}, which works out at <span className="rupee">₹</span>
          {products.family.perBox} a box. All three 13th parbas guaranteed, plus an extra
          sticker sheet.
        </li>
      </ul>

      <h2>After batch 1</h2>
      <p>
        Once the first 500 boxes are gone, a single box is <span className="rupee">₹</span>
        {products.single.strikePrice}.
      </p>

      <h2>Shipping</h2>
      <p>Free across India. There is no delivery charge on any order in batch 1.</p>

      <h2>Bulk orders</h2>
      <p>
        Ten boxes or more are priced on request and invoiced separately. Use the
        &ldquo;Request a quote&rdquo; form on the main page.
      </p>

      <h2>Payment</h2>
      <p>
        Payments are processed by Razorpay, which accepts UPI, cards, net banking and wallets.
        Payment is taken in full at the time of pre-order.
      </p>
    </PolicyPage>
  );
}
