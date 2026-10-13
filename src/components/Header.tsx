"use client";

import React from "react";
import Image from "next/image";
import { Navbar1, NavItem } from "@/components/ui/navbar-1";

interface HeaderProps {
  onOrderClick: () => void;
}

const navItems: NavItem[] = [
  { name: "Home", href: "#hero" },
  { name: "About", href: "#sound-familiar" },
  { name: "Stories", href: "#stories" },
  { name: "What's Inside", href: "#whats-inside" },
  { name: "FAQ", href: "#faq" },
];

export function Header({ onOrderClick }: HeaderProps) {
  const [scrolled, setScrolled] = React.useState(false);

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 pointer-events-none">
      <Navbar1
        navItems={navItems}
        ctaText="Pre-order"
        ctaHref="#preorder"
        onCtaClick={onOrderClick}
        containerClassName="pointer-events-none py-3 px-3 sm:px-6 md:px-8 w-full max-w-7xl mx-auto"
        className={`pointer-events-auto border-2 transition-colors duration-300 ${
          scrolled
            ? "bg-[#8A1717] border-[#1B1B1B] text-[#F6EFE2]"
            : "bg-[#8A1717]/80 backdrop-blur-md border-[#F6EFE2]/25 text-[#F6EFE2]"
        }`}
        brandLogo={
          <a
            href="#hero"
            className="flex items-center group pointer-events-auto cursor-pointer"
            aria-label="IAMSOUBH Home"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          >
            <Image
              src="/assets/brand/logo-official.webp"
              alt="IAMSOUBH"
              width={160}
              height={40}
              priority
              className="h-10 sm:h-12 w-auto object-contain group-hover:opacity-85 transition-opacity"
              // The logo ships dark; knock it to flat white for the red bar.
              style={{ filter: "brightness(0) invert(1)" }}
            />
          </a>
        }
      />
    </header>
  );
}
