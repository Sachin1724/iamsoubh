export interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

// Six questions only. Short words, short sentences — the way you'd say it to
// a friend. Anything longer belongs on the policy pages.
export const faqs: FAQItem[] = [
  {
    id: "faq-1",
    question: "When will I get my box?",
    answer:
      "We start shipping in the first week of November. Most orders reach you within a week after that. You'll get the tracking link by email.",
  },
  {
    id: "faq-2",
    question: "Is delivery really free?",
    answer:
      "Yes. Free delivery anywhere in India, whether you buy 1, 3 or 5 boxes. We don't ship outside India this year.",
  },
  {
    id: "faq-3",
    question: "What's inside the box?",
    answer:
      "12 festival cards with a painting on the front and the month's dates on the back, 1 sealed 13th parba card, a New Year postcard, a sticker sheet and a thank-you card. Each card is 8 × 11 cm, about the size of a postcard.",
  },
  {
    id: "faq-4",
    question: "What is the 13th parba?",
    answer:
      "A sealed surprise card. It's one of three festivals most calendars miss: Sahi Jata, Sitalsasthi or Gajalaxmi Puja. Every box gets one at random, and you find out which when you open it. More boxes, more chances to collect all three.",
  },
  {
    id: "faq-5",
    question: "What if it's late or damaged?",
    answer:
      "If your order hasn't shipped by 15 November, you get a full refund. If it arrives damaged, email us a photo within 48 hours and we'll send a new one free.",
  },
  {
    id: "faq-6",
    question: "Can I cancel?",
    answer:
      "Yes, any time before it ships. Email us and you'll get your money back in full.",
  },
];
