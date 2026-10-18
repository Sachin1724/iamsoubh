import React from "react";
import Link from "next/link";
import Image from "next/image";
import { MessageCircle, Mail } from "lucide-react";
import { siteConfig } from "@/config/site-config";

export function Footer() {
  return (
    <footer className="bg-pipili-red text-on-dark pt-16 pb-24 sm:pb-16 md:pb-14 border-t-2 border-ink relative z-20 overflow-hidden">
      {/* Subtle Odia Folk Pattern Texture with Crimson Red Tint */}
      <div
        className="absolute inset-0 opacity-10 pointer-events-none bg-repeat z-0"
        style={{
          backgroundImage: "url('/assets/folk-pattern-tile.png')",
          backgroundSize: "180px",
        }}
      />

      {/* Hand-sketched Odia Culture Panorama (Boita Maritime Ship -> Konark Sun Temple & Wheel -> Odissi Dancers -> Mukteshvara Torana -> Lingaraj & Puri Jagannath Temple) */}
      <div
        className="absolute bottom-0 left-0 right-0 w-full overflow-hidden pointer-events-none select-none z-0"
        aria-hidden="true"
      >
        <div
          className="w-[200%] sm:w-[150%] md:w-full min-w-[900px] md:min-w-0 h-[220px] sm:h-[280px] md:h-[340px] lg:h-[380px] xl:h-[420px] mx-auto relative left-1/2 -translate-x-1/2 md:left-0 md:translate-x-0 opacity-25 md:opacity-35 transition-opacity duration-300"
          style={{
            backgroundImage: "url('/assets/scene/odia-culture-desktop-panorama-cream.png')",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "bottom center",
            backgroundSize: "100% auto",
            maskImage: "linear-gradient(to top, rgba(0,0,0,1) 80%, rgba(0,0,0,0) 100%)",
            WebkitMaskImage: "linear-gradient(to top, rgba(0,0,0,1) 80%, rgba(0,0,0,0) 100%)",
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Main Footer Row: [Left Quote] | [Center Brand & Socials] | [Right Legal Links] */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center pb-8 border-b border-white/15">
          
          {/* Left: Serif Tagline */}
          <div className="md:col-span-4 flex flex-col items-center text-center md:items-start md:text-left">
            <p className="font-editorial italic text-base sm:text-lg text-cream leading-tight">
              Made in Odisha, <br />
              <span className="text-sm not-italic font-normal text-on-dark/80">for everyone who misses it.</span>
            </p>
          </div>

          {/* Center: IAMSOUBH Brand Logo & Social Icons */}
          <div className="md:col-span-4 flex flex-col items-center justify-center gap-3 text-center">
            <Link
              href="#hero"
              className="inline-flex items-center group cursor-pointer"
              aria-label="IAMSOUBH Home"
            >
              <Image
                src="/assets/brand/calogo.png"
                alt="IAMSOUBH"
                width={180}
                height={50}
                className="h-7 sm:h-9 md:h-10 w-auto object-contain group-hover:opacity-85 transition-opacity"
                style={{ filter: "brightness(0) invert(1)" }}
              />
            </Link>

            <div className="flex items-center gap-3">
              <a
                href={siteConfig.instagramUrl}
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/25 flex items-center justify-center transition-colors"
                aria-label="Instagram @iamsoubh"
              >
                <svg className="w-4 h-4 fill-white" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              <a
                href={siteConfig.whatsappWaitlistUrl}
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/25 flex items-center justify-center transition-colors"
                aria-label="WhatsApp Contact"
              >
                <MessageCircle className="w-4 h-4 text-white" />
              </a>
              <a
                href="mailto:contact@iamsoubh.com"
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/25 flex items-center justify-center transition-colors"
                aria-label="Email Soubh"
              >
                <Mail className="w-4 h-4 text-white" />
              </a>
            </div>
          </div>

          {/* Right: Policy Links */}
          <div className="md:col-span-4 flex flex-wrap justify-center md:justify-end gap-x-4 gap-y-2 text-xs text-on-dark/80 font-medium">
            <Link href="/contact" className="hover:text-white transition-colors">Contact</Link>
            <Link href="/shipping" className="hover:text-white transition-colors">Shipping</Link>
            <Link href="/refunds" className="hover:text-white transition-colors">Refunds and cancellation</Link>
            <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
            <Link href="/about" className="hover:text-white transition-colors">About</Link>
          </div>

        </div>

        {/* Copyright Notice */}
        <div className="pt-6 text-center text-xs text-white/50">
          © 2026 IAMSOUBH. All rights reserved.
        </div>

      </div>
    </footer>
  );
}
