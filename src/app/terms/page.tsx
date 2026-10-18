import { PolicyPage, Confirm } from "@/components/PolicyPage";
import { siteConfig, products } from "@/config/site-config";

export const metadata = { title: "Terms · The Odia Viral Calendar 2027" };

export default function Terms() {
  return (
    <PolicyPage title="Terms">
      <p>
        These terms cover pre-orders of The Odia Viral Calendar 2027, sold by{" "}
        <Confirm value={siteConfig.legalName} label="legal business name" />.
      </p>

      <h2>This is a pre-order</h2>
      <p>
        Batch 1 is limited to {siteConfig.batchCap} boxes. You pay in full now and your box
        ships from the {siteConfig.shipDateInline}. A pre-order is confirmed only
        once payment is captured and you receive confirmation.
      </p>
      <p>
        Boxes are held for 15 minutes while you complete payment. If payment is not completed in
        that time, the hold is released and the boxes return to the pool.
      </p>

      <h2>What is in the box</h2>
      <ul>
        <li>12 festival cards</li>
        <li>1 sealed 13th parba card</li>
        <li>An Odia New Year postcard</li>
        <li>A sticker sheet</li>
        <li>A thank-you card</li>
        <li>A rigid storage box</li>
      </ul>

      <h2>The sealed 13th parba</h2>
      <p>
        Each box contains one sealed 13th parba card, selected at random from three: Sahi Jata
        (Puri), Sitalsasthi (Sambalpur) and Gajalaxmi Puja (Dhenkanal). A Gift Pack counts as five boxes against the batch cap. Single boxes cannot
        choose which one they receive. A Family Pack is guaranteed to contain all three.
      </p>

      <h2>Prices and taxes</h2>
      <p>
        Prices are in Indian Rupees and{" "}
        {siteConfig.gstIncluded ? "include applicable taxes" : "are exclusive of applicable taxes"}.
        A Single Box is <span className="rupee">₹</span>
        {products.single.price}, a Family Pack is <span className="rupee">₹</span>
        {products.family.price} and a Gift Pack is <span className="rupee">₹</span>
        {products.gift.price} during batch 1. The order total is calculated on our servers at
        the moment of payment.
      </p>

      <h2>Artwork</h2>
      <p>
        All artwork and text in the calendar remain the property of the seller. The calendar is
        sold for personal use. Reproducing, reprinting or selling the artwork is not permitted.
      </p>

      <h2>Cancellations and refunds</h2>
      <p>
        Covered on the <a href="/refunds">refunds and cancellation</a> page, which forms part of
        these terms.
      </p>

      <h2>Things outside our control</h2>
      <p>
        Printing and courier delays caused by events outside our control may affect dates. The{" "}
        {siteConfig.refundDeadlineLabel} refund promise stands regardless.
      </p>
    </PolicyPage>
  );
}
