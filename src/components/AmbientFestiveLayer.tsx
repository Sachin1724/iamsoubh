"use client";

import React from "react";
import Image from "next/image";

// Predefined deterministic particle configurations with negative delays
const GOLD_SPARKS = [
  { id: 1, left: "12%", bottom: "12%", size: 4, duration: 8, delay: -1.5 },
  { id: 2, left: "24%", bottom: "20%", size: 5, duration: 10, delay: -4.2 },
  { id: 3, left: "36%", bottom: "10%", size: 3, duration: 7, delay: -2.8 },
  { id: 4, left: "50%", bottom: "16%", size: 5, duration: 9, delay: -5.7 },
  { id: 5, left: "65%", bottom: "12%", size: 4, duration: 8, delay: -3.1 },
  { id: 6, left: "78%", bottom: "22%", size: 5, duration: 11, delay: -6.4 },
  { id: 7, left: "88%", bottom: "15%", size: 3, duration: 7, delay: -1.9 },
  { id: 8, left: "44%", bottom: "26%", size: 4, duration: 9, delay: -4.9 },
];

export function AmbientFestiveLayer() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 select-none" aria-hidden="true">
      {/* 1. Tactile Handmade Canvas Fiber Texture */}
      <div
        className="absolute inset-0 opacity-[0.06] bg-repeat z-0"
        style={{ backgroundImage: "url('/assets/folk-pattern-tile.png')", backgroundSize: "160px" }}
      />

      {/* 2. Radiant Golden Temple Courtyard Sunbeam Glow */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_75%_55%_at_50%_68%,rgba(245,158,11,0.14)_0%,rgba(224,165,38,0.07)_45%,transparent_75%)]" />

      {/* 3. Deep Antique Parchment Vignette */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(138,23,23,0.035)_75%,rgba(70,25,10,0.08)_100%)]" />

      {/* 4. Authentic Odisha Tala Pata Chitra (Palm-Leaf Engraving Tapestry) Mural */}
      <div className="absolute inset-0 z-0 overflow-hidden select-none pointer-events-none">
        <Image
          src="/assets/scene/tala-pata-chitra-mural.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-center opacity-[0.18] sm:opacity-[0.20] md:opacity-[0.22] mix-blend-multiply filter contrast-[1.08] sepia-[0.25]"
        />
        {/* Soft center feather mask so headline & cards breathe with maximum contrast */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_40%,rgba(250,246,238,0.65)_0%,rgba(250,246,238,0.15)_65%,transparent_100%)]" />
      </div>

      {/* 9. Holy Fire Diya Sparks & Sunbeam Dust Motes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-10">
        {GOLD_SPARKS.map((spark) => (
          <div
            key={spark.id}
            className="absolute rounded-full bg-gold shadow-[0_0_8px_#F59E0B] will-change-transform festive-motion"
            style={{
              left: spark.left,
              bottom: spark.bottom,
              width: `${spark.size}px`,
              height: `${spark.size}px`,
              animation: `sparkFloat ${spark.duration}s ease-in-out ${spark.delay}s infinite`,
            }}
          />
        ))}
      </div>

      {/* Direct Component Styles to guarantee keyframe injection in Next.js/Tailwind v4 */}
      <style>{`
        @keyframes sparkFloat {
          0% {
            transform: translateY(0) scale(0.6);
            opacity: 0;
          }
          20% {
            opacity: 0.95;
            transform: translateY(-28px) scale(1.1);
          }
          80% {
            opacity: 0.8;
          }
          100% {
            transform: translateY(-130px) scale(0.3);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}
