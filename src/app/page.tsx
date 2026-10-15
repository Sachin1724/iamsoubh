"use client";

import React, { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { SoundFamiliar } from "@/components/SoundFamiliar";
import { MonthCarousel } from "@/components/MonthCarousel";
import { BuyerStories } from "@/components/BuyerStories";
import { CreatorVideos } from "@/components/CreatorVideos";
import { PreorderSection } from "@/components/PreorderSection";
import { BulkSection } from "@/components/BulkSection";
import { FaqSection } from "@/components/FaqSection";
import { Footer } from "@/components/Footer";
import { StickyMobileBar } from "@/components/StickyMobileBar";
import { QuoteModal } from "@/components/QuoteModal";
import { captureUtm } from "@/lib/utm";

export default function HomePage() {
  const [quoteOpen, setQuoteOpen] = useState(false);

  useEffect(() => {
    captureUtm();
  }, []);

  const scrollToPreorder = () => {
    document.getElementById("preorder")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <main className="min-h-screen flex flex-col bg-[#F6EFE2] relative selection:bg-[#E0A526] selection:text-[#1B1B1B] overflow-x-clip pb-28 md:pb-0">
      <Header onOrderClick={scrollToPreorder} />

      {/* 01: Hero */}
      <Hero onOrderClick={scrollToPreorder} />
      <div className="strip strip-pattachitra" aria-hidden />

      {/* 02: Sound Familiar? */}
      <SoundFamiliar />
      <div className="strip strip-pattachitra" aria-hidden />

      {/* 03: Inside the Calendar */}
      <MonthCarousel />
      <div className="strip strip-pattachitra" aria-hidden />

      {/* 04: Stories */}
      <BuyerStories />
      <div className="strip strip-pattachitra" aria-hidden />

      {/* 05: On Camera */}
      <CreatorVideos />
      <div className="strip strip-pattachitra" aria-hidden />

      {/* 06: Order Now */}
      <PreorderSection onRequestQuote={() => setQuoteOpen(true)} />
      <div className="strip strip-pattachitra" aria-hidden />

      {/* 07: Bulk and Gifting */}
      <BulkSection onRequestQuote={() => setQuoteOpen(true)} />
      <div className="strip strip-pattachitra" aria-hidden />

      {/* 08: Questions (FAQ) */}
      <FaqSection />
      <div className="strip strip-pattachitra" aria-hidden />

      {/* Footer */}
      <Footer />

      {/* Mobile Sticky CTA */}
      <StickyMobileBar onOrderClick={scrollToPreorder} />

      {/* Interactive Modals */}
      <QuoteModal open={quoteOpen} onClose={() => setQuoteOpen(false)} />
    </main>
  );
}
