"use client";

import * as React from "react";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Menu, X, Mail, AtSign } from "lucide-react";
import { siteConfig, products } from "@/config/site-config";
import { trackGA } from "@/frontend/lib/track";

// A pinned section's own offsetTop is meaningless while GSAP holds it in place;
// its pin-spacer keeps the real position in the page.
export function pageTop(el: HTMLElement) {
  const box = el.parentElement?.classList.contains("pin-spacer") ? el.parentElement : el;
  return box.getBoundingClientRect().top + window.scrollY;
}

export interface NavItem {
  name: string;
  href: string;
}

export interface Navbar1Props {
  navItems?: (string | NavItem)[];
  ctaText?: string;
  ctaHref?: string;
  onCtaClick?: () => void;
  brandLogo?: React.ReactNode;
  /** Shown at the top of the mobile drawer; falls back to brandLogo. */
  drawerLogo?: React.ReactNode;
  brandName?: string;
  className?: string;
  containerClassName?: string;
}

const defaultItems: NavItem[] = [
  { name: "Home", href: "#" },
  { name: "Pricing", href: "#" },
  { name: "Docs", href: "#" },
  { name: "Projects", href: "#" },
];

const Navbar1 = ({
  navItems,
  ctaText,
  ctaHref = "#",
  onCtaClick,
  brandLogo,
  drawerLogo,
  className = "",
  containerClassName = "",
}: Navbar1Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeHref, setActiveHref] = useState<string>("#hero");

  const toggleMenu = () => {
    setIsOpen((open) => {
      if (!open) trackGA("menu_open");
      return !open;
    });
  };

  // Normalize navItems to { name, href } objects
  const items: NavItem[] = React.useMemo(() => {
    if (!navItems || navItems.length === 0) return defaultItems;
    return navItems.map((item) =>
      typeof item === "string" ? { name: item, href: `#${item.toLowerCase().replace(/\s+/g, "-")}` } : item
    );
  }, [navItems]);

  // Set default active to first item
  React.useEffect(() => {
    if (items.length > 0 && !activeHref) {
      setActiveHref(items[0].href);
    }
  }, [items, activeHref]);

  // Scroll spy tracking which section the user is currently viewing
  React.useEffect(() => {
    const handleScroll = () => {
      // If close to top of page, activate the first item
      if (window.scrollY < 120) {
        if (items.length > 0) {
          setActiveHref(items[0].href);
        }
        return;
      }

      // If scrolled to the bottom of the page, activate the last item
      const isAtBottom =
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 60;
      if (isAtBottom && items.length > 0) {
        setActiveHref(items[items.length - 1].href);
        return;
      }

      // Calculate which section is closest to/above the viewport trigger line
      const triggerY = window.scrollY + 160;
      let matchedHref = "";

      for (const item of items) {
        if (!item.href.startsWith("#")) continue;
        const id = item.href.slice(1);
        const element = document.getElementById(id);
        if (element) {
          const top = pageTop(element);
          if (top <= triggerY) {
            matchedHref = item.href;
          }
        }
      }

      if (matchedHref) {
        setActiveHref(matchedHref);
      }
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [items]);

  // While the drawer is open the page behind it must not scroll, and the back
  // gesture should close the drawer rather than leave the page.
  React.useEffect(() => {
    if (!isOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    history.pushState({ menu: true }, "");
    const onPop = () => setIsOpen(false);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("popstate", onPop);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("popstate", onPop);
      window.removeEventListener("keydown", onKey);
      if (history.state?.menu) history.back();
    };
  }, [isOpen]);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith("#")) {
      e.preventDefault();
      const id = href.slice(1);
      if (id === "hero") {
        window.scrollTo({ top: 0, behavior: "smooth" });
        setActiveHref(href);
      } else {
        const element = document.getElementById(id);
        if (element) {
          const yOffset = -96;
          const y = pageTop(element) + yOffset;
          window.scrollTo({ top: y, behavior: "smooth" });
          setActiveHref(href);
        }
      }
    }
    if (isOpen) {
      setIsOpen(false);
    }
  };

  const handleCtaClick = (e: React.MouseEvent) => {
    if (onCtaClick) {
      e.preventDefault();
      onCtaClick();
    }
    if (isOpen) {
      setIsOpen(false);
    }
  };

  return (
    <div className={`flex justify-center w-full ${containerClassName}`}>
      <div
        className={`relative z-10 flex w-full items-center justify-between ${className}`}
      >
        <div className="flex items-center shrink-0">
          {brandLogo ? (
            <div className="flex items-center">{brandLogo}</div>
          ) : (
            <motion.div
              className="w-8 h-8 mr-6 flex items-center justify-center cursor-pointer"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              whileHover={{ rotate: 10 }}
              transition={{ duration: 0.3 }}
            >
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="16" cy="16" r="16" fill="url(#paint0_linear)" />
                <defs>
                  <linearGradient id="paint0_linear" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#FF9966" />
                    <stop offset="1" stopColor="#FF5E62" />
                  </linearGradient>
                </defs>
              </svg>
            </motion.div>
          )}
        </div>

        {/* Desktop Navigation with animated active highlight */}
        <nav className="hidden items-center gap-1 lg:flex xl:gap-4" aria-label="Main Navigation">
          {items.map((item) => {
            const isActive = activeHref === item.href;
            return (
              <a
                key={item.name}
                href={item.href}
                onClick={(e) => handleNavClick(e, item.href)}
                className={`relative flex items-center gap-1.5 whitespace-nowrap px-2 py-1.5 text-sm font-semibold transition-opacity select-none cursor-pointer lg:px-2.5 ${
                  isActive ? "opacity-100" : "opacity-65 hover:opacity-100"
                }`}
                aria-current={isActive ? "page" : undefined}
              >
                <span className="relative">
                  {item.name}
                  {isActive && (
                    <motion.span
                      layoutId="activeNavRule"
                      className="absolute -bottom-1 left-0 right-0 h-[2px] bg-current"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                </span>
              </a>
            );
          })}
        </nav>

        {/* Desktop CTA Button */}
        {ctaText && (
          <motion.div
            className="hidden lg:block shrink-0"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.15 }}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
          >
            <a
              href={ctaHref}
              onClick={handleCtaClick}
              className="inline-flex items-center justify-center px-6 py-2 text-sm font-bold text-ink bg-turmeric hover:bg-[#E5B23F] active:bg-[#D99A1E] rounded-full border-2 border-ink shadow-[3px_3px_0_var(--color-ink)] active:shadow-[1px_1px_0_var(--color-ink)] active:translate-x-[2px] active:translate-y-[2px] transition-all cursor-pointer select-none"
            >
              {ctaText}
            </a>
          </motion.div>
        )}

        {/* Mobile Action Cluster: Hamburger Toggle */}
        <div className="flex lg:hidden items-center shrink-0">
          <motion.button
            className="flex items-center p-1.5 text-current transition-opacity hover:opacity-70 cursor-pointer"
            onClick={toggleMenu}
            whileTap={{ scale: 0.9 }}
            aria-label="Toggle Menu"
          >
            <Menu className="h-6 w-6 text-current" />
          </motion.button>
        </div>
      </div>

      {/* Mobile Menu Drawer, sliding in from the right */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 bg-white/98 backdrop-blur-xl z-50 pt-5 px-6 lg:hidden pointer-events-auto flex flex-col justify-between pb-8 shadow-2xl"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Nothing at the top but the way out */}
            <div className="flex justify-end">
              <motion.button
                className="rounded-full bg-gray-100 p-2.5 transition-colors hover:bg-gray-200 active:bg-gray-300 cursor-pointer"
                onClick={toggleMenu}
                whileTap={{ scale: 0.9 }}
                aria-label="Close Menu"
              >
                <X className="h-6 w-6 text-gray-900" />
              </motion.button>
            </div>

            {/* The lockup sits with the links, not stranded at the top:
                the calendar's name, then who makes it. */}
            <div className="mt-auto flex items-center justify-center pb-6">
              {drawerLogo ?? brandLogo}
            </div>

            {/* Menu Links with active indicator */}
            <div className="flex flex-col space-y-3 pb-6">
              {items.map((item, i) => {
                const isActive = activeHref === item.href;
                return (
                  <motion.div
                    key={item.name}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 + 0.05 }}
                    exit={{ opacity: 0, x: 20 }}
                  >
                    <a
                      href={item.href}
                      className={`text-lg font-bold transition-all flex items-center justify-between px-4 py-3 rounded-2xl ${
                        isActive
                          ? "bg-chandua/10 text-chandua border border-chandua/20 shadow-xs"
                          : "text-gray-800 hover:text-chandua hover:bg-gray-50 border border-transparent"
                      }`}
                      onClick={(e) => handleNavClick(e, item.href)}
                    >
                      <span className="flex items-center gap-2">
                        {item.name}
                        {isActive && <span className="w-2 h-2 rounded-full bg-chandua" />}
                      </span>
                      <span className={isActive ? "text-chandua" : "text-gray-400"}>
                        &rarr;
                      </span>
                    </a>
                  </motion.div>
                );
              })}

              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                exit={{ opacity: 0, y: 15 }}
                className="pt-4"
              >
                <a
                  href={ctaHref}
                  className="inline-flex items-center justify-center w-full px-5 py-3 text-base font-bold text-ink bg-turmeric hover:bg-[#E5B23F] active:translate-x-[1px] active:translate-y-[1px] rounded-full border-2 border-ink shadow-[3px_3px_0_var(--color-ink)] transition-all cursor-pointer"
                  onClick={handleCtaClick}
                >
                  {ctaText ?? "Pre-book now"} &middot; from &#8377;{products.gift.perBox}
                </a>
              </motion.div>
            </div>

            {/* Drawer Footer */}
            <div className="flex items-center justify-center gap-5 border-t border-gray-100 pt-3 text-xs font-semibold text-gray-500">
              <a
                href={`mailto:${siteConfig.supportEmail}`}
                className="flex min-h-[44px] items-center gap-2 hover:text-chandua"
              >
                <Mail className="h-4 w-4" />
                Email me
              </a>
              <a
                href={siteConfig.instagramUrl}
                target="_blank"
                rel="noreferrer"
                className="flex min-h-[44px] items-center gap-2 hover:text-chandua"
              >
                <AtSign className="h-4 w-4" />
                Instagram
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};

export { Navbar1 };
