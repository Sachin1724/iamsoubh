import { StoryStage, type StoryBeat } from "@/components/StoryStage";

const BEATS: StoryBeat[] = [
  {
    image: "/assets/story/street.jpg",
    position: "50% 35%",
    title: "Where the Parba Begins",
    titleOr: "ପରବର ପ୍ରେରଣା",
    body: "Every place has a story. Sometimes, it is found in a temple, a familiar street, a festival, or a quiet moment by the water. These little details are what make Odisha feel like home.",
    bodyOr:
      "ପ୍ରତ୍ୟେକ ଜାଗାର ନିଜର ଏକ କାହାଣୀ ଅଛି। କେବେ ମନ୍ଦିରରେ, କେବେ ପରିଚିତ ଗଳିରେ, କେବେ ପର୍ବପର୍ବାଣୀରେ, ଆଉ କେବେ ନଦୀକୂଳର ନିରବ ମୁହୂର୍ତ୍ତରେ। ଏହି ଛୋଟ ଛୋଟ ଦୃଶ୍ୟ ଓ ସ୍ମୃତି ହିଁ ଓଡ଼ିଶାକୁ ଆମ ମନରେ ଘର କରି ରଖେ।",
  },
  {
    image: "/assets/story/temple.jpg",
    position: "50% 40%",
    kicker: "01 · The temple",
    title: "It starts with noticing.",
    titleOr: "ଦେଖିବାରୁ ହିଁ ଆରମ୍ଭ।",
    body: "The beauty of a temple in morning light, leaves moving in the breeze, and familiar surroundings. Ordinary moments often hold beautiful stories.",
    bodyOr:
      "ସକାଳର ଆଲୋକରେ ମନ୍ଦିରର ରୂପ, ପବନରେ ହଲୁଥିବା ପତ୍ର ଓ ଚାରିପାଖର ପରିଚିତ ଦୃଶ୍ୟ। ଆମ ଚାରିପାଖରେ ଥିବା ଏହି ସାଧାରଣ ମୁହୂର୍ତ୍ତଗୁଡ଼ିକ ମଧ୍ୟରେ ଲୁଚି ରହିଥାଏ ଅନେକ ସୁନ୍ଦର କାହାଣୀ।",
  },
  {
    image: "/assets/story/cards-hand.jpg",
    position: "40% 60%",
    kicker: "02 · Holding the cards",
    title: "A little piece of home.",
    titleOr: "ନିଜ ମାଟିର ଟିକିଏ ଝଲକ।",
    body: "Some places stay in our hearts, and some memories deserve to stay close. Each card captures a little of Odisha's familiar warmth.",
    bodyOr:
      "କିଛି ଦୃଶ୍ୟ ଆମ ମନରେ ରହିଯାଏ, କିଛି ସ୍ମୃତିକୁ ଆମେ ସବୁବେଳେ ପାଖରେ ରଖିବାକୁ ଚାହୁଁ। ଏହି କ୍ୟାଲେଣ୍ଡରର ପ୍ରତ୍ୟେକ କାର୍ଡ ଓଡ଼ିଶାର ସେହି ଆତ୍ମୀୟତାର ଏକ ଛୋଟ ଝଲକ।",
  },
  {
    image: "/assets/story/lake.jpg",
    position: "40% 50%",
    kicker: "03 · By the water",
    title: "Some ideas arrive quietly.",
    titleOr: "କିଛି ଭାବନା ନିରବରେ ଆସେ।",
    body: "New ideas sometimes emerge beside a quiet river or in a moment spent alone. When we slow down and look around, ordinary things begin to feel different.",
    bodyOr:
      "କେବେ ନଦୀକୂଳର ଶାନ୍ତ ପରିବେଶରେ, କେବେ ନିଜ ସହ କିଛି ସମୟ ବିତାଇବା ଭିତରେ ନୂଆ ଭାବନା ଜନ୍ମ ନିଏ। ଟିକେ ରହି ଚାରିପାଖକୁ ଦେଖିଲେ, ଅନେକ ଛୋଟ ଛୋଟ ଜିନିଷ ନୂଆ ଭାବେ ଦେଖାଯାଏ।",
  },
  {
    image: "/assets/story/steps.jpg",
    position: "50% 40%",
    kicker: "04 · The artist at work",
    title: "Look closer. There is a story here.",
    titleOr: "ପାଖରୁ ଦେଖ, ଏଠି ବି ଏକ କାହାଣୀ ଅଛି।",
    body: "Terracotta pots, old walls, people, and everyday work all have their own beauty. Each detail can inspire a new drawing.",
    bodyOr:
      "ମାଟିର ହାଣ୍ଡି, ପୁରୁଣା କାନ୍ଥ, ଲୋକଙ୍କ ଜୀବନ ଓ ସେମାନଙ୍କ ଦୈନନ୍ଦିନ କାମରେ ମଧ୍ୟ ରହିଛି ଏକ ନିଆରା ସୌନ୍ଦର୍ଯ୍ୟ। ଏହି ସବୁକୁ ଧ୍ୟାନରେ ଦେଖିଲେ, ପ୍ରତ୍ୟେକ ଦୃଶ୍ୟ ଏକ ନୂଆ ଚିତ୍ରର ପ୍ରେରଣା ହୋଇପାରେ।",
  },
  {
    image: "/assets/story/sketchbook.jpg",
    position: "50% 30%",
    kicker: "05 · The sketchbook",
    title: "Every line begins somewhere.",
    titleOr: "ପ୍ରତ୍ୟେକ ରେଖାର ଏକ ଆରମ୍ଭ ଥାଏ।",
    body: "Scenes that stay in the mind slowly become lines and colours. Some ideas take shape on paper, while others become new illustrations. This is where the artistic journey begins.",
    bodyOr:
      "ମନରେ ରହିଯାଇଥିବା ଦୃଶ୍ୟ ଧୀରେ ଧୀରେ ରେଖା ଓ ରଙ୍ଗର ରୂପ ନିଏ। କିଛି ଭାବନା କାଗଜରେ ଆକାର ପାଏ, ଆଉ କିଛି ଭାବନା ନୂଆ ଚିତ୍ରରେ ପରିଣତ ହୁଏ। ଏହିଠାରୁ ଆରମ୍ଭ ହୁଏ ଏକ କଳାତ୍ମକ ଯାତ୍ରା।",
  },
  {
    image: "/assets/story/cards-flat.jpg",
    position: "40% 50%",
    kicker: "06 · The finished cards",
    title: "Moments become parba.",
    titleOr: "ସ୍ମୃତିରୁ ଜନ୍ମ ନିଏ ପରବ।",
    body: "These little inspirations become festival illustrations: twelve festival cards and one special sealed 13th parba, keeping a little of Odisha close throughout the year.",
    bodyOr:
      "ଏହି ଛୋଟ ଛୋଟ ପ୍ରେରଣା ଓ ଭାବନା ମିଶି ରୂପ ନିଏ ପର୍ବପର୍ବାଣୀର ଚିତ୍ରରେ। ବାରଟି ପର୍ବର କାର୍ଡ ଓ ଗୋଟିଏ ସ୍ୱତନ୍ତ୍ର, ସିଲ୍ ହୋଇଥିବା ତ୍ରୟୋଦଶ ପରବ—ଯାହା ଆମକୁ ବର୍ଷସାରା ଓଡ଼ିଶାର କିଛି ସ୍ମୃତି ନିଜ ପାଖରେ ରଖିବାର ସୁଯୋଗ ଦିଏ।",
  },
  {
    image: "/assets/story/cards-hand.jpg",
    position: "40% 60%",
    title: "Not just dates. A little of Odisha, kept close.",
    bodyOr: "କେବଳ ତାରିଖ ନୁହେଁ। ଓଡ଼ିଶାର ଟିକିଏ ଆତ୍ମୀୟତା, ସବୁବେଳେ ପାଖରେ।",
    accent: true,
  },
];

export function SoundFamiliar() {
  return <StoryStage id="sound-familiar" number="02" beats={BEATS} />;
}
