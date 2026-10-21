"use client";

import React, { useEffect, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { X, ArrowRight, ArrowLeft, Loader2, Check, CheckCircle2 } from "lucide-react";
import { submitForm, SUPPORT_EMAIL } from "@/frontend/lib/mailto";
import { track, trackGA } from "@/frontend/lib/track";

const RANGES = ["10–25", "26–50", "51–100", "100+"] as const;

// One question per screen.
const STEPS = ["boxes", "date", "city", "who", "contact", "notes"] as const;
type Step = (typeof STEPS)[number];

const QUESTIONS: Record<Step, { q: string; hint?: string }> = {
  boxes: { q: "How many boxes?", hint: "A rough range is fine." },
  date: { q: "When do you need them?", hint: "At least a week from today." },
  city: { q: "Where should they go?", hint: "The delivery city." },
  who: { q: "Who is this for?", hint: "Your name, and a company or group if there is one." },
  contact: { q: "How do we reach you?", hint: "I'll reply by email within 24 hours." },
  notes: { q: "Anything else?", hint: "Optional. Mixed packs, a gift message, one address or many." },
};

export function QuoteModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const reduceMotion = useReducedMotion();
  const [stepIdx, setStepIdx] = useState(0);
  const [dir, setDir] = useState(1);
  const [range, setRange] = useState<string>(RANGES[0]);
  const [neededBy, setNeededBy] = useState("");
  const [cityField, setCityField] = useState("");
  const [name, setName] = useState("");
  const [group, setGroup] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [notes, setNotes] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");

  useEffect(() => {
    if (!open) return;
    trackGA("quote_open");
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  // At least seven days out, per the brief.
  const minDate = new Date(Date.now() + 7 * 86400000).toISOString().slice(0, 10);

  const step: Step = STEPS[stepIdx];
  const last = stepIdx === STEPS.length - 1;
  // Continue unlocks when the current question is answered. Email and notes are optional.
  const ok: Record<Step, boolean> = {
    boxes: true,
    date: neededBy >= minDate,
    city: cityField.trim().length > 1,
    who: name.trim().length > 1,
    contact: /^\d{10}$/.test(phone) && (email.trim() === "" || /\S+@\S+\.\S+/.test(email)),
    notes: true,
  };

  const go = (by: number) => {
    setDir(by);
    setStepIdx((i) => Math.min(STEPS.length - 1, Math.max(0, i + by)));
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ok[step] || status === "sending") return;
    if (!last) return go(1);
    setStatus("sending");

    const saved = await submitForm("Bulk", {
      Name: name,
      "Company or group": group,
      Phone: phone,
      Email: email,
      Boxes: range,
      "Needed by": neededBy,
      "Delivery city": cityField,
      Notes: notes,
    });

    if (!saved) return setStatus("error");
    track("Lead", "generate_lead", { boxes: range });
    setStatus("done");
  };

  const firstName = name.trim().split(" ")[0] || "there";

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-ink/60 backdrop-blur-sm sm:items-center"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Request a bulk quote"
        onClick={(e) => e.stopPropagation()}
        className="flex max-h-[94dvh] w-full flex-col overflow-hidden rounded-t-[28px] bg-rice shadow-[0_24px_80px_rgba(0,0,0,0.35)] sm:max-w-[480px] sm:rounded-[28px]"
      >
        <div className="flex w-full justify-center pb-1 pt-2.5 sm:hidden">
          <div className="h-1 w-10 rounded-full bg-ink/20" />
        </div>

        {status === "done" ? (
          <div className="my-auto flex flex-col items-center p-8 pb-10 text-center">
            <CheckCircle2 className="h-14 w-14 text-parrot" aria-hidden="true" />
            <h4 className="mt-4 font-gazpacho text-2xl font-bold tracking-[-0.02em] text-ink">
              Got it, {firstName}.
            </h4>
            <p className="mt-2 max-w-xs text-[0.95rem] leading-relaxed text-ink/65">
              Your request is in. I'll reply within 24 hours.
            </p>
            <button
              type="button"
              onClick={onClose}
              className="mt-6 min-h-[48px] rounded-full bg-ink px-8 text-sm font-semibold text-rice transition-transform active:scale-[0.97]"
            >
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={submit} className="relative flex min-h-0 flex-1 flex-col">
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
                onClick={onClose}
                aria-label="Close"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-ink/5 text-ink transition-transform active:scale-90"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* One question */}
            <div className="no-scrollbar min-h-[300px] flex-1 overflow-y-auto px-6 pb-4 pt-7">
              <motion.div
                key={step}
                initial={reduceMotion ? false : { opacity: 0, x: 24 * dir }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ type: "spring", bounce: 0, duration: 0.4 }}
              >
                <p className="text-xs font-semibold uppercase tracking-wider text-chandua">
                  Bulk quote · {stepIdx + 1} of {STEPS.length}
                </p>
                <h3 className="mt-2 font-gazpacho text-[1.75rem] font-bold leading-[1.1] tracking-[-0.02em] text-ink">
                  {QUESTIONS[step].q}
                </h3>
                {QUESTIONS[step].hint && (
                  <p className="mt-1.5 text-[0.95rem] text-ink/60">{QUESTIONS[step].hint}</p>
                )}

                <div className="mt-6 space-y-3">
                  {step === "boxes" &&
                    RANGES.map((r) => (
                      <button
                        type="button"
                        key={r}
                        aria-pressed={range === r}
                        onClick={() => setRange(r)}
                        className={`flex w-full items-center justify-between gap-3 rounded-2xl px-4 py-3.5 text-left text-[0.95rem] font-semibold transition-all active:scale-[0.98] ${
                          range === r ? "bg-chandua text-rice" : "bg-ink/[0.05] text-ink"
                        }`}
                      >
                        <span>{r} boxes</span>
                        {range === r && <Check className="h-4 w-4 shrink-0" strokeWidth={3} />}
                      </button>
                    ))}

                  {step === "date" && (
                    <input
                      autoFocus
                      type="date"
                      min={minDate}
                      value={neededBy}
                      onChange={(e) => setNeededBy(e.target.value)}
                      className={inp}
                    />
                  )}

                  {step === "city" && (
                    <input
                      autoFocus
                      autoComplete="address-level2"
                      placeholder="e.g. Bhubaneswar"
                      value={cityField}
                      onChange={(e) => setCityField(e.target.value)}
                      className={inp}
                    />
                  )}

                  {step === "who" && (
                    <>
                      <input
                        autoFocus
                        autoComplete="name"
                        placeholder="Your name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className={inp}
                      />
                      <input
                        autoComplete="organization"
                        placeholder="Company or group (optional)"
                        value={group}
                        onChange={(e) => setGroup(e.target.value)}
                        className={inp}
                      />
                    </>
                  )}

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
                        placeholder="Email (optional)"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className={inp}
                      />
                    </>
                  )}

                  {step === "notes" && (
                    <textarea
                      autoFocus
                      rows={4}
                      placeholder="Anything that helps me quote you"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className={inp}
                    />
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
                    <span>{last ? "Send request" : "Continue"}</span>
                    {!last && <ArrowRight className="h-4 w-4" />}
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

// 16px so iOS does not zoom the page on focus; soft fill, ring on focus.
const inp =
  "w-full rounded-2xl bg-ink/[0.05] px-4 py-3.5 text-base text-ink placeholder:text-ink/40 outline-none transition-shadow focus:ring-2 focus:ring-chandua/60";
