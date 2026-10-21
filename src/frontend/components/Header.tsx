"use client";

import React from "react";
import Image from "next/image";
import { Navbar1, NavItem, pageTop } from "@/frontend/components/ui/navbar-1";
import { scrollToTarget } from "@/frontend/components/SmoothScroll";

interface HeaderProps {
  onOrderClick?: () => void;
}

// Page order. The order link is the CTA button, not a nav item.
const navItems: NavItem[] = [
  { name: "Inside the box", href: "#inside-calendar" },
  { name: "Stories", href: "#stories" },
  { name: "Bulk orders", href: "#bulk" },
  { name: "Questions", href: "#faq" },
];

// The header has no bar of its own, so its marks take their colour from
// whichever section is passing underneath.
const DARK_SECTIONS = new Set(["sound-familiar", "inside-calendar", "creators", "bulk"]);

export function Header({ onOrderClick }: HeaderProps) {
  const [onDark, setOnDark] = React.useState(false);
  const [onPhoto, setOnPhoto] = React.useState(false);

  React.useEffect(() => {
    const ids = [
      "hero",
      "sound-familiar",
      "inside-calendar",
      "inside-list",
      "stories",
      "creators",
      "preorder",
      "bulk",
      "faq",
    ];

    const update = () => {
      // Sample the page at the header's own eye-line.
      const y = window.scrollY + 48;
      let current = "hero";
      for (const id of ids) {
        const el = document.getElementById(id);
        if (el && pageTop(el) <= y) current = id;
      }
      // The desktop hero sits on a photo, so its marks go white there too.
      const darkHero = current === "hero" && window.matchMedia("(min-width: 1024px)").matches;
      setOnDark(DARK_SECTIONS.has(current) || darkHero);
      setOnPhoto(darkHero);
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
      {/* Free delivery, on every screen */}
      <div className="pointer-events-auto flex h-9 items-center justify-center overflow-hidden whitespace-nowrap bg-[#480012] px-2 text-center text-[12px] leading-none min-[375px]:text-[13px] tracking-[-0.01em] text-white">
        Free delivery all over India · Ships first week of November
      </div>
      <Navbar1
        navItems={navItems}
        onCtaClick={handleCtaClick}
        ctaText="Pre-order"
        ctaHref="#preorder"
        containerClassName="pointer-events-none px-4 py-3 sm:px-6 sm:py-4 lg:px-8 w-full max-w-7xl mx-auto"
        className={`pointer-events-auto transition-colors duration-500 ${
          onPhoto ? "text-white/90" : onDark ? "text-on-dark" : "text-on-light"
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
              src="/assets/brand/calogo.png"
              alt="IAMSOUBH"
              width={180}
              height={50}
              priority
              className={`h-6 w-auto object-contain transition-opacity group-hover:opacity-85 sm:h-8 md:h-9 ${
                onDark ? "brightness-0 invert" : ""
              }`}
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
    </header>
  );
}
