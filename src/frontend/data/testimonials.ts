export interface StoryItem {
  id: string;
  name: string;
  handle: string;
  city: string;
  stateOrCountry: string;
  quote: string;
  image: string;
  hasTickedTracker?: boolean;
}

export const cityCodeMap: Record<string, string> = {
  Bhubaneswar: "BBSR",
  Cuttack: "CTC",
  Sambalpur: "SBP",
  Bengaluru: "BLR",
  Hyderabad: "HYD",
  Delhi: "DEL",
  Pune: "PUN",
};

// Cities strictly adhering to the brief:
// Bhubaneswar, Cuttack, Sambalpur, Bengaluru, Hyderabad, Delhi, Pune
// (San Jose, Mumbai, and Kolkata are excluded per the brief)
export const testimonials: StoryItem[] = [
  {
    id: "story-1",
    name: "Sidharth",
    handle: "@sidharth_b",
    city: "Bhubaneswar",
    stateOrCountry: "Odisha",
    quote: "Used a card to confess my feelings. Best and most unique Odisha gift ever.",
    image: "",
    hasTickedTracker: true,
  },
  {
    id: "story-2",
    name: "Priyal",
    handle: "@priyal_p",
    city: "Cuttack",
    stateOrCountry: "Odisha",
    quote: "Actually ticked the boxes this year. Tradition tracker is pure genius!",
    image: "",
    hasTickedTracker: true,
  },
  {
    id: "story-3",
    name: "Ranjan",
    handle: "@ranjan_sbp",
    city: "Sambalpur",
    stateOrCountry: "Odisha",
    quote: "Nuakhai card felt so personal. My parents put it right in our puja room.",
    image: "",
    hasTickedTracker: true,
  },
  {
    id: "story-4",
    name: "Ananya",
    handle: "@ananya_m",
    city: "Bengaluru",
    stateOrCountry: "Karnataka",
    quote: "Maa smiled seeing the Manabasa card on our dining wall in Indiranagar.",
    image: "",
    hasTickedTracker: true,
  },
  {
    id: "story-5",
    name: "Debasis",
    handle: "@debasis_hyd",
    city: "Hyderabad",
    stateOrCountry: "Telangana",
    quote: "Proudly kept it on my office desk in Gachibowli. Colleagues kept asking where to buy.",
    image: "",
    hasTickedTracker: true,
  },
  {
    id: "story-6",
    name: "Umam",
    handle: "@umam_writes",
    city: "Delhi",
    stateOrCountry: "Delhi NCR",
    quote: "A daily piece of home away from home between spreadsheets in Gurgaon.",
    image: "",
    hasTickedTracker: true,
  },
  {
    id: "story-7",
    name: "Pratiksha",
    handle: "@pratiksha_pun",
    city: "Pune",
    stateOrCountry: "Maharashtra",
    quote: "Bara Masa Tera Parba in Baner! Beautiful print fidelity and heavy paper stock.",
    image: "",
    hasTickedTracker: true,
  },
  {
    id: "story-8",
    name: "Chinmay",
    handle: "@chinmay_bbsr",
    city: "Bhubaneswar",
    stateOrCountry: "Odisha",
    quote: "Rath Yatra reminder saved my leave application. Thank you Soubh!",
    image: "",
    hasTickedTracker: true,
  },
  {
    id: "story-9",
    name: "Lipika",
    handle: "@lipika_blr",
    city: "Bengaluru",
    stateOrCountry: "Karnataka",
    quote: "Showed it to my non-Odia roommate and now she wants to visit Puri for Rath Yatra.",
    image: "",
    hasTickedTracker: false,
  },
  {
    id: "story-10",
    name: "Subrat",
    handle: "@subrat_hyd",
    city: "Hyderabad",
    stateOrCountry: "Telangana",
    quote: "The texture of the card board is unmatched. Looking forward to 2027 edition.",
    image: "",
    hasTickedTracker: true,
  },
  {
    id: "story-11",
    name: "Swati",
    handle: "@swati_ctc",
    city: "Cuttack",
    stateOrCountry: "Odisha",
    quote: "Bali Jatra memories right on my study desk. Absolute nostalgia.",
    image: "",
    hasTickedTracker: false,
  },
  {
    id: "story-12",
    name: "Amit",
    handle: "@amit_del",
    city: "Delhi",
    stateOrCountry: "Delhi NCR",
    quote: "Arrived in crisp condition through courier. Packaging was 10/10.",
    image: "",
    hasTickedTracker: true,
  },
];

export const cityFilters = [
  "All",
  "Bhubaneswar",
  "Cuttack",
  "Sambalpur",
  "Bengaluru",
  "Hyderabad",
  "Delhi",
  "Pune",
];
