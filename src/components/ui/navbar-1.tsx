"use client";

import * as React from "react";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Menu, X } from "lucide-react";

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
  ctaText = "Get Started",
  ctaHref = "#",
  onCtaClick,
  brandLogo,
  className = "",
  containerClassName = "",
}: Navbar1Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeHref, setActiveHref] = useState<string>("#hero");

  const toggleMenu = () => setIsOpen(!isOpen);

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
          const top = element.offsetTop;
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

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith("#")) {
      e.preventDefault();
      const id = href.slice(1);
      const element = document.getElementById(id);
      if (element) {
        const yOffset = -96;
        const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
        window.scrollTo({ top: y, behavior: "smooth" });
        setActiveHref(href);
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
        className={`flex items-center justify-between px-4 sm:px-6 lg:px-8 py-2.5 sm:py-3 rounded-full w-full relative z-10 transition-all ${className}`}
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
        <nav className="hidden md:flex items-center space-x-1 sm:space-x-2 lg:space-x-3 xl:space-x-4" aria-label="Main Navigation">
          {items.map((item) => {
            const isActive = activeHref === item.href;
            return (
              <a
                key={item.name}
                href={item.href}
                onClick={(e) => handleNavClick(e, item.href)}
                className={`relative px-4 sm:px-5 py-2 rounded-full text-sm font-medium transition-all select-none cursor-pointer flex items-center gap-1.5 ${
                  isActive
                    ? "text-[#E0A526] font-bold"
                    : "text-[#F6EFE2]/85 hover:text-[#F6EFE2] hover:bg-[#F6EFE2]/10"
                }`}
                aria-current={isActive ? "page" : undefined}
              >
                {isActive && (
                  <motion.span
                    layoutId="activeNavHighlight"
                    className="absolute inset-0 rounded-full bg-[#F6EFE2]/15 border border-[#E0A526]/50"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                <span className="relative z-10 flex items-center gap-1.5">
                  {item.name}
                  {isActive && (
                    <motion.span
                      layoutId="activeNavDot"
                      className="w-1.5 h-1.5 rounded-full bg-[#E0A526]"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                </span>
              </a>
            );
          })}
        </nav>

        {/* Desktop CTA Button */}
        <motion.div
          className="hidden md:block shrink-0"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.15 }}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
        >
          <a
            href={ctaHref}
            onClick={handleCtaClick}
            className="inline-flex items-center justify-center px-6 py-2 text-sm font-bold text-[#1B1B1B] bg-[#E0A526] hover:bg-[#E5B23F] active:bg-[#D99A1E] rounded-full border-2 border-[#1B1B1B] shadow-[3px_3px_0_#1B1B1B] active:shadow-[1px_1px_0_#1B1B1B] active:translate-x-[2px] active:translate-y-[2px] transition-all cursor-pointer select-none"
          >
            {ctaText}
          </a>
        </motion.div>

        {/* Mobile Menu Button */}
        <motion.button
          className="md:hidden flex items-center p-2 rounded-full text-[#F6EFE2] hover:bg-[#F6EFE2]/10 transition-colors cursor-pointer"
          onClick={toggleMenu}
          whileTap={{ scale: 0.9 }}
          aria-label="Toggle Menu"
        >
          <Menu className="h-6 w-6 text-[#F6EFE2]" />
        </motion.button>
      </div>

      {/* Mobile Menu Drawer Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 bg-white/98 backdrop-blur-xl z-50 pt-5 px-6 md:hidden pointer-events-auto flex flex-col justify-between pb-8 shadow-2xl"
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.2 }}
          >
            {/* Top Bar inside Drawer */}
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <div className="flex items-center">
                {brandLogo}
              </div>
              <motion.button
                className="p-2.5 rounded-full bg-gray-100 hover:bg-gray-200 active:bg-gray-300 transition-colors cursor-pointer"
                onClick={toggleMenu}
                whileTap={{ scale: 0.9 }}
                aria-label="Close Menu"
              >
                <X className="h-6 w-6 text-gray-900" />
              </motion.button>
            </div>

            {/* Menu Links with active indicator */}
            <div className="flex flex-col space-y-3 my-auto py-6">
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
                          ? "bg-[#C8221A]/10 text-[#C8221A] border border-[#C8221A]/20 shadow-xs"
                          : "text-gray-800 hover:text-[#C8221A] hover:bg-gray-50 border border-transparent"
                      }`}
                      onClick={(e) => handleNavClick(e, item.href)}
                    >
                      <span className="flex items-center gap-2">
                        {item.name}
                        {isActive && (
                          <span className="w-2 h-2 rounded-full bg-[#C8221A]" />
                        )}
                      </span>
                      <span className={isActive ? "text-[#C8221A]" : "text-gray-400"}>
                        →
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
                  className="inline-flex items-center justify-center w-full px-5 py-3 text-base font-bold text-[#1B1B1B] bg-[#E0A526] hover:bg-[#E5B23F] active:translate-x-[1px] active:translate-y-[1px] rounded-full border-2 border-[#1B1B1B] shadow-[3px_3px_0_#1B1B1B] transition-all cursor-pointer"
                  onClick={handleCtaClick}
                >
                  {ctaText} · ₹299
                </a>
              </motion.div>
            </div>

            {/* Drawer Footer */}
            <div className="text-center text-xs text-gray-400 border-t border-gray-100 pt-3">
              IAMSOUBH · Bara Masa Tera Parba 2027
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export { Navbar1 };
