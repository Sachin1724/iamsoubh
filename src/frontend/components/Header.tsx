"use client";

import React from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import { Navbar1, NavItem, pageTop } from "@/frontend/components/ui/navbar-1";
import { scrollToTarget, isSteering } from "@/frontend/components/SmoothScroll";

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

// Flat frosted glass in the site's 2D, brutalist voice: a plain blur, a solid ink
// outline and a hard offset shadow. No sheen or reflections.
const FROST_LIGHT = "border-[1.5px] border-ink bg-[#FAF6EE]/70 shadow-[3px_3px_0_0_#1B1B1B]";
const FROST_DARK = "border-[1.5px] border-white/80 bg-[#1B1B1B]/45 shadow-[3px_3px_0_0_rgba(0,0,0,0.6)]";

// The header has no bar of its own, so its marks take their colour from
// whichever section is passing underneath.
const DARK_SECTIONS = new Set(["sound-familiar", "creators", "bulk"]);

type DOMRectLike = { x: number; y: number; width: number; height: number };

export function Header({ onOrderClick }: HeaderProps) {
  const [onDark, setOnDark] = React.useState(false);
  const [atTop, setAtTop] = React.useState(true);
  // Minimise on scroll down, come back on scroll up (Apple's floating-bar behaviour).
  const [compact, setCompact] = React.useState(false);
  const [section, setSection] = React.useState("hero");
  // One frosted pane morphs between the full bar and the chip, so the shape
  // change reads as one object reshaping rather than two things swapping.
  const reduceMotion = useReducedMotion();
  const shellRef = React.useRef<HTMLDivElement>(null);
  const chipRef = React.useRef<HTMLButtonElement>(null);
  const [geo, setGeo] = React.useState<{ bar: DOMRectLike; chip: DOMRectLike } | null>(null);
  React.useLayoutEffect(() => {
    const shell = shellRef.current;
    const chip = chipRef.current;
    const bar = shell?.querySelector<HTMLElement>("[data-navbar] > div");
    if (!shell || !chip || !bar) return;
    const measure = () => {
      const o = shell.getBoundingClientRect();
      const box = (el: HTMLElement) => {
        const r = el.getBoundingClientRect();
        return { x: r.left - o.left, y: r.top - o.top, width: r.width, height: r.height };
      };
      setGeo({ bar: box(bar), chip: box(chip) });
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(shell);
    ro.observe(chip);
    return () => ro.disconnect();
  }, [section]);
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
    let travel = 0; // distance moved in the current direction
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
      // Only a deliberate scroll (60px one way) changes the bar, and never our own
      // snaps or iOS edge bounce, so it doesn't flicker on small movements.
      const dy = window.scrollY - lastY;
      lastY = window.scrollY;
      if (window.scrollY < 120) {
        setCompact(false);
        travel = 0;
        return;
      }
      if (isSteering()) return;
      travel = Math.sign(dy) === Math.sign(travel) ? travel + dy : dy;
      if (travel > 60) setCompact(true);
      else if (travel < -60) setCompact(false);
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
      <div ref={shellRef} className="pointer-events-none relative mx-auto w-full max-w-7xl px-3 pt-3 sm:px-6 sm:pt-4 lg:px-8">
        {geo && (
          <motion.div
            aria-hidden="true"
            className={`pointer-events-none absolute left-0 top-0 backdrop-blur-xl transition-colors duration-500 [@media(prefers-reduced-transparency:reduce)]:backdrop-blur-none ${
              onDark ? FROST_DARK : FROST_LIGHT
            }`}
            initial={false}
            animate={{
              x: (compact ? geo.chip : geo.bar).x,
              y: (compact ? geo.chip : geo.bar).y,
              width: (compact ? geo.chip : geo.bar).width,
              height: (compact ? geo.chip : geo.bar).height,
              borderRadius: compact ? 22 : 20,
            }}
            transition={reduceMotion ? { duration: 0 } : { type: "spring", stiffness: 320, damping: 32, mass: 0.9 }}
          />
        )}
        {/* Minimised chip: logo mark plus where you are. Tap it to bring the bar back. */}
        <button
          type="button"
          onClick={() => setCompact(false)}
          aria-label={`Show menu, current section: ${SECTION_LABEL[section] ?? ""}`}
          tabIndex={compact ? 0 : -1}
          ref={chipRef}
          className={`absolute left-1/2 top-3 z-10 flex h-11 max-w-[calc(100vw-1.5rem)] -translate-x-1/2 items-center gap-2.5 overflow-hidden rounded-full pl-4 pr-5 text-sm font-semibold transition-opacity duration-300 sm:top-4 ${
            onDark ? "text-on-dark" : "text-on-light"
          } ${compact ? "pointer-events-auto opacity-100 delay-150" : "pointer-events-none opacity-0"}`}
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
        containerClassName="pointer-events-none relative z-10 w-full"
        // The frosted pane behind (above) is the bar's surface; this only lays out the contents.
        className={`${compact ? "pointer-events-none opacity-0" : "pointer-events-auto opacity-100 delay-150"} h-14 pl-4 pr-2 transition-opacity duration-300 sm:h-16 sm:pl-6 sm:pr-3 ${
          onDark ? "text-on-dark" : "text-on-light"
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
