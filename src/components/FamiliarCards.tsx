"use client";

import React, { useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

/**
 * Section 02, as the minimal-carousel pattern: the card you tap grows into the
 * slot above while the others step aside, travelling on a shared `layoutId`
 * rather than cross-fading.
 *
 * The artwork carries its own words, so nothing here crops: each card keeps
 * its natural proportions and the grid lets the rows find their own height.
 */
export type FamiliarCard = {
  id: string;
  line: string;
  image: string;
  width: number;
  height: number;
  /** A letterbox card runs the full width rather than sharing a row. */
  wide?: boolean;
};

export function FamiliarCards({ cards }: { cards: FamiliarCard[] }) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const reduceMotion = useReducedMotion();

  const active = cards.find((c) => c.id === activeId);
  const rest = cards.filter((c) => c.id !== activeId);

  const spring = reduceMotion
    ? { duration: 0 }
    : { type: "spring" as const, bounce: 0.2, duration: 0.6 };

  return (
    <div
      className="w-full"
      onClick={(e) => {
        if (e.target === e.currentTarget) setActiveId(null);
      }}
    >
      <motion.div layout transition={spring} className="flex flex-col gap-3 sm:gap-4">
        <AnimatePresence mode="popLayout" initial={false}>
          {active && (
            <motion.button
              key={active.id}
              layoutId={active.id}
              type="button"
              onClick={() => setActiveId(null)}
              transition={spring}
              aria-label={`Close: ${active.line}`}
              className="block w-full overflow-hidden rounded-xl"
            >
              <Image
                src={active.image}
                alt={active.line}
                width={active.width}
                height={active.height}
                priority
                className="block h-auto w-full select-none"
              />
            </motion.button>
          )}
        </AnimatePresence>

        {/* The rest, side by side. Two up on their own, three once one is open. */}
        <motion.div
          layout
          transition={spring}
          className={`grid items-start gap-3 sm:gap-4 ${active ? "grid-cols-3" : "grid-cols-2"}`}
        >
          {(active ? rest : cards).map((card) => (
            <motion.button
              key={card.id}
              layoutId={card.id}
              type="button"
              onClick={() => setActiveId(card.id)}
              transition={spring}
              whileTap={reduceMotion ? undefined : { scale: 0.97 }}
              aria-label={card.line}
              className={`block overflow-hidden rounded-xl ${
                card.wide && !active ? "col-span-2" : ""
              }`}
            >
              <Image
                src={card.image}
                alt={card.line}
                width={card.width}
                height={card.height}
                className="block h-auto w-full select-none"
              />
            </motion.button>
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
}
