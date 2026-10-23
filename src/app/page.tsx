import dynamic from "next/dynamic";
import { Header } from "@/frontend/components/Header";
import { Hero } from "@/frontend/components/Hero";
import { SoundFamiliar } from "@/frontend/components/SoundFamiliar";
import { FreeShipping } from "@/frontend/components/FreeShipping";
import { PreorderSection } from "@/frontend/components/PreorderSection";
import { FaqSection } from "@/frontend/components/FaqSection";
import { Footer } from "@/frontend/components/Footer";
import { StickyMobileBar } from "@/frontend/components/StickyMobileBar";
import { BulkQuoteManager } from "@/frontend/components/BulkQuoteManager";
import { UtmTracker } from "@/frontend/components/UtmTracker";
import { ScrollPhysics } from "@/frontend/components/ScrollPhysics";

// Dynamic code splitting for below-the-fold interactive carousels:
// Server renders the HTML while deferring non-critical JS chunks until needed.
const InsideTheBox = dynamic(
  () => import("@/frontend/components/InsideTheBox").then((m) => m.InsideTheBox),
  { ssr: true }
);

const CreatorVideos = dynamic(
  () => import("@/frontend/components/CreatorVideos").then((m) => m.CreatorVideos),
  { ssr: true }
);

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col bg-pipili-cream relative selection:bg-turmeric selection:text-ink overflow-x-clip">
      <UtmTracker />
      <ScrollPhysics />
      <Header />

      {/* 01: Hero */}
      <Hero />
      <div className="strip strip-pattachitra" aria-hidden />

      {/* 02: one pinned section, three scrolls: Stories, then "Sound familiar?" (the lines) */}
      <SoundFamiliar />
      <div className="strip strip-pattachitra" aria-hidden />

      {/* 03: what you get inside, then the buy page */}
      <InsideTheBox />
      <div className="strip strip-pattachitra" aria-hidden />
      <PreorderSection />
      <div className="strip strip-pattachitra" aria-hidden />

      {/* Free shipping, all of India */}
      <FreeShipping />
      <div className="strip strip-pattachitra" aria-hidden />

      {/* From the creators */}
      <CreatorVideos />
      <div className="strip strip-pattachitra" aria-hidden />

      {/* Bulk and Gifting with Lazy Quote Modal */}
      <BulkQuoteManager />
      <div className="strip strip-pattachitra" aria-hidden />

      {/* Questions (FAQ) */}
      <FaqSection />
      <div className="strip strip-pattachitra" aria-hidden />

      {/* Footer (Pure Server Component) */}
      <Footer />

      {/* Mobile Sticky CTA */}
      <StickyMobileBar />
    </main>
  );
}
