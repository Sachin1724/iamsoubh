import { lowestBoxPrice, siteConfig } from "@/config/site-config";
import { cta } from "@/frontend/components/ui/cta";

const ITEMS = [
  { count: "12", title: "festival cards", body: "A painting on the front, the month's dates on the back." },
  { count: "1", title: "sealed 13th parba", body: "One of three. You meet yours when the box lands." },
  { count: "1", title: "Odia New Year postcard", body: "Pana Sankranti wishes, ready to send home." },
  {
    count: "1",
    title: "premium surprise sticker set",
    body: "Parba art for your laptop and your diary. A different surprise in every box.",
  },
];

/** Section 03. The contents of the box as one list on a solid themed panel. */
export function InsideTheBox() {
  return (
    <section id="inside-calendar" className="relative overflow-hidden bg-white py-20 text-ink sm:py-32">
      <div className="relative mx-auto w-full max-w-3xl px-5 sm:px-6">
      <h2 className="font-gazpacho text-3xl font-bold leading-tight text-ink sm:text-5xl">What you get inside.</h2>
      <p className="mb-5 mt-1 text-[0.95rem] text-ink/65 sm:text-base font-[-apple-system,BlinkMacSystemFont,'SF_Pro_Text','SF_Pro_Display',system-ui,sans-serif]">
        Everything in the box, in the order you will find it.
      </p>
      <ul className="space-y-3 sm:space-y-5">
        {ITEMS.map((it) => (
          <li key={it.title} className="flex items-baseline gap-3 sm:gap-4">
            <span className="w-10 shrink-0 font-gazpacho text-3xl font-bold leading-none text-pipili-red sm:w-16 sm:text-5xl">
              {it.count}
            </span>
            <span>
              <span className="block font-gazpacho text-lg font-bold leading-tight text-ink sm:text-2xl">{it.title}</span>
              <span className="block text-[0.9rem] leading-snug text-ink/65 sm:text-base font-[-apple-system,BlinkMacSystemFont,'SF_Pro_Text','SF_Pro_Display',system-ui,sans-serif]">{it.body}</span>
            </span>
          </li>
        ))}
      </ul>
      <a href="#preorder" className={`mt-8 w-full sm:w-auto ${cta("red")}`}>
        <span>Pre-order now</span>
        <span aria-hidden="true">→</span>
      </a>
      <p className="mt-3 text-sm font-medium text-ink/65 font-[-apple-system,BlinkMacSystemFont,'SF_Pro_Text','SF_Pro_Display',system-ui,sans-serif]">
        From ₹{lowestBoxPrice} a box · {siteConfig.freeDeliveryLabel}
      </p>
      </div>
    </section>
  );
}
