"use client";

import React from "react";
import Image from "next/image";

// Predefined deterministic particle configurations with negative delays
// Negative delays guarantee leaves and petals are ALREADY gracefully drifting across the viewport on load!
const FESTIVE_LEAVES = [
  { id: 1, left: "4%", size: 21, duration: 15, delay: -2.4, swayDuration: 3.8, rotate: 25, shape: "petal", color1: "#F59E0B", color2: "#C8221A" },
  { id: 2, left: "11%", size: 22, duration: 19, delay: -8.1, swayDuration: 4.5, rotate: -40, shape: "slender", color1: "#E0A526", color2: "#D9651E" },
  { id: 3, left: "19%", size: 18, duration: 16, delay: -12.6, swayDuration: 3.2, rotate: 60, shape: "petal", color1: "#FBBF24", color2: "#EA580C" },
  { id: 4, left: "27%", size: 23, duration: 21, delay: -5.3, swayDuration: 5.0, rotate: -15, shape: "slender", color1: "#F59E0B", color2: "#8A1717" },
  { id: 5, left: "36%", size: 20, duration: 17, delay: -14.2, swayDuration: 4.1, rotate: 45, shape: "petal", color1: "#E0A526", color2: "#C8221A" },
  { id: 6, left: "44%", size: 17, duration: 23, delay: -1.8, swayDuration: 4.7, rotate: -30, shape: "slender", color1: "#FBBF24", color2: "#D9651E" },
  { id: 7, left: "53%", size: 22, duration: 16, delay: -9.5, swayDuration: 3.6, rotate: 70, shape: "petal", color1: "#F59E0B", color2: "#C8221A" },
  { id: 8, left: "61%", size: 24, duration: 20, delay: -16.0, swayDuration: 4.9, rotate: -50, shape: "slender", color1: "#E0A526", color2: "#EA580C" },
  { id: 9, left: "69%", size: 19, duration: 15, delay: -6.7, swayDuration: 3.4, rotate: 35, shape: "petal", color1: "#FBBF24", color2: "#8A1717" },
  { id: 10, left: "77%", size: 23, duration: 22, delay: -11.3, swayDuration: 5.2, rotate: -20, shape: "slender", color1: "#F59E0B", color2: "#D9651E" },
  { id: 11, left: "85%", size: 21, duration: 18, delay: -3.9, swayDuration: 4.3, rotate: 55, shape: "petal", color1: "#E0A526", color2: "#C8221A" },
  { id: 12, left: "93%", size: 18, duration: 24, delay: -13.8, swayDuration: 4.8, rotate: -45, shape: "slender", color1: "#FBBF24", color2: "#EA580C" },
  { id: 13, left: "15%", size: 20, duration: 17, delay: -4.8, swayDuration: 3.9, rotate: 15, shape: "petal", color1: "#F59E0B", color2: "#C8221A" },
  { id: 14, left: "40%", size: 22, duration: 19, delay: -10.5, swayDuration: 4.4, rotate: -25, shape: "slender", color1: "#E0A526", color2: "#8A1717" },
  { id: 15, left: "58%", size: 19, duration: 15, delay: -7.2, swayDuration: 3.5, rotate: 40, shape: "petal", color1: "#FBBF24", color2: "#D9651E" },
  { id: 16, left: "81%", size: 22, duration: 21, delay: -17.4, swayDuration: 4.6, rotate: -60, shape: "slender", color1: "#F59E0B", color2: "#EA580C" },
];

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

      {/* 8. Falling Sacred Leaves & Petals Layer */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-10">
        {FESTIVE_LEAVES.map((item) => (
          <div
            key={item.id}
            className="absolute top-0 will-change-transform"
            style={{
              left: item.left,
              animation: `petalFall ${item.duration}s linear ${item.delay}s infinite`,
            }}
          >
            <div
              style={{
                animation: `petalSway ${item.swayDuration}s ease-in-out infinite alternate`,
              }}
            >
              {item.shape === "slender" ? (
                /* Slender Tapered Festive Leaf */
                <svg
                  width={item.size * 0.9}
                  height={item.size * 1.5}
                  viewBox="0 0 20 36"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="opacity-85 drop-shadow-[0_2px_4px_rgba(138,23,23,0.22)] will-change-transform"
                  style={{ transform: `rotate(${item.rotate}deg)` }}
                >
                  <defs>
                    <linearGradient id={`leaf-grad-${item.id}`} x1="10" y1="0" x2="10" y2="36" gradientUnits="userSpaceOnUse">
                      <stop offset="0%" stopColor={item.color1} />
                      <stop offset="100%" stopColor={item.color2} />
                    </linearGradient>
                  </defs>
                  {/* Organic slender curved leaf blade */}
                  <path
                    d="M10 0C15 8 19 18 17 27C15.5 33 12 36 10 36C8 36 4.5 33 3 27C1 18 5 8 10 0Z"
                    fill={`url(#leaf-grad-${item.id})`}
                  />
                  {/* Spine vein */}
                  <path
                    d="M10 3C10.8 11 11.2 21 10 32"
                    stroke="rgba(255,255,255,0.4)"
                    strokeWidth="1"
                    strokeLinecap="round"
                  />
                </svg>
              ) : (
                /* Classic Organic Curved Petal / Leaf with Warm Highlight */
                <svg
                  width={item.size}
                  height={item.size * 1.35}
                  viewBox="0 0 24 32"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="opacity-85 drop-shadow-[0_2px_4px_rgba(138,23,23,0.22)] will-change-transform"
                  style={{ transform: `rotate(${item.rotate}deg)` }}
                >
                  <defs>
                    <linearGradient id={`petal-grad-${item.id}`} x1="12" y1="0" x2="12" y2="32" gradientUnits="userSpaceOnUse">
                      <stop offset="0%" stopColor={item.color1} />
                      <stop offset="100%" stopColor={item.color2} />
                    </linearGradient>
                  </defs>
                  <path
                    d="M12 0C17.8 7 24 15.5 24 23C24 28 18.6 32 12 32C5.4 32 0 28 0 23C0 15.5 6.2 7 12 0Z"
                    fill={`url(#petal-grad-${item.id})`}
                  />
                  {/* Delicate curved inner vein highlight */}
                  <path
                    d="M12 5C14.5 10 16 17 14 24"
                    stroke="rgba(255,255,255,0.4)"
                    strokeWidth="1.1"
                    strokeLinecap="round"
                  />
                </svg>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* 9. Holy Fire Diya Sparks & Sunbeam Dust Motes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-10">
        {GOLD_SPARKS.map((spark) => (
          <div
            key={spark.id}
            className="absolute rounded-full bg-[#FFE066] shadow-[0_0_8px_#F59E0B] will-change-transform"
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
        @keyframes petalFall {
          0% {
            transform: translate3d(0, -60px, 0) rotate(0deg);
            opacity: 0;
          }
          6% {
            opacity: 0.95;
          }
          90% {
            opacity: 0.95;
          }
          100% {
            transform: translate3d(0, calc(100vh + 120px), 0) rotate(420deg);
            opacity: 0;
          }
        }

        @keyframes petalSway {
          0% {
            transform: translateX(-24px) rotate(-16deg) rotateY(0deg);
          }
          50% {
            transform: translateX(24px) rotate(16deg) rotateY(180deg);
          }
          100% {
            transform: translateX(-24px) rotate(-16deg) rotateY(360deg);
          }
        }

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
