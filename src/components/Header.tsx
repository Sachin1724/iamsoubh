"use client";

import React from "react";
import Image from "next/image";
import { Navbar1, NavItem } from "@/components/ui/navbar-1";
import { scrollToTarget } from "@/components/SmoothScroll";

interface HeaderProps {
  onOrderClick?: () => void;
}

const navItems: NavItem[] = [
  { name: "Hero", href: "#hero" },
  { name: "What's inside", href: "#inside-calendar" },
  { name: "Stories", href: "#stories" },
  { name: "Creators", href: "#creators" },
  { name: "Questions", href: "#faq" },
];

export function Header({ onOrderClick }: HeaderProps) {
  const [scrolled, setScrolled] = React.useState(false);

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleCtaClick = () => {
    if (onOrderClick) {
      onOrderClick();
    } else {
      scrollToTarget("#preorder");
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 pointer-events-none">
      <Navbar1
        navItems={navItems}
        onCtaClick={handleCtaClick}
        containerClassName="pointer-events-none py-2 sm:py-3 px-4 sm:px-6 lg:px-8 w-full max-w-7xl mx-auto"
        className={`pointer-events-auto border-2 transition-all duration-300 ${
          scrolled
            ? "bg-sand border-brand/30 text-brand shadow-md backdrop-blur-md"
            : "bg-sand/92 backdrop-blur-md border-brand/20 text-brand"
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
              src="/assets/brand/calogo.png"
              alt="IAMSOUBH"
              width={180}
              height={50}
              priority
              className="h-6 sm:h-9 md:h-10 w-auto object-contain group-hover:opacity-85 transition-opacity"
              style={{ filter: "brightness(0) saturate(100%) invert(14%) sepia(85%) saturate(3400%) hue-rotate(345deg)" }}
            />
          </a>
        }
      />
    </header>
  );
}
