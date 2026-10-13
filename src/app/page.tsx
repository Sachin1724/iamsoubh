"use client";

import React, { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { SoundFamiliar } from "@/components/SoundFamiliar";
import { MonthCarousel } from "@/components/MonthCarousel";
import { BuyerStories } from "@/components/BuyerStories";
import { WhatsInside } from "@/components/WhatsInside";
import { CreatorVideos } from "@/components/CreatorVideos";
import { PreorderSection, OrderData } from "@/components/PreorderSection";
import { BulkSection } from "@/components/BulkSection";
import { FaqSection } from "@/components/FaqSection";
import { Footer } from "@/components/Footer";
import { StickyMobileBar } from "@/components/StickyMobileBar";
import { OrderModal } from "@/components/OrderModal";
import { QuoteModal } from "@/components/QuoteModal";
import { captureUtm } from "@/lib/utm";

export default function HomePage() {
  const [activeOrder, setActiveOrder] = useState<OrderData | null>(null);
  const [quoteOpen, setQuoteOpen] = useState(false);

  useEffect(() => {
    captureUtm();
  }, []);

  const scrollToPreorder = () => {
    document.getElementById("preorder")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <main className="min-h-screen flex flex-col bg-[#F6EFE2] relative">
      <Header onOrderClick={scrollToPreorder} />

      <Hero onOrderClick={scrollToPreorder} />
      <div className="strip strip-pattachitra" aria-hidden />
      <SoundFamiliar />
      <div className="strip strip-ikat" aria-hidden />
      <MonthCarousel />
      <div className="strip strip-pattachitra" aria-hidden />
      <BuyerStories />
      <WhatsInside />
      <div className="strip strip-ikat" aria-hidden />
      <CreatorVideos />
      <div className="strip strip-pattachitra" aria-hidden />
      <PreorderSection
        onProceedToCheckout={setActiveOrder}
        onRequestQuote={() => setQuoteOpen(true)}
      />
      <div className="strip strip-ikat" aria-hidden />
      <BulkSection onRequestQuote={() => setQuoteOpen(true)} />
      <div className="strip strip-pattachitra" aria-hidden />
      <FaqSection />

      <div className="strip strip-ikat" aria-hidden />
      <Footer />

      <StickyMobileBar onOrderClick={scrollToPreorder} />

      {activeOrder && (
        <OrderModal order={activeOrder} onClose={() => setActiveOrder(null)} />
      )}
      <QuoteModal open={quoteOpen} onClose={() => setQuoteOpen(false)} />
    </main>
  );
}
