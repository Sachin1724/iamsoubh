import { PolicyPage, Confirm } from "@/components/PolicyPage";
import { siteConfig } from "@/config/site-config";

export const metadata = { title: "Contact · The Odia Viral Calendar 2027" };

export default function Contact() {
  return (
    <PolicyPage title="Contact">
      <p>One person reads all of these. Expect a reply within 24 hours.</p>

      <h2>Business name</h2>
      <p>
        <Confirm value={siteConfig.legalName} label="legal business name" />
      </p>

      <h2>Address</h2>
      <p>
        <Confirm value={siteConfig.businessAddress} label="registered business address" />
      </p>

      <h2>Email</h2>
      <p>
        <Confirm value={siteConfig.supportEmail} label="support email" />
      </p>

      <h2>Instagram</h2>
      <p>
        <a href={siteConfig.instagramUrl} target="_blank" rel="noopener noreferrer">
          {siteConfig.handle}
        </a>
      </p>

      <h2>Response time</h2>
      <p>
        Within 24 hours on working days. Order and delivery questions are answered fastest on
        email with your order number to hand.
      </p>
    </PolicyPage>
  );
}
