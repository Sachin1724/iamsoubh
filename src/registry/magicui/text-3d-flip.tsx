"use client";

import React, {
  useEffect,
  useMemo,
  useState,
  useCallback,
  type ElementType,
} from "react";
import {
  motion,
  type ValueAnimationTransition,
} from "motion/react";

import { cn } from "@/lib/utils";

const HAS_SEGMENTER = typeof Intl !== "undefined" && "Segmenter" in Intl;

const splitIntoCharacters = (text: string): string[] => {
  if (!text) return [];
  if (HAS_SEGMENTER) {
    const segmenter = new Intl.Segmenter("en", { granularity: "grapheme" });
    return Array.from(segmenter.segment(text), ({ segment }) => segment);
  }
  return Array.from(text);
};

const extractTextFromChildren = (children: React.ReactNode): string => {
  if (children == null) return "";
  if (typeof children === "string") return children;
  if (typeof children === "number") return String(children);

  if (Array.isArray(children)) {
    return children.map(extractTextFromChildren).join("");
  }

  if (React.isValidElement(children)) {
    const props = children.props as Record<string, unknown>;
    const childText = props.children as React.ReactNode;
    if (childText != null) {
      return extractTextFromChildren(childText);
    }
  }

  return "";
};

const DEFAULT_TRANSITION: ValueAnimationTransition = {
  type: "spring",
  damping: 25,
  stiffness: 160,
};

export interface Text3DFlipProps {
  children?: React.ReactNode;
  words?: string[];
  interval?: number;
  autoCycle?: boolean;
  as?: ElementType;
  className?: string;
  textClassName?: string;
  flipTextClassName?: string;
  staggerDuration?: number;
  staggerFrom?: "first" | "last" | "center" | number | "random";
  transition?: ValueAnimationTransition;
  rotateDirection?: "top" | "right" | "bottom" | "left";
  [key: string]: unknown;
}

export function Text3DFlip({
  children,
  words,
  interval = 3200,
  autoCycle = true,
  as: ElementTag = "div",
  className,
  textClassName,
  flipTextClassName,
  staggerDuration = 0.03,
  staggerFrom = "first",
  transition = DEFAULT_TRANSITION,
  rotateDirection = "top",
  ...props
}: Text3DFlipProps) {
  const hasWordsList = Array.isArray(words) && words.length > 0;
  const wordList = useMemo(() => {
    if (hasWordsList) return words;
    const single = extractTextFromChildren(children);
    return single ? [single] : [""];
  }, [hasWordsList, words, children]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [animatingTargetIndex, setAnimatingTargetIndex] = useState<number | null>(null);

  const isFlipping = animatingTargetIndex !== null;

  // Trigger flip to next phrase
  const triggerFlip = useCallback(() => {
    if (wordList.length <= 1 || isFlipping) return;
    const nextIdx = (currentIndex + 1) % wordList.length;
    setAnimatingTargetIndex(nextIdx);
  }, [wordList, isFlipping, currentIndex]);

  // Auto-cycle timer
  useEffect(() => {
    if (!autoCycle || wordList.length <= 1) return;

    const timer = setInterval(() => {
      triggerFlip();
    }, interval);

    return () => clearInterval(timer);
  }, [autoCycle, wordList, interval, triggerFlip]);

  const longestPhrase = useMemo(
    () => wordList.reduce((a, b) => (b.length > a.length ? b : a), ""),
    [wordList]
  );

  const activePhrase = wordList[currentIndex] || "";
  const targetPhrase = animatingTargetIndex !== null ? wordList[animatingTargetIndex] || "" : "";

  // Split a phrase into words and characters with absolute character indexing
  const formatPhrase = (phrase: string) => {
    const rawWords = phrase.split(" ");
    let charCounter = 0;
    return rawWords.map((w) => {
      const chars = splitIntoCharacters(w).map((char) => ({
        char,
        index: charCounter++,
      }));
      return { word: w, chars };
    });
  };

  const activeWords = useMemo(() => formatPhrase(activePhrase), [activePhrase]);
  const targetWords = useMemo(() => formatPhrase(targetPhrase), [targetPhrase]);

  // A stable shuffle per phrase length, so "random" does not reorder every render.
  const randomOrder = useMemo(() => {
    const longest = Math.max(activePhrase.length, targetPhrase.length);
    const order = Array.from({ length: longest }, (_, i) => i);
    for (let i = order.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [order[i], order[j]] = [order[j], order[i]];
    }
    return order;
  }, [activePhrase, targetPhrase]);

  /** Where in the stagger a character sits, counted from `staggerFrom`. */
  const delayFor = useCallback(
    (index: number, total: number) => {
      if (typeof staggerFrom === "number") {
        return Math.abs(index - staggerFrom) * staggerDuration;
      }
      if (staggerFrom === "last") return (total - 1 - index) * staggerDuration;
      if (staggerFrom === "center") {
        return Math.abs(index - (total - 1) / 2) * staggerDuration;
      }
      if (staggerFrom === "random") {
        return (randomOrder[index] ?? index) * staggerDuration;
      }
      return index * staggerDuration;
    },
    [staggerFrom, staggerDuration, randomOrder]
  );

  // When flip animation completes, finalize index and reset
  useEffect(() => {
    if (animatingTargetIndex === null) return;

    const totalChars = (wordList[animatingTargetIndex] || "").length;
    const animationDurationMs = Math.max(700, totalChars * 30 + 550);

    const timer = setTimeout(() => {
      setCurrentIndex(animatingTargetIndex);
      setAnimatingTargetIndex(null);
    }, animationDurationMs);

    return () => clearTimeout(timer);
  }, [animatingTargetIndex, wordList]);

  return (
    <ElementTag
      className={cn(
        "relative inline-flex items-center min-h-8 sm:min-h-9 py-1 leading-none overflow-hidden select-none cursor-pointer",
        className
      )}
      style={{ perspective: "1000px" }}
      onClick={triggerFlip}
      title="Click to roll"
      {...props}
    >
      {/* Width reservation: keeps the box at the longest phrase so flips never reflow */}
      <span className="invisible whitespace-nowrap" aria-hidden="true">
        {longestPhrase}
      </span>

      {/* Front Face (Current Phrase) - 3D rotates up and away */}
      <div
        className={cn(
          "absolute inset-0 flex items-center whitespace-nowrap",
          isFlipping && "pointer-events-none"
        )}
      >
        {activeWords.map((wordObj, wordIndex) => (
          <span key={wordIndex} className="inline-flex whitespace-nowrap items-center">
            {wordObj.chars.map(({ char, index }) => {
              const delay = delayFor(index, activePhrase.length);

              return (
                <motion.span
                  key={index}
                  className="inline-block leading-none"
                  style={{
                    transformStyle: "preserve-3d",
                    backfaceVisibility: "hidden",
                    transformOrigin: "50% 50% -12px",
                  }}
                  animate={
                    isFlipping
                      ? {
                          rotateX: 90,
                          opacity: [1, 0.8, 0],
                          color: "#E0A526", // Turns yellow during 3D roll
                        }
                      : {
                          rotateX: 0,
                          opacity: 1,
                          color: "#FFFFFF", // Crisp white when resting
                        }
                  }
                  transition={
                    isFlipping
                      ? {
                          rotateX: { ...transition, delay },
                          opacity: { duration: 0.28, delay },
                          color: { duration: 0.05 },
                        }
                      : {
                          duration: 0.1,
                        }
                  }
                >
                  {char}
                </motion.span>
              );
            })}
            {wordIndex < activeWords.length - 1 && (
              <span className="inline-block whitespace-pre">&nbsp;</span>
            )}
          </span>
        ))}
      </div>

      {/* Top Face (Incoming Phrase) - 3D rolls down from top in exact lockstep */}
      {isFlipping && (
        <div className="absolute inset-0 flex items-center whitespace-nowrap pointer-events-none">
          {targetWords.map((wordObj, wordIndex) => (
            <span key={wordIndex} className="inline-flex whitespace-nowrap items-center">
              {wordObj.chars.map(({ char, index }) => {
                const delay = delayFor(index, targetPhrase.length);

                return (
                  <motion.span
                    key={index}
                    className="inline-block leading-none"
                    style={{
                      transformStyle: "preserve-3d",
                      backfaceVisibility: "hidden",
                      transformOrigin: "50% 50% -12px",
                    }}
                    initial={{
                      rotateX: -90,
                      opacity: 0,
                      color: "#E0A526", // Rolls in with yellow color
                    }}
                    animate={{
                      rotateX: 0,
                      opacity: 1,
                      color: "#FFFFFF", // Transitions to white after completing the 3D roll
                    }}
                    transition={{
                      rotateX: { ...transition, delay },
                      opacity: { duration: 0.22, delay },
                      color: {
                        delay: delay + 0.38, // Stays yellow during flip, then turns white
                        duration: 0.22,
                      },
                    }}
                  >
                    {char}
                  </motion.span>
                );
              })}
              {wordIndex < targetWords.length - 1 && (
                <span className="inline-block whitespace-pre">&nbsp;</span>
              )}
            </span>
          ))}
        </div>
      )}
    </ElementTag>
  );
}

export default Text3DFlip;
