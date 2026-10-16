import dynamic from "next/dynamic";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { SoundFamiliar } from "@/components/SoundFamiliar";
import { PreorderSection } from "@/components/PreorderSection";
import { FaqSection } from "@/components/FaqSection";
import { Footer } from "@/components/Footer";
import { StickyMobileBar } from "@/components/StickyMobileBar";
import { BulkQuoteManager } from "@/components/BulkQuoteManager";
import { UtmTracker } from "@/components/UtmTracker";

// Dynamic code splitting for below-the-fold interactive carousels:
// Server renders the HTML while deferring non-critical JS chunks until needed.
const MonthCarousel = dynamic(
  () => import("@/components/MonthCarousel").then((m) => m.MonthCarousel),
  { ssr: true }
);

const BuyerStories = dynamic(
  () => import("@/components/BuyerStories").then((m) => m.BuyerStories),
  { ssr: true }
);

const CreatorVideos = dynamic(
  () => import("@/components/CreatorVideos").then((m) => m.CreatorVideos),
  { ssr: true }
);

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col bg-[#F6EFE2] relative selection:bg-[#E0A526] selection:text-[#1B1B1B] overflow-x-clip">
      <UtmTracker />
      <Header />

      {/* 01: Hero */}
      <Hero />
      <div className="strip strip-pattachitra" aria-hidden />

      {/* 02: Sound Familiar? (Pure Server Component) */}
      <SoundFamiliar />
      <div className="strip strip-pattachitra" aria-hidden />

      {/* 03: Inside the Calendar (Dynamic Client Island) */}
      <MonthCarousel />
      <div className="strip strip-pattachitra" aria-hidden />

      {/* 04: Stories (Dynamic Client Island) */}
      <BuyerStories />
      <div className="strip strip-pattachitra" aria-hidden />

      {/* 05: On Camera (Dynamic Client Island) */}
      <CreatorVideos />
      <div className="strip strip-pattachitra" aria-hidden />

      {/* 06: Order Now */}
      <PreorderSection />
      <div className="strip strip-pattachitra" aria-hidden />

      {/* 07: Bulk and Gifting with Lazy Quote Modal */}
      <BulkQuoteManager />
      <div className="strip strip-pattachitra" aria-hidden />

      {/* 08: Questions (FAQ) */}
      <FaqSection />
      <div className="strip strip-pattachitra" aria-hidden />

      {/* Footer (Pure Server Component) */}
      <Footer />

      {/* Mobile Sticky CTA */}
      <StickyMobileBar />
    </main>
  );
}
