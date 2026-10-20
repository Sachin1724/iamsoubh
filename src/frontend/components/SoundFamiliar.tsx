import { StoryStage, type StoryBeat } from "@/frontend/components/StoryStage";

const BEATS: StoryBeat[] = [
  {
    image: "/assets/story/street.jpg",
    position: "50% 35%",
    kicker: "Sound familiar?",
    title: "For everyone who misses Odisha without saying it.",
    titleOr: "କାହାକୁ ନକହି ମନେ ମନେ ଓଡ଼ିଶାକୁ ଝୁରୁଥିବା ସମସ୍ତଙ୍କ ପାଇଁ।",
  },
  {
    image: "/assets/story/cards-hand.jpg",
    position: "40% 60%",
    kicker: "01 · Raja",
    title: "Raja came and went. You found out from someone's story.",
    titleOr: "ରଜ ଆସି ଚାଲି ବି ଗଲା, ଆଉ ତମକୁ ଖବର ମିଳିଲା କାହାର ଷ୍ଟୋରିରୁ।",
    bodyOr: "ଗାଁ ଦୋଳି, ପାନ ଖିଆ ଆଉ ପିଠାର ବାସ୍ନା... ସବୁକିଛି ଫୋନ୍ ସ୍କ୍ରିନ୍‌ରେ ହିଁ ଦେଖି ରହିଗଲ।",
  },
  {
    image: "/assets/story/temple.jpg",
    position: "50% 40%",
    kicker: "02 · Rath Yatra",
    title: "You watched Rath Yatra on reels. From 1,000 km away. Again.",
    titleOr: "ସେଇ ହଜାରେ କି.ମି. ଦୂରରୁ ଫୋନ୍ ରିଲ୍ସରେ ରଥଯାତ୍ରା ଦେଖିଲ। ପୁଣି ଏ ବର୍ଷ ବି।",
    bodyOr: "ବଡ଼ଦାଣ୍ଡର ଭିଡ଼, ଘଣ୍ଟର ଶବ୍ଦ ଆଉ କାଳିଆ ସାଆନ୍ତଙ୍କ ରଥ ଟଣା—କେବଳ ଏକ ଭିଡିଓ ହୋଇ ରହିଗଲା।",
  },
  {
    image: "/assets/story/steps.jpg",
    position: "50% 40%",
    kicker: "03 · Pitha",
    title: "Maa asked, \"Pitha khailu?\" You said yes. Your last pitha was months ago.",
    titleOr: "ବୋଉ ପଚାରିଲା, \"ପିଠା ଖାଇଲୁ କିରେ?\" ତମେ ହଁ ତ କହିଦେଲ, କିନ୍ତୁ ଶେଷ ପିଠା ଖାଇବାର ମାସ ମାସ ବିତିଗଲାଣି।",
    bodyOr: "ମାଟି ହାଣ୍ଡିରେ ବାମ୍ଫ ଦିଆ ଏଣ୍ଡୁରି ଆଉ ପୋଡ଼ପିଠାର ସ୍ୱାଦ ଆଜି ବି ମନେ ଅଛି, ବାସ୍ ପାଖରେ କେହି ନାହାନ୍ତି।",
  },
  {
    image: "/assets/story/lake.jpg",
    position: "40% 50%",
    kicker: "04 · Pana Sankranti",
    title: "You wished Maa for Pana Sankranti. A day late.",
    titleOr: "ବୋଉକୁ ପଣା ସଂକ୍ରାନ୍ତି ଶୁଭେଚ୍ଛା ତ ଜଣାଇଲ, ହେଲେ ଗୋଟିଏ ଦିନ ଡେରିରେ।",
    bodyOr: "ଘରେ ବେଲ ପଣା ତିଆରି ସରିଥିବ, କିନ୍ତୁ କ୍ୟାଲେଣ୍ଡର ତାରିଖ ମନେ ନରହିବାରୁ ଆଉ ଗୋଟିଏ ପର୍ବ ବିତିଗଲା।",
  },
  {
    image: "/assets/story/cards-flat.jpg",
    position: "40% 50%",
    kicker: "This is why we made it",
    title: "This calendar keeps the dates for you.",
    titleOr: "ଏହି କ୍ୟାଲେଣ୍ଡର ତମ ପାଇଁ ତାରିଖ ମନେ ରଖିବ।",
    body: "One card for every month. Keep it on your desk, and when you celebrate, tick the box on the back.",
    bodyOr: "ପ୍ରତି ମାସ ପାଇଁ ଗୋଟିଏ ଲେଖାଏଁ କାର୍ଡ। ନିଜ ଡେସ୍କ ଉପରେ ସଜାଇ ରଖ, ଆଉ ଯେବେ ପରବ ମନାଇବ, ପଛପଟେ ଟିକ୍ (✓) ଚିହ୍ନ ଦେଇଦିଅ।",
    accent: true,
  },
];

export function SoundFamiliar() {
  return <StoryStage id="sound-familiar" number="02" beats={BEATS} />;
}
