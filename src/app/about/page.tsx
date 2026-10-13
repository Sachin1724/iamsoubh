import { PolicyPage } from "@/components/PolicyPage";
import { siteConfig } from "@/config/site-config";

export const metadata = { title: "About · The Odia Viral Calendar 2027" };

export default function About() {
  return (
    <PolicyPage title="About">
      <p className="font-disko text-2xl leading-snug">
        Made in Odisha, for everyone who misses it.
      </p>

      <p>
        The Odia Viral Calendar started as a simple complaint: you find out Raja has come and
        gone from someone else&apos;s story. The festivals that shaped you are the ones you keep
        missing, and no calendar on sale anywhere keeps those dates where you can see them.
      </p>

      <p>
        So I painted one. Twelve Odia festivals, one a month, each card art on the front and a
        working calendar on the back, with two tick boxes to mark when you actually showed up.
        Then a thirteenth card, sealed, for a parba most calendars skip entirely.
      </p>

      <h2>What happened in 2026</h2>
      <ul>
        <li>1,500 homes put it on a wall or a desk</li>
        <li>200+ of you posted it to your story, and I screenshotted every one</li>
        <li>It reached 22 states and the USA</li>
      </ul>
      <p>
        Most of those were gifts. People bought three at a time and sent them to Maa, to a
        cousin, to the friend who moved away.
      </p>

      <h2>The 2027 edition</h2>
      <p>
        Batch 1 is {siteConfig.batchCap} boxes, shipping from the{" "}
        {siteConfig.shipDateLabel.toLowerCase()}. Everything is repainted. The box is rigid now,
        because the 2026 one did not always survive the courier.
      </p>

      <p>
        Made by {siteConfig.author},{" "}
        <a href={siteConfig.instagramUrl} target="_blank" rel="noopener noreferrer">
          {siteConfig.handle}
        </a>
        .
      </p>
    </PolicyPage>
  );
}
