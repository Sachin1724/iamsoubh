import { PolicyPage } from "@/frontend/components/PolicyPage";
import { siteConfig } from "@/config/site-config";

export const metadata = { title: "Shipping · The Odia Viral Calendar 2027" };

export default function Shipping() {
  return (
    <PolicyPage title="Shipping">
      <p>
        Every box in batch 1 ships free, anywhere in India. There is no delivery charge at
        checkout and none collected on arrival.
      </p>

      <h2>Where we ship</h2>
      <p>
        India only for batch 1. We are not shipping internationally in this batch. If you are
        abroad, order to a family address in India and have it sent on.
      </p>

      <h2>When it ships</h2>
      <p>
        Boxes ship from the {siteConfig.shipDateInline}. Delivery then takes about
        3 to 7 working days depending on your pincode.
      </p>
      <p>
        If your box hasn&apos;t shipped by {siteConfig.refundDeadlineLabel}, you get a full
        refund. See the <a href="/refunds">refunds and cancellation</a> page.
      </p>

      <h2>Tracking</h2>
      <p>
        Your tracking link reaches you by email the day the box leaves. Keep the
        number you entered at checkout reachable.
      </p>

      <h2>If it arrives damaged</h2>
      <p>
        Email a photo within 48 hours of delivery and a replacement ships free. No
        need to return the damaged one.
      </p>
    </PolicyPage>
  );
}
