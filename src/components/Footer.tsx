"use client";

import React from "react";
import Link from "next/link";
import { MessageCircle, Heart } from "lucide-react";
import { siteConfig } from "@/config/site-config";

export function Footer() {
  return (
    <footer className="bg-[#8A1717] text-[#F6EFE2] pt-14 pb-20 sm:pb-14 border-t border-[#E0A526]/20 relative z-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center pb-10 border-b border-white/10">
          
          {/* Left: Odia Title & Brand */}
          <div className="md:col-span-4 flex flex-col items-start">
            <span className="font-odia text-3xl font-extrabold text-[#E0A526] tracking-tight">
              ବାର ମାସେ ତେର ପରବ
            </span>
            <span className="text-xs font-black tracking-widest text-[#F6EFE2]/80 uppercase mt-1">
              THE ODIA VIRAL CALENDAR · 2027
            </span>
          </div>

          {/* Center: Quick Links & Socials */}
          <div className="md:col-span-4 flex flex-col items-center gap-4 text-center">
            <div className="flex flex-wrap justify-center gap-5 text-xs sm:text-sm font-medium text-[#F6EFE2]/90">
              <a href="#hero" className="hover:text-[#E0A526] transition-colors">Home</a>
              <a href="#sound-familiar" className="hover:text-[#E0A526] transition-colors">About</a>
              <a href="#whats-inside" className="hover:text-[#E0A526] transition-colors">Contents</a>
              <a href="#preorder" className="hover:text-[#E0A526] transition-colors">Pre-order</a>
              <a href="#faq" className="hover:text-[#E0A526] transition-colors">FAQ</a>
            </div>

            <div className="flex items-center gap-4 text-white">
              <a
                href={siteConfig.instagramUrl}
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                aria-label="Instagram @iamsoubh"
              >
                <svg className="w-4 h-4 fill-currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              <a
                href={siteConfig.whatsappWaitlistUrl}
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                aria-label="WhatsApp Contact"
              >
                <MessageCircle className="w-4 h-4" />
              </a>
              <span className="text-xs text-[#E0A526] font-bold">@iamsoubh</span>
            </div>
          </div>

          {/* Right: Brand Vision Quote */}
          <div className="md:col-span-4 flex flex-col md:items-end text-left md:text-right">
            <p className="font-disko text-lg sm:text-xl text-[#F6EFE2] leading-snug">
              Made in Odisha, for everyone who misses it.
            </p>
            <span className="text-xs text-white/50 mt-1">
              Odisha · Delhi · Bengaluru · Worldwide
            </span>
          </div>

        </div>

        {/* Policy links — Razorpay's website review checks for these */}
        <nav
          aria-label="Policies"
          className="pt-8 flex flex-wrap justify-center gap-x-5 gap-y-2 text-xs sm:text-sm text-[#F6EFE2]/85"
        >
          <Link href="/contact" className="hover:text-[#E0A526]">Contact</Link>
          <Link href="/shipping" className="hover:text-[#E0A526]">Shipping</Link>
          <Link href="/refunds" className="hover:text-[#E0A526]">Refunds and cancellation</Link>
          <Link href="/pricing" className="hover:text-[#E0A526]">Pricing</Link>
          <Link href="/terms" className="hover:text-[#E0A526]">Terms</Link>
          <Link href="/privacy" className="hover:text-[#E0A526]">Privacy</Link>
          <Link href="/about" className="hover:text-[#E0A526]">About</Link>
        </nav>

        {/* Bottom Credits */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-[#F6EFE2]/60 gap-3">
          <p>
            © 2026{" "}
            {siteConfig.legalName || (
              <mark className="bg-[#E0A526] text-[#1B1B1B] font-bold px-1.5 rounded">
                [TO CONFIRM: legal business name]
              </mark>
            )}
          </p>
          <div className="flex items-center gap-1">
            <span>Crafted with</span>
            <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-400" />
            <span>for Odia homes everywhere</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
