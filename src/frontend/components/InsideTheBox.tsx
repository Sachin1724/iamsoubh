import { products, siteConfig } from "@/config/site-config";
import { StoryStage, type StoryBeat } from "@/frontend/components/StoryStage";

/**
 * Section 03. The contents of the box, one item per scroll step: photo, count
 * and the one line that says what it is. The order button closes the story.
 */
const BEATS: StoryBeat[] = [
  {
    image: "/assets/story/flatlay.jpg",
    position: "55% 40%",
    title: "What you get inside.",
    body: "Everything in the box, in the order you will find it.",
  },
  {
    image: "/assets/story/card-january.jpg",
    position: "50% 45%",
    count: "12",
    title: "festival cards",
    body: "A painting on the front, the month's dates on the back.",
  },
  {
    image: "/assets/story/box-hand.jpg",
    position: "45% 55%",
    count: "1",
    title: "sealed 13th parba",
    locked: true,
    body: "One of three. You meet yours when the box lands.",
  },
  {
    image: "/assets/story/cards-flat.jpg",
    position: "40% 50%",
    count: "1",
    title: "Odia New Year postcard",
    body: "Pana Sankranti wishes, ready to send home.",
  },
  {
    image: "/assets/story/cards-hand.jpg",
    position: "40% 60%",
    count: "1",
    title: "premium surprise sticker set",
    accent: true,
    body: "Parba art for your laptop and your diary. A different surprise in every box.",
    cta: {
      label: "Pre-order now",
      href: "#preorder",
      note: `From ₹${products.gift.perBox} a box · ${siteConfig.freeDeliveryLabel}`,
    },
  },
];

export function InsideTheBox() {
  return <StoryStage id="inside-calendar" number="03" beats={BEATS} checklist={{ title: "In your box" }} />;
}
