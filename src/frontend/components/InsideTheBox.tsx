import Image from "next/image";

const ITEMS = [
  { image: "/assets/story/card-january.jpg", title: "12 festival cards", body: "A painting on the front, the month's dates on the back." },
  {
    image: "/assets/story/flatlay.jpg",
    title: "1 wooden easel stand",
    body: "Last year, lots of you asked for one. Your card stands on the desk.",
  },
  { image: "/assets/story/box-hand.jpg", title: "1 sealed 13th parba", body: "One of three. You meet yours when the box lands." },
  { image: "/assets/story/cards-flat.jpg", title: "1 Odia New Year postcard", body: "Pana Sankranti wishes, ready to send home." },
  {
    image: "/assets/story/cards-hand.jpg",
    title: "1 premium surprise sticker set",
    body: "Parba art for your laptop and your diary. A different surprise in every box.",
  },
];

const SYSTEM_FONT = "font-[-apple-system,BlinkMacSystemFont,'SF_Pro_Text','SF_Pro_Display',system-ui,sans-serif]";

/** Section 03. The contents of the box: a bento grid on phones, one row on desktop. */
export function InsideTheBox() {
  return (
    <section id="inside-calendar" data-snap className="relative overflow-hidden bg-white py-12 text-ink sm:py-16">
      <div className="relative mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 data-scroll-rise className="font-gazpacho text-3xl font-bold leading-tight text-ink sm:text-5xl">What you get inside.</h2>
        <p className={`mt-1 mb-5 text-[0.95rem] text-ink/65 sm:mb-8 sm:text-base ${SYSTEM_FONT}`}>
          Everything in the box, in the order you will find it.
        </p>
        <ul className="grid grid-cols-2 gap-3 md:grid-cols-5 md:gap-5">
          {ITEMS.map((it, i) => (
            <li
              key={it.title}
              className={`overflow-hidden rounded-2xl border-[1.5px] border-ink bg-rice/40 shadow-[3px_3px_0_0_#1B1B1B] ${
                i === 0 ? "col-span-2 md:col-span-1" : ""
              }`}
            >
              {/* Swap each photo for its own mockup shot when ready */}
              <div className={`relative aspect-square ${i === 0 ? "max-md:aspect-[2/1]" : ""}`}>
                <Image src={it.image} alt="" fill sizes="(min-width: 768px) 20vw, 50vw" className="object-cover" />
                {/* Phone: title over the photo; desktop: title and line under it */}
                <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 to-transparent px-3 pb-2 pt-6 font-gazpacho text-base font-bold leading-tight text-white md:hidden">
                  {it.title}
                </span>
              </div>
              <div className="hidden p-4 md:block">
                <span className="block font-gazpacho text-lg font-bold leading-tight text-ink">
                  {/* The leading count in theme red */}
                  <span className="text-pipili-red">{it.title.split(" ", 1)[0]}</span> {it.title.slice(it.title.indexOf(" ") + 1)}
                </span>
                <span className={`mt-1 block text-sm leading-snug text-ink/65 ${SYSTEM_FONT}`}>{it.body}</span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
