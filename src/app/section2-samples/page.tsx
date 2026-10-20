"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export default function Section2SamplesPage() {
  const [activeTab, setActiveTab] = useState<"editorial" | "bento">("editorial");

  return (
    <main className="min-h-screen bg-pipili-cream flex flex-col selection:bg-turmeric selection:text-ink">
      <Header />

      <div className="pt-28 pb-10 bg-pipili-indigo text-cream border-b border-turmeric/20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-turmeric/10 border border-turmeric/30 text-turmeric text-xs font-bold uppercase tracking-wider mb-3">
            Design Laboratory
          </div>
          <h1 className="text-3xl sm:text-5xl font-gazpacho font-bold text-cream">
            Section 2 Variations: Craft & Living Traditions
          </h1>
          <p className="mt-3 font-subtext text-cream/80 max-w-2xl text-sm sm:text-base">
            Exploring how to present authentic photography of the making process, artisans, everyday society, and natural settings inside Section 2.
          </p>

          {/* Tab Selector */}
          <div className="mt-8 flex gap-3 p-1.5 bg-black/30 backdrop-blur-md rounded-2xl w-fit border border-white/10">
            <button
              type="button"
              onClick={() => setActiveTab("editorial")}
              className={`px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all duration-200 ${
                activeTab === "editorial"
                  ? "bg-turmeric text-ink shadow-lg shadow-turmeric/20"
                  : "text-cream/70 hover:text-cream hover:bg-white/5"
              }`}
            >
              Option 1: The "Roots & Making" Editorial Tape
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("bento")}
              className={`px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all duration-200 ${
                activeTab === "bento"
                  ? "bg-turmeric text-ink shadow-lg shadow-turmeric/20"
                  : "text-cream/70 hover:text-cream hover:bg-white/5"
              }`}
            >
              Option 2: Integrated Story & Society Bento Grid
            </button>
          </div>
        </div>
      </div>

      <div className="py-12 bg-pipili-indigo flex-1">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          {activeTab === "editorial" && (
            <div className="space-y-8 animate-fadeIn">
              <div className="rounded-3xl border border-white/15 overflow-hidden shadow-2xl bg-black/40">
                <div className="p-4 bg-white/5 border-b border-white/10 flex items-center justify-between text-xs text-cream/70">
                  <span className="font-mono">UI Design Mockup — Option 1</span>
                  <span className="text-turmeric font-semibold">Editorial Filmstrip Layout</span>
                </div>
                <div className="relative aspect-[16/9] w-full">
                  <Image
                    src="/assets/samples/craft-story-sample.jpg"
                    alt="Editorial Craft Story Mockup"
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-white/5 border border-white/10 text-cream text-sm space-y-3">
                <h3 className="font-gazpacho font-bold text-xl text-turmeric">Why Option 1 works:</h3>
                <p className="text-cream/80">
                  • Maintains the 4 relatable festival nostalgia cards at the top, followed by an immediate visual answer: <em>"Where does this come from?"</em>
                </p>
                <p className="text-cream/80">
                  • 3 high-impact story pillars: <strong>Handmade by Artisans</strong> (the craft), <strong>Living Traditions</strong> (family & community), and <strong>Warmed by Nature</strong> (organic setting).
                </p>
              </div>
            </div>
          )}

          {activeTab === "bento" && (
            <div className="space-y-8 animate-fadeIn">
              <div className="rounded-3xl border border-white/15 overflow-hidden shadow-2xl bg-black/40">
                <div className="p-4 bg-white/5 border-b border-white/10 flex items-center justify-between text-xs text-cream/70">
                  <span className="font-mono">UI Design Mockup — Option 2</span>
                  <span className="text-turmeric font-semibold">Integrated Bento Grid</span>
                </div>
                <div className="relative aspect-[16/9] w-full">
                  <Image
                    src="/assets/samples/bento-sample.jpg"
                    alt="Bento Grid Mockup"
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-white/5 border border-white/10 text-cream text-sm space-y-3">
                <h3 className="font-gazpacho font-bold text-xl text-turmeric">Why Option 2 works:</h3>
                <p className="text-cream/80">
                  • Blends the funny/poignant relatable quote cards alongside authentic artisan & lifestyle photography in one unified mosaic.
                </p>
                <p className="text-cream/80">
                  • High visual rhythm: alternating between warm illustrated graphics, sunny village courtyards, and tea in nature.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </main>
  );
}
