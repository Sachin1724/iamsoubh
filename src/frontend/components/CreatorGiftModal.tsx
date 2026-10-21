"use client";

import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { motion, useReducedMotion } from "motion/react";
import { X, ArrowRight, ArrowLeft, Loader2, Check, CheckCircle2 } from "lucide-react";
import { trackGA } from "@/frontend/lib/track";
import { submitForm, SUPPORT_EMAIL } from "@/frontend/lib/mailto";

const PLATFORMS = ["Instagram", "YouTube", "Facebook", "X", "LinkedIn"] as const;

// A handle, with or without the @. The profile link is built from it for the mail.
const PROFILE_URL: Record<(typeof PLATFORMS)[number], string> = {
  Instagram: "https://instagram.com/",
  YouTube: "https://youtube.com/@",
  Facebook: "https://facebook.com/",
  X: "https://x.com/",
  LinkedIn: "https://linkedin.com/in/",
};
const cleanHandle = (v: string) => v.trim().replace(/^@/, "");
const isHandle = (v: string) => /^[\w.-]{2,40}$/.test(cleanHandle(v));

const PLAN_TAGS = [
  "Unboxing reel",
  "Desk setup tour",
  "Odia tradition breakdown",
  "Cultural storytelling",
  "Gift guide feature",
  "Shorts / TikTok",
] as const;

const HOOKS = ["The art style", "The 13 festivals", "Odia nostalgia", "The craftsmanship"] as const;

// One question per screen.
const STEPS = ["name", "social", "plan", "hook", "contact", "address"] as const;
type Step = (typeof STEPS)[number];

const QUESTIONS: Record<Step, { q: string; hint?: string }> = {
  name: { q: "What should we call you?", hint: "Just your name." },
  social: { q: "Where do you post?", hint: "Pick every place you post. We will ask for your handle." },
  plan: { q: "How would you feature it?", hint: "Pick all that fit." },
  hook: { q: "What made you stop at this calendar?", hint: "Pick all that fit." },
  contact: { q: "How do we reach you?", hint: "Only for dispatch updates." },
  address: { q: "Where should we send the box?" },
};

export function CreatorGiftModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const reduceMotion = useReducedMotion();
  const [stepIdx, setStepIdx] = useState(0);
  const [dir, setDir] = useState(1);
  const [name, setName] = useState("");
  const [socials, setSocials] = useState<Record<string, string>>({});
  const [editing, setEditing] = useState<string | null>(null);
  const [draft, setDraft] = useState("");
  const [plans, setPlans] = useState<string[]>([]);
  const [hooks, setHooks] = useState<string[]>([]);
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [stateName, setStateName] = useState("");
  const [pincode, setPincode] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [isClosing, setIsClosing] = useState(false);
  const [dragY, setDragY] = useState(0);

  const touchStartY = useRef<number | null>(null);
  const isDragging = useRef(false);

  const handleClose = React.useCallback(() => {
    if (isClosing) return;
    setIsClosing(true);
    setTimeout(() => {
      onClose();
      setIsClosing(false);
      setDragY(0);
    }, 280);
  }, [isClosing, onClose]);

  useEffect(() => {
    if (!open) return;
    trackGA("creator_modal_open");
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && handleClose();
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, handleClose]);

  if (!open || typeof document === "undefined") return null;

  const step: Step = STEPS[stepIdx];
  const last = stepIdx === STEPS.length - 1;
  // Continue unlocks when the current question is answered.
  const ok: Record<Step, boolean> = {
    name: name.trim().length > 1,
    social: Object.keys(socials).length > 0,
    plan: plans.length > 0,
    hook: hooks.length > 0,
    contact: /^\d{10}$/.test(phone) && /\S+@\S+\.\S+/.test(email),
    address:
      street.trim().length > 2 && city.trim().length > 0 && stateName.trim().length > 0 && /^\d{6}$/.test(pincode),
  };

  const toggle = (list: string[], set: (v: string[]) => void, v: string) =>
    set(list.includes(v) ? list.filter((x) => x !== v) : [...list, v]);

  const go = (by: number) => {
    setDir(by);
    setStepIdx((i) => Math.min(STEPS.length - 1, Math.max(0, i + by)));
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
    isDragging.current = true;
  };
  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStartY.current === null) return;
    const diff = e.touches[0].clientY - touchStartY.current;
    setDragY(diff > 0 ? diff : 0);
  };
  const handleTouchEnd = () => {
    if (dragY > 75) handleClose();
    else setDragY(0);
    touchStartY.current = null;
    isDragging.current = false;
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ok[step] || status === "sending") return;
    if (!last) return go(1);
    setStatus("sending");

    const saved = await submitForm("Creator", {
      Name: name,
      Phone: phone,
      Email: email,
      Socials: Object.entries(socials)
        .map(([p, u]) => `${p}: ${u} (${PROFILE_URL[p as (typeof PLATFORMS)[number]]}${cleanHandle(u)})`)
        .join(" | "),
      Address: `${street}, ${city}, ${stateName} - ${pincode}`,
      "What made you stop": hooks.join(", "),
      "Content formats": plans.join(", "),
    });

    if (!saved) return setStatus("error");
    trackGA("creator_application_submitted");
    setStatus("done");
  };

  const firstName = name.trim().split(" ")[0] || "Creator";

  return createPortal(
    <div
      className={`fixed inset-0 z-[70] flex items-end sm:items-center justify-center bg-ink/60 backdrop-blur-sm transition-opacity duration-200 ${
        isClosing ? "animate-backdrop-fade-out" : "animate-backdrop-fade-in"
      }`}
      style={{ opacity: dragY > 0 ? Math.max(0.15, 1 - dragY / 350) : undefined }}
      onClick={handleClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Creator free calendar application"
        onClick={(e) => e.stopPropagation()}
        style={{
          transform: dragY > 0 ? `translateY(${dragY}px)` : undefined,
          transition: isDragging.current ? "none" : dragY > 0 ? "transform 0.2s cubic-bezier(0.16, 1, 0.3, 1)" : undefined,
        }}
        className={`relative flex w-full flex-col overflow-hidden sm:max-w-[480px] max-h-[94dvh] bg-rice rounded-t-[28px] sm:rounded-[28px] shadow-[0_24px_80px_rgba(0,0,0,0.35)] will-change-transform ${
          isClosing ? "animate-modal-slide-down" : dragY === 0 ? "animate-modal-slide-up" : ""
        }`}
      >
        {/* Small pop-up: the full profile link for the platform just picked */}
        {editing && (
          <div
            className="absolute inset-0 z-10 flex items-end justify-center bg-ink/40 p-4 sm:items-center"
            onClick={() => setEditing(null)}
          >
            <div
              role="dialog"
              aria-label={`${editing} handle`}
              onClick={(e) => e.stopPropagation()}
              className="w-full rounded-3xl bg-rice p-5 shadow-[0_16px_48px_rgba(0,0,0,0.3)]"
            >
              <p className="font-gazpacho text-lg font-bold text-ink">Your {editing} handle</p>
              <p className="mt-0.5 text-sm text-ink/60">Just the username, like @iamsoubh.</p>
              <input
                autoFocus
                autoCapitalize="none"
                placeholder="@yourname"
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                className={`${inp} mt-3`}
              />
              {draft.trim() && !isHandle(draft) && (
                <p className="mt-2 text-sm font-semibold text-chandua">Letters, numbers, dots and underscores only.</p>
              )}
              <div className="mt-4 flex gap-2">
                {editing in socials && (
                  <button
                    type="button"
                    onClick={() => {
                      setSocials(({ [editing]: _removed, ...rest }) => rest);
                      setEditing(null);
                    }}
                    className="min-h-[48px] rounded-full bg-ink/5 px-5 text-sm font-semibold text-ink"
                  >
                    Remove
                  </button>
                )}
                <button
                  type="button"
                  disabled={!isHandle(draft)}
                  onClick={() => {
                    setSocials((cur) => ({ ...cur, [editing]: `@${cleanHandle(draft)}` }));
                    setEditing(null);
                  }}
                  className="min-h-[48px] flex-1 rounded-full bg-chandua text-sm font-bold text-rice transition-transform active:scale-[0.98] disabled:bg-ink/10 disabled:text-ink/35"
                >
                  Add
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Grabber: pull down to close on phones */}
        <div
          className="sm:hidden flex w-full touch-none select-none justify-center pt-2.5 pb-1"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div className="h-1 w-10 rounded-full bg-ink/20" />
        </div>

        {status === "done" ? (
          <div className="my-auto flex flex-col items-center p-8 pb-10 text-center">
            <CheckCircle2 className="h-14 w-14 text-parrot" aria-hidden="true" />
            <h4 className="mt-4 font-gazpacho text-2xl font-bold tracking-[-0.02em] text-ink">
              Thank you, {firstName}.
            </h4>
            <p className="mt-2 max-w-xs text-[0.95rem] leading-relaxed text-ink/65">
              Your application is in. Soubh reviews every one. If approved,
              tracking details come to <span className="font-semibold text-ink">{email}</span>.
            </p>
            <button
              type="button"
              onClick={handleClose}
              className="mt-6 min-h-[48px] rounded-full bg-ink px-8 text-sm font-semibold text-rice transition-transform active:scale-[0.97]"
            >
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={submit} className="flex min-h-0 flex-1 flex-col">
            {/* Top bar: back, progress, close */}
            <div className="flex items-center gap-3 px-5 pt-3">
              <button
                type="button"
                onClick={() => go(-1)}
                disabled={stepIdx === 0}
                aria-label="Back"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-ink/5 text-ink transition-opacity disabled:opacity-0"
              >
                <ArrowLeft className="h-4 w-4" />
              </button>
              <div className="flex flex-1 gap-1.5" aria-label={`Question ${stepIdx + 1} of ${STEPS.length}`}>
                {STEPS.map((s, i) => (
                  <span
                    key={s}
                    className={`h-1 flex-1 rounded-full transition-colors duration-300 ${
                      i <= stepIdx ? "bg-chandua" : "bg-ink/10"
                    }`}
                  />
                ))}
              </div>
              <button
                type="button"
                onClick={handleClose}
                aria-label="Close"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-ink/5 text-ink transition-transform active:scale-90"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* One question */}
            <div className="min-h-[320px] flex-1 overflow-y-auto px-6 pb-4 pt-7 no-scrollbar">
              <motion.div
                key={step}
                initial={reduceMotion ? false : { opacity: 0, x: 24 * dir }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ type: "spring", bounce: 0, duration: 0.4 }}
              >
                <p className="text-xs font-semibold uppercase tracking-wider text-chandua">
                  Free 2027 box · {stepIdx + 1} of {STEPS.length}
                </p>
                <h3 className="mt-2 font-gazpacho text-[1.75rem] font-bold leading-[1.1] tracking-[-0.02em] text-ink">
                  {QUESTIONS[step].q}
                </h3>
                {QUESTIONS[step].hint && (
                  <p className="mt-1.5 text-[0.95rem] text-ink/60">{QUESTIONS[step].hint}</p>
                )}

                <div className="mt-6 space-y-3">
                  {step === "name" && (
                    <input
                      autoFocus
                      autoComplete="name"
                      placeholder="e.g. Soubhagya Ranjan"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className={inp}
                    />
                  )}

                  {step === "social" && (
                    <>
                      <div className="flex flex-wrap gap-2">
                        {PLATFORMS.map((p) => (
                          <Option
                            key={p}
                            on={p in socials}
                            compact
                            onClick={() => {
                              setEditing(p);
                              setDraft(socials[p] ?? "");
                            }}
                          >
                            {p}
                            {p in socials && <Check className="ml-1.5 inline h-3.5 w-3.5" strokeWidth={3} />}
                          </Option>
                        ))}
                      </div>
                      {Object.entries(socials).map(([p, u]) => (
                        <p key={p} className="truncate rounded-xl bg-ink/[0.05] px-3 py-2 text-sm text-ink/70">
                          <span className="font-semibold text-ink">{p}</span> · {u}
                        </p>
                      ))}
                    </>
                  )}

                  {step === "plan" &&
                    PLAN_TAGS.map((t) => (
                      <Option key={t} on={plans.includes(t)} onClick={() => toggle(plans, setPlans, t)}>
                        {t}
                      </Option>
                    ))}

                  {step === "hook" &&
                    HOOKS.map((t) => (
                      <Option key={t} on={hooks.includes(t)} onClick={() => toggle(hooks, setHooks, t)}>
                        {t}
                      </Option>
                    ))}

                  {step === "contact" && (
                    <>
                      <input
                        autoFocus
                        type="tel"
                        inputMode="numeric"
                        autoComplete="tel-national"
                        placeholder="10-digit mobile number"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                        className={inp}
                      />
                      <input
                        type="email"
                        autoComplete="email"
                        placeholder="Your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className={inp}
                      />
                    </>
                  )}

                  {step === "address" && (
                    <>
                      <input
                        autoFocus
                        autoComplete="street-address"
                        placeholder="House / flat, street, landmark"
                        value={street}
                        onChange={(e) => setStreet(e.target.value)}
                        className={inp}
                      />
                      <div className="grid grid-cols-2 gap-3">
                        <input
                          autoComplete="address-level2"
                          placeholder="City"
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                          className={inp}
                        />
                        <input
                          autoComplete="address-level1"
                          placeholder="State"
                          value={stateName}
                          onChange={(e) => setStateName(e.target.value)}
                          className={inp}
                        />
                      </div>
                      <input
                        inputMode="numeric"
                        autoComplete="postal-code"
                        placeholder="Pincode"
                        value={pincode}
                        onChange={(e) => setPincode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                        className={inp}
                      />
                    </>
                  )}
                </div>

                {status === "error" && (
                  <p className="mt-4 text-sm font-semibold text-chandua">
                    That didn&apos;t go through. Try again, or write to{" "}
                    <a href={`mailto:${SUPPORT_EMAIL}`} className="underline underline-offset-4">
                      {SUPPORT_EMAIL}
                    </a>{" "}
                    instead.
                  </p>
                )}
              </motion.div>
            </div>

            <div className="shrink-0 px-6 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-2">
              <button
                type="submit"
                disabled={!ok[step] || status === "sending"}
                className="flex min-h-[52px] w-full items-center justify-center gap-2 rounded-full bg-chandua font-gazpacho text-base font-bold text-rice transition-all active:scale-[0.98] disabled:bg-ink/10 disabled:text-ink/35"
              >
                {status === "sending" ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    <span>{last ? "Send application" : "Continue"}</span>
                    {!last && <ArrowRight className="h-4 w-4" />}
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>,
    document.body
  );
}

// 16px so iOS does not zoom the page on focus; soft fill, ring on focus.
const inp =
  "w-full rounded-2xl bg-ink/[0.05] px-4 py-3.5 text-base text-ink placeholder:text-ink/40 outline-none transition-shadow focus:ring-2 focus:ring-chandua/60";

function Option({
  on,
  onClick,
  compact,
  children,
}: {
  on: boolean;
  onClick: () => void;
  compact?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-pressed={on}
      onClick={onClick}
      className={`flex items-center justify-between gap-3 rounded-2xl text-left text-[0.95rem] font-semibold transition-all active:scale-[0.98] ${
        compact ? "px-4 py-2.5" : "w-full px-4 py-3.5"
      } ${on ? "bg-chandua text-rice" : "bg-ink/[0.05] text-ink"}`}
    >
      <span>{children}</span>
      {on && !compact && <Check className="h-4 w-4 shrink-0" strokeWidth={3} />}
    </button>
  );
}
