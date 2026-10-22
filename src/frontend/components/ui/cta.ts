/** The one button style: every call to action on the site comes from here. */
const base =
  "inline-flex cursor-pointer select-none items-center justify-center gap-2 rounded-xl font-gazpacho font-bold tracking-wide shadow-[3px_3px_0_0_#1B1B1B] transition-all hover:brightness-90 active:translate-x-[1px] active:translate-y-[1px] disabled:cursor-not-allowed disabled:opacity-60";

const tones = {
  red: "bg-[#8A1717] text-[#FAF6EE]", // on light or photo backgrounds
  gold: "bg-turmeric text-ink", // on red or dark backgrounds, where red would vanish
} as const;

const sizes = {
  md: "h-[52px] min-h-[52px] px-7 text-base leading-none",
  sm: "h-[52px] min-h-[52px] px-6 text-sm leading-none",
} as const;

export const cta = (tone: keyof typeof tones, size: keyof typeof sizes = "md") =>
  `${base} ${tones[tone]} ${sizes[size]}`;
