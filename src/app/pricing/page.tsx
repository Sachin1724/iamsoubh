import { PolicyPage } from "@/frontend/components/PolicyPage";
import { products, TIERS, MAX_BOXES } from "@/config/site-config";

export const metadata = { title: "Pricing · The Odia Viral Calendar 2027" };

export default function Pricing() {
  return (
    <PolicyPage title="Pricing">
      <p>All prices are in Indian Rupees and include applicable taxes.</p>

      <h2>Batch 1 pre-order</h2>
      <p>
        One box is 12 festival cards and one sealed 13th parba. The price per box steps down as you add
        boxes, and the lower price applies to every box in the order:
      </p>
      <ul>
        <li>
          <strong>1 or 2 boxes</strong> — <span className="rupee">₹</span>
          {TIERS[2].price} a box
        </li>
        <li>
          <strong>3 to 9 boxes</strong> — <span className="rupee">₹</span>
          {TIERS[1].price} a box
        </li>
        <li>
          <strong>10 boxes or more</strong> — <span className="rupee">₹</span>
          {TIERS[0].price} a box
        </li>
      </ul>

      <h2>After batch 1</h2>
      <p>
        Once the first 500 boxes are gone, a single box is <span className="rupee">₹</span>
        {products.single.strikePrice}.
      </p>

      <h2>Shipping</h2>
      <p>Free anywhere in India, whether you buy 1, 3 or 10 boxes. There is no delivery charge on any order in batch 1.</p>

      <h2>Bulk orders</h2>
      <p>
        For more than {MAX_BOXES} boxes, we price on request and invoice separately. Use the
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
