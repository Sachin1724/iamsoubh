"use client";

import React from "react";

interface OdiaHeritageSealProps {
  className?: string;
  size?: number;
}

export function OdiaHeritageSeal({ className = "", size = 120 }: OdiaHeritageSealProps) {
  return (
    <div
      className={`inline-block select-none pointer-events-none transform -rotate-12 transition-transform hover:rotate-0 duration-300 ${className}`}
      style={{ width: size, height: size }}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 200 200"
        width="100%"
        height="100%"
        className="text-[#9E2A2B] drop-shadow-[0_2px_4px_rgba(158,42,43,0.15)]"
      >
        <defs>
          {/* Top arc path for text */}
          <path
            id="seal-top-arc"
            d="M 28 100 A 72 72 0 1 1 172 100"
            fill="none"
          />
          {/* Bottom arc path for text */}
          <path
            id="seal-bottom-arc"
            d="M 172 100 A 72 72 0 0 1 28 100"
            fill="none"
          />
          {/* Distressed filter */}
          <filter id="ink-stamp-roughness" x="0%" y="0%" width="100%" height="100%">
            <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="3" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="1.5" xChannelSelector="R" yChannelSelector="G" />
          </filter>
        </defs>

        <g filter="url(#ink-stamp-roughness)" opacity="0.82">
          {/* Outer serrated ring */}
          <circle
            cx="100"
            cy="100"
            r="94"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeDasharray="4 3"
          />

          {/* Outer solid boundary */}
          <circle
            cx="100"
            cy="100"
            r="88"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          />

          {/* Inner boundary ring */}
          <circle
            cx="100"
            cy="100"
            r="56"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          />

          {/* Small decorative star dots around the perimeter */}
          <g fill="currentColor">
            <circle cx="20" cy="100" r="2.5" />
            <circle cx="180" cy="100" r="2.5" />
          </g>

          {/* Circular top curved text */}
          <text
            fill="currentColor"
            fontSize="10.5"
            fontWeight="bold"
            letterSpacing="2.8"
            fontFamily="monospace, sans-serif"
          >
            <textPath href="#seal-top-arc" startOffset="50%" textAnchor="middle">
              ODIA HERITAGE SEAL
            </textPath>
          </text>

          {/* Circular bottom curved text */}
          <text
            fill="currentColor"
            fontSize="9"
            fontWeight="bold"
            letterSpacing="2.2"
            fontFamily="monospace, sans-serif"
          >
            <textPath href="#seal-bottom-arc" startOffset="50%" textAnchor="middle">
              ★ 12 MASA 13 PARBA ★
            </textPath>
          </text>

          {/* Center Seal Content */}
          <g textAnchor="middle" fill="currentColor">
            {/* Odia script Utkala / Odia mark */}
            <text
              x="100"
              y="85"
              fontSize="24"
              fontWeight="bold"
              fontFamily="serif"
              letterSpacing="1"
            >
              ଓଡ଼ିଆ
            </text>
            
            {/* Center line */}
            <line x1="72" y1="94" x2="128" y2="94" stroke="currentColor" strokeWidth="1" />

            {/* Year & Edition */}
            <text
              x="100"
              y="112"
              fontSize="16"
              fontWeight="bold"
              fontFamily="sans-serif"
              letterSpacing="2"
            >
              2027
            </text>

            <text
              x="100"
              y="126"
              fontSize="8.5"
              fontWeight="600"
              fontFamily="sans-serif"
              letterSpacing="1.5"
            >
              LIMITED ED.
            </text>
          </g>
        </g>
      </svg>
    </div>
  );
}
