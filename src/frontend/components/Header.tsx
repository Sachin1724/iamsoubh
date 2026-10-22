"use client";

import React from "react";
import Image from "next/image";
import { Navbar1, NavItem, pageTop } from "@/frontend/components/ui/navbar-1";
import { scrollToTarget } from "@/frontend/components/SmoothScroll";

interface HeaderProps {
  onOrderClick?: () => void;
}

// Page order. The order link is the CTA button, not a nav item.
// Five destinations: a floating pill stops working beyond about that many.
const navItems: NavItem[] = [
  { name: "Stories", href: "#stories" },
  { name: "Buy", href: "#preorder" },
  { name: "Inside the box", href: "#inside-calendar" },
  { name: "Bulk", href: "#bulk" },
  { name: "Questions", href: "#faq" },
];

// What the minimised chip says, so you always know where you are.
const SECTION_LABEL: Record<string, string> = {
  hero: "Home",
  stories: "Stories",
  "sound-familiar": "Sound familiar?",
  preorder: "Buy",
  "inside-calendar": "Inside the box",
  "inside-list": "Inside the box",
  creators: "Creators",
  bulk: "Bulk orders",
  faq: "Questions",
};

// One pane of liquid glass (same recipe as the sticky buy bar), shared by the
// full bar and the minimised chip.
const GLASS =
  "border backdrop-blur-2xl backdrop-saturate-[1.8] shadow-[inset_0_1px_0_rgba(255,255,255,0.7),inset_0_-1px_0_rgba(255,255,255,0.15),0_8px_28px_rgba(0,0,0,0.15)] [@media(prefers-reduced-transparency:reduce)]:bg-white/90 [@media(prefers-reduced-transparency:reduce)]:backdrop-blur-none";

// The header has no bar of its own, so its marks take their colour from
// whichever section is passing underneath.
const DARK_SECTIONS = new Set(["sound-familiar", "creators", "bulk"]);

export function Header({ onOrderClick }: HeaderProps) {
  const [onDark, setOnDark] = React.useState(false);
  const [atTop, setAtTop] = React.useState(true);
  // Minimise on scroll down, come back on scroll up (Apple's floating-bar behaviour).
  const [compact, setCompact] = React.useState(false);
  const [section, setSection] = React.useState("hero");
  React.useEffect(() => {
    const ids = [
      "hero",
      "stories",
      "sound-familiar",
      "preorder",
      "inside-calendar",
      "inside-list",
      "creators",
      "bulk",
      "faq",
    ];

    let lastY = window.scrollY;
    const update = () => {
      // Sample the page at the header's own eye-line.
      const y = window.scrollY + 48;
      let current = "hero";
      for (const id of ids) {
        const el = document.getElementById(id);
        if (el && pageTop(el) <= y) current = id;
      }
      // The desktop hero sits on a photo, so its marks go white there too.
      const darkHero = current === "hero" && window.matchMedia("(min-width: 640px)").matches;
      setOnDark(DARK_SECTIONS.has(current) || darkHero);
      setAtTop(window.scrollY < 40);
      setSection(current);
      const dy = window.scrollY - lastY;
      if (window.scrollY < 120) setCompact(false);
      else if (dy > 6) setCompact(true);
      else if (dy < -6) setCompact(false);
      lastY = window.scrollY;
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
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
      {/* Announcement strip: only while the page is at the very top */}
      <div
        onClick={() => scrollToTarget("#preorder")}
        className={`pointer-events-auto cursor-pointer bg-[#4A0010] px-3 py-1 text-center text-[11px] font-medium leading-tight text-white/90 sm:py-2 sm:text-xs transition-all duration-300 hover:bg-[#5C0014] ${
          atTop ? "max-h-8 opacity-100" : "max-h-0 overflow-hidden py-0 opacity-0"
        }`}
      >
        <span className="sm:hidden">Shipping from 1st of November · Free delivery across India</span>
        <span className="hidden sm:inline">Free delivery all over India · Shipping from 1st of November</span>
      </div>
      <div className="pointer-events-none relative mx-auto w-full max-w-7xl px-3 pt-3 sm:px-6 sm:pt-4 lg:px-8">
        {/* Minimised chip: logo mark plus where you are. Tap it to bring the bar back. */}
        <button
          type="button"
          onClick={() => setCompact(false)}
          aria-label={`Show menu, current section: ${SECTION_LABEL[section] ?? ""}`}
          tabIndex={compact ? 0 : -1}
          className={`absolute left-1/2 top-3 flex h-11 max-w-[calc(100vw-1.5rem)] -translate-x-1/2 items-center gap-2.5 overflow-hidden rounded-full pl-4 pr-5 text-sm font-semibold transition-all duration-300 ease-out sm:top-4 ${GLASS} ${
            onDark ? "border-white/25 bg-white/12 text-on-dark" : "border-white/50 bg-white/45 text-on-light"
          } ${compact ? "pointer-events-auto scale-100 opacity-100" : "pointer-events-none scale-90 opacity-0"}`}
        >
          {/* Fixed box so the two-line lettering can never spill past the pill */}
          <span className="relative block h-6 w-12 shrink-0">
            <Image
              src="/assets/brand/logo-bmtp.svg"
              alt=""
              fill
              unoptimized
              className="object-contain"
              style={onDark ? undefined : { filter: "brightness(0) saturate(100%) invert(10%) sepia(40%) saturate(4000%) hue-rotate(338deg)" }}
            />
          </span>
          <span className={`h-4 w-px ${onDark ? "bg-white/30" : "bg-black/15"}`} aria-hidden="true" />
          <span className="min-w-0 truncate">{SECTION_LABEL[section] ?? "Home"}</span>
        </button>
      <Navbar1
        navItems={navItems}
        onCtaClick={handleCtaClick}
        ctaText="Buy Now"
        ctaHref="#preorder"
        containerClassName="pointer-events-none w-full"
        // One pane of liquid glass (same recipe as the sticky buy bar): clear saturated
        // blur, a bright rim, a sheen over the top half, a soft lift. Fixed height and
        // even padding so the logo and menu sit centred with room around them.
        className={`${compact ? "pointer-events-none -translate-y-2 scale-95 opacity-0" : "pointer-events-auto opacity-100"} h-14 rounded-[20px] pl-4 pr-2 transition-all duration-300 ease-out sm:h-16 sm:pl-6 sm:pr-3 ${GLASS} before:pointer-events-none before:absolute before:inset-x-0 before:top-0 before:-z-10 before:h-1/2 before:rounded-t-[20px] before:bg-gradient-to-b before:from-white/40 before:to-transparent before:content-[''] ${
          onDark ? "border-white/25 bg-white/12 text-on-dark" : "border-white/50 bg-white/45 text-on-light"
        }`}
        brandLogo={
          <a
            href="#hero"
            className="flex items-center group pointer-events-auto cursor-pointer"
            aria-label="Bara Masa Tera Parba by IAMSOUBH — Home"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          >
            <Image
              src="/assets/brand/logo-bmtp.svg"
              alt="Bara Masa Tera Parba"
              width={886}
              height={450}
              unoptimized
              priority
              className="h-8 w-auto object-contain transition-opacity group-hover:opacity-85 sm:h-9 md:h-10"
              style={
                onDark
                  ? undefined
                  : {
                      filter:
                        "brightness(0) saturate(100%) invert(10%) sepia(40%) saturate(4000%) hue-rotate(338deg)",
                    }
              }
            />
          </a>
        }
        drawerLogo={
          // One horizontal lockup for the drawer: the calendar's name, "by",
          // then the IAMSOUBH wordmark. Both marks are forced to the deep
          // maroon here, because the header's own ink flips with the section
          // and would otherwise turn the wordmark white on the white drawer.
          <span className="flex items-center justify-center gap-2.5">
            <Image
              src="/assets/product-logo-v2.png"
              alt="Bara Masa Tera Parba"
              width={782}
              height={383}
              className="h-11 w-auto object-contain"
            />
            <span className="font-editorial text-sm italic text-gray-500">by</span>
            <Image
              src="/assets/brand/calogo.png"
              alt="IAMSOUBH"
              width={180}
              height={50}
              className="h-5 w-auto object-contain"
              style={{
                filter:
                  "brightness(0) saturate(100%) invert(10%) sepia(40%) saturate(4000%) hue-rotate(338deg)",
              }}
            />
          </span>
        }
      />
      </div>
    </header>
  );
}
