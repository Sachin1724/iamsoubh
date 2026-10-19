import { PolicyPage } from "@/components/PolicyPage";

export const metadata = { title: "Refunds and cancellation · The Odia Viral Calendar 2027" };

export default function Refunds() {
  return (
    <PolicyPage title="Refunds and cancellation">
      {/* The brief requires this sentence word for word. */}
      <p className="font-disko text-2xl leading-snug">
        Full refund if your box hasn&apos;t shipped by 15 November.
      </p>
      <p>No forms, no follow-ups. The money goes back the way it came.</p>

      <h2>Cancelling before it ships</h2>
      <p>
        Changed your mind before your box ships? Email us and you get a full
        refund.
      </p>

      <h2>After it ships</h2>
      <p>
        Once a box has shipped it is yours. This is a printed, dated product made in a limited
        batch, so we cannot accept returns or exchanges after dispatch.
      </p>

      <h2>Damaged on arrival</h2>
      <p>
        Email us a photo within 48 hours of delivery and we ship a replacement free. You
        do not need to send the damaged box back.
      </p>

      <h2>How long a refund takes</h2>
      <p>
        Approved refunds are sent back to your original payment method within 5 to 7 working
        days. Your bank or card issuer may take a little longer to show it.
      </p>

      <h2>Bulk orders</h2>
      <p>
        Bulk orders of ten boxes or more are invoiced separately and are covered by the terms
        agreed in writing on that invoice.
      </p>
    </PolicyPage>
  );
}
