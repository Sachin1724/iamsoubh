import { PolicyPage, Confirm } from "@/components/PolicyPage";
import { siteConfig } from "@/config/site-config";

export const metadata = { title: "Privacy · The Odia Viral Calendar 2027" };

export default function Privacy() {
  return (
    <PolicyPage title="Privacy">
      <p>
        This page explains what we collect when you pre-order, why we collect it, and how to
        have it removed.
      </p>

      <h2>What we collect</h2>
      <ul>
        <li>Your name</li>
        <li>WhatsApp number</li>
        <li>Email address, if you give one</li>
        <li>Delivery address, pincode, city and state</li>
        <li>A gift note, if you write one</li>
        <li>Basic analytics about how you used the page</li>
      </ul>

      <h2>Why we collect it</h2>
      <p>
        To pack and deliver your box, to send you tracking and order updates on WhatsApp and
        email, and to handle refunds or replacements. Your gift note is printed and sent inside
        the box.
      </p>

      <h2>Payment details</h2>
      <p>
        Card, UPI and bank details are entered on Razorpay and handled entirely by Razorpay. We
        never see or store them. Razorpay processes payments as our payment partner under their
        own privacy policy.
      </p>

      <h2>Who else sees your data</h2>
      <ul>
        <li>Razorpay, to take payment</li>
        <li>Our courier partner, to deliver the box</li>
        <li>Supabase, which hosts our order database</li>
      </ul>
      <p>We do not sell your data, and we do not share it for anyone else&apos;s advertising.</p>

      <h2>Cookies and analytics</h2>
      <p>
        We use Meta Pixel and Google Analytics 4 to see which parts of the page lead to orders.
        These set cookies in your browser. You can block them in your browser settings without
        affecting your ability to order.
      </p>

      <h2>How long we keep it</h2>
      <p>
        Order records are kept as long as needed for accounting and support. Analytics data
        expires on the providers&apos; own schedules.
      </p>

      <h2>Getting your data removed</h2>
      <p>
        Write to <Confirm value={siteConfig.supportEmail} label="support email" /> or message{" "}
        {siteConfig.whatsappNumber} and we will delete your details, except records we are
        required to keep for tax purposes.
      </p>
    </PolicyPage>
  );
}
