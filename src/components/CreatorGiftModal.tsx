"use client";

import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { X, ArrowRight, Loader2, Plus, Trash2, Sparkles, CheckCircle2 } from "lucide-react";
import { trackGA } from "@/lib/track";
import { openMail, SUPPORT_EMAIL } from "@/lib/mailto";

const SOCIAL_PLATFORMS = [
  "Instagram",
  "YouTube",
  "X (Twitter)",
  "LinkedIn",
  "Facebook",
  "Threads",
  "Other",
] as const;

const PLAN_TAGS = [
  "Unboxing Reel",
  "Desk Setup Tour",
  "Odia Tradition Breakdown",
  "Cultural Storytelling",
  "Gift Guide Feature",
  "Shorts / TikTok",
] as const;

interface SocialAccount {
  id: string;
  platform: string;
  url: string;
}

export function CreatorGiftModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [socials, setSocials] = useState<SocialAccount[]>([
    { id: "1", platform: "Instagram", url: "" },
  ]);
  const [streetAddress, setStreetAddress] = useState("");
  const [city, setCity] = useState("");
  const [stateName, setStateName] = useState("");
  const [pincode, setPincode] = useState("");
  const [whatMadeYouStop, setWhatMadeYouStop] = useState("");
  const [selectedPlanTags, setSelectedPlanTags] = useState<string[]>([]);
  const [contentPlan, setContentPlan] = useState("");
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

  const addSocial = () => {
    setSocials((prev) => [
      ...prev,
      { id: Date.now().toString(), platform: "Instagram", url: "" },
    ]);
  };

  const removeSocial = (id: string) => {
    if (socials.length <= 1) return;
    setSocials((prev) => prev.filter((s) => s.id !== id));
  };

  const updateSocial = (id: string, field: "platform" | "url", val: string) => {
    setSocials((prev) =>
      prev.map((s) => (s.id === id ? { ...s, [field]: val } : s))
    );
  };

  const togglePlanTag = (tag: string) => {
    setSelectedPlanTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
    isDragging.current = true;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStartY.current === null) return;
    const diff = e.touches[0].clientY - touchStartY.current;
    if (diff > 0) setDragY(diff);
    else setDragY(0);
  };

  const handleTouchEnd = () => {
    if (dragY > 75) {
      handleClose();
    } else {
      setDragY(0);
    }
    touchStartY.current = null;
    isDragging.current = false;
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");

    openMail("Creator", name, {
      Name: name,
      Phone: phone,
      Email: email,
      Socials: socials.map((s) => `${s.platform}: ${s.url}`).join(" | "),
      Address: `${streetAddress}, ${city}, ${stateName} - ${pincode}`,
      "What made you stop": whatMadeYouStop,
      "Content formats": selectedPlanTags.join(", "),
      "Content plan": contentPlan,
    });

    trackGA("creator_application_submitted");
    setStatus("done");
  };

  const firstName = name.trim().split(" ")[0] || "Creator";

  return createPortal(
    <div
      className={`fixed inset-0 z-[70] flex items-end sm:items-center justify-center bg-ink/75 backdrop-blur-xs transition-opacity duration-200 ${
        isClosing ? "animate-backdrop-fade-out" : "animate-backdrop-fade-in"
      }`}
      style={{
        opacity: dragY > 0 ? Math.max(0.15, 1 - dragY / 350) : undefined,
      }}
      onClick={handleClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Creator Free Calendar Application"
        onClick={(e) => e.stopPropagation()}
        style={{
          transform: dragY > 0 ? `translateY(${dragY}px)` : undefined,
          transition: isDragging.current ? "none" : dragY > 0 ? "transform 0.2s cubic-bezier(0.16, 1, 0.3, 1)" : undefined,
        }}
        className={`flex w-full flex-col overflow-hidden sm:max-w-[540px] max-h-[94dvh] bg-rice rounded-t-3xl sm:rounded-3xl border-2 border-ink shadow-[4px_4px_0_0_var(--color-ink)] will-change-transform ${
          isClosing
            ? "animate-modal-slide-down"
            : dragY === 0
            ? "animate-modal-slide-up"
            : ""
        }`}
      >
        {/* Mobile Drag Handle */}
        <div
          className="sm:hidden w-full flex flex-col items-center pt-2 pb-1 cursor-grab active:cursor-grabbing touch-none select-none"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div className="w-12 h-1.5 rounded-full bg-ink/25 hover:bg-ink/40 transition-colors" />
          <span className="text-[9px] font-semibold tracking-wider uppercase text-ink/40 mt-1">
            Pull down to close
          </span>
        </div>

        {/* Modal Header */}
        <div
          className="shrink-0 bg-rice flex items-start justify-between gap-4 p-5 pt-3 sm:pt-5 border-b-2 border-ink touch-none"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div>
            <div className="flex items-center gap-1.5 mb-1">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-turmeric text-ink text-[10px] font-black uppercase tracking-wider border border-ink">
                <Sparkles className="w-3 h-3 text-brand" />
                Creator Gifting Program
              </span>
            </div>
            <h3 className="font-gazpacho text-2xl sm:text-3xl font-bold text-ink">
              Get a free 2027 box.
            </h3>
            <p className="text-xs sm:text-sm text-muted mt-0.5 max-w-sm">
              Are you a creator or storyteller? Tell us your channels and your plan to feature the calendar. We’ll courier a complimentary box.
            </p>
          </div>
          <button
            type="button"
            onClick={handleClose}
            aria-label="Close"
            className="shrink-0 w-11 h-11 rounded-full bg-white border-2 border-ink shadow-[4px_4px_0_0_var(--color-ink)] flex items-center justify-center hover:bg-[#ECE3D2] active:scale-95 cursor-pointer transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        {status === "done" ? (
          <div className="p-8 text-center my-auto flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-ink text-turmeric border-2 border-ink shadow-[4px_4px_0_0_var(--color-ink)] flex items-center justify-center mb-4">
              <CheckCircle2 className="w-9 h-9" />
            </div>
            <h4 className="font-gazpacho text-3xl font-bold text-ink">
              Application received, {firstName}!
            </h4>
            <p className="mt-2 text-sm text-muted max-w-xs leading-relaxed">
              Your mail app has the application filled in &mdash; send it and Soubh takes it from there. If approved, tracking details come to <span className="font-bold text-ink">{email || "your email"}</span>.
            </p>
            <button
              type="button"
              onClick={handleClose}
              className="mt-6 px-6 py-2.5 rounded-full bg-ink text-rice font-bold text-sm hover:bg-[#333] transition-colors"
            >
              Back to Calendar
            </button>
          </div>
        ) : (
          <form onSubmit={submit} className="flex min-h-0 flex-1 flex-col">
            <div className="min-h-0 flex-1 overflow-y-auto no-scrollbar p-5 space-y-4">
              {/* Creator Name */}
              <L label="Your Name / Creator Handle *">
                <input
                  required
                  placeholder="e.g. Soubhagya Ranjan or @channel"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={inp}
                />
              </L>

              {/* Contact Information */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <L label="Phone number (for dispatch) *">
                  <input
                    required
                    type="tel"
                    inputMode="numeric"
                    placeholder="10-digit number"
                    value={phone}
                    onChange={(e) =>
                      setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))
                    }
                    className={inp}
                  />
                </L>
                <L label="Email Address *">
                  <input
                    required
                    type="email"
                    placeholder="you@domain.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={inp}
                  />
                </L>
              </div>

              {/* Social Accounts with Dropdown + Link + Plus button */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold text-ink">
                    Social Accounts & Links *
                  </label>
                  <button
                    type="button"
                    onClick={addSocial}
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-brand hover:text-chandua cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5 stroke-[3]" />
                    <span>Add another link</span>
                  </button>
                </div>

                <div className="space-y-2">
                  {socials.map((s, idx) => (
                    <div key={s.id} className="flex items-center gap-2">
                      <select
                        value={s.platform}
                        onChange={(e) => updateSocial(s.id, "platform", e.target.value)}
                        className="w-[120px] sm:w-[140px] px-2.5 py-2.5 min-h-[44px] rounded-xl border-2 border-ink text-xs font-bold bg-white text-ink focus:outline-none focus:border-chandua shrink-0"
                      >
                        {SOCIAL_PLATFORMS.map((p) => (
                          <option key={p} value={p}>
                            {p}
                          </option>
                        ))}
                      </select>

                      <input
                        required
                        type="text"
                        placeholder="Profile link or @handle"
                        value={s.url}
                        onChange={(e) => updateSocial(s.id, "url", e.target.value)}
                        className={`${inp} text-xs py-2.5 min-h-[44px] flex-1`}
                      />

                      {socials.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeSocial(s.id)}
                          aria-label="Remove social account"
                          className="shrink-0 w-11 h-11 rounded-xl border-2 border-ink shadow-[4px_4px_0_0_var(--color-ink)] bg-white flex items-center justify-center text-brand hover:bg-[#FBEAEA] active:scale-95 transition-all cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}

                      {idx === socials.length - 1 && (
                        <button
                          type="button"
                          onClick={addSocial}
                          aria-label="Add account"
                          title="Add another social link"
                          className="shrink-0 w-11 h-11 rounded-xl border-2 border-ink shadow-[4px_4px_0_0_var(--color-ink)] bg-turmeric hover:bg-[#d69819] active:scale-95 flex items-center justify-center text-ink font-bold cursor-pointer transition-all"
                        >
                          <Plus className="w-4 h-4 stroke-[3]" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Delivery Address */}
              <div className="space-y-2 pt-1 border-t border-ink/15">
                <span className="block text-xs font-bold text-ink">
                  Shipping Address (Where to courier the box) *
                </span>
                <input
                  required
                  placeholder="House / Flat / Street address / Landmark"
                  value={streetAddress}
                  onChange={(e) => setStreetAddress(e.target.value)}
                  className={inp}
                />
                <div className="grid grid-cols-3 gap-2">
                  <input
                    required
                    placeholder="City"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className={inp}
                  />
                  <input
                    required
                    placeholder="State"
                    value={stateName}
                    onChange={(e) => setStateName(e.target.value)}
                    className={inp}
                  />
                  <input
                    required
                    inputMode="numeric"
                    placeholder="Pincode"
                    value={pincode}
                    onChange={(e) =>
                      setPincode(e.target.value.replace(/\D/g, "").slice(0, 6))
                    }
                    className={inp}
                  />
                </div>
              </div>

              {/* What made you stop at this calendar? */}
              <div className="space-y-2 pt-1 border-t border-ink/15">
                <L label="What made you stop at this calendar? *">
                  <textarea
                    required
                    rows={2}
                    placeholder="What caught your eye? The art style, the 13 festivals, the Odia nostalgia, the craftsmanship?"
                    value={whatMadeYouStop}
                    onChange={(e) => setWhatMadeYouStop(e.target.value)}
                    className={inp}
                  />
                </L>
              </div>

              {/* Content Format Tags & Plan */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-ink">
                  What&apos;s your content plan to feature it? *
                </label>
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {PLAN_TAGS.map((tag) => {
                    const active = selectedPlanTags.includes(tag);
                    return (
                      <button
                        type="button"
                        key={tag}
                        onClick={() => togglePlanTag(tag)}
                        className={`text-[11px] font-semibold px-2.5 py-1 rounded-full border-2 border-ink shadow-[4px_4px_0_0_var(--color-ink)] cursor-pointer transition-all ${
                          active
                            ? "bg-ink text-cream"
                            : "bg-white text-ink hover:bg-[#ECE3D2]"
                        }`}
                      >
                        {tag} {active && "✓"}
                      </button>
                    );
                  })}
                </div>

                <textarea
                  required
                  rows={2}
                  placeholder="Tell us what you plan to create (e.g. An unboxing reel on Grand Road Rath Yatra, showing all 13 festival art cards to my Odia audience)..."
                  value={contentPlan}
                  onChange={(e) => setContentPlan(e.target.value)}
                  className={inp}
                />
              </div>

              {status === "error" && (
                <p className="text-xs font-bold text-chandua sm:text-sm">
                  That didn&apos;t open your mail app. Write to{" "}
                  <a href={`mailto:${SUPPORT_EMAIL}`} className="underline underline-offset-4">
                    {SUPPORT_EMAIL}
                  </a>{" "}
                  instead.
                </p>
              )}
            </div>

            {/* Sticky Action Footer */}
            <div className="shrink-0 border-t-2 border-ink bg-rice p-4 sm:p-5 pb-[max(1.25rem,env(safe-area-inset-bottom))]">
              <button
                type="submit"
                disabled={status === "sending"}
                className="w-full min-h-[50px] rounded-full bg-chandua text-rice font-disko text-base sm:text-lg flex items-center justify-center gap-2 border-2 border-ink shadow-[4px_4px_0_0_var(--color-ink)] press cursor-pointer disabled:opacity-60 hover:bg-[#b01c15] transition-colors"
                style={{ boxShadow: "4px 4px 0 0 #1B1B1B" }}
              >
                {status === "sending" ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <span>Submit Creator Application</span>
                    <ArrowRight className="w-5 h-5 stroke-[2.5]" />
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

const inp =
  "w-full px-3 py-2.5 rounded-xl border-2 border-ink text-sm text-ink bg-white focus:outline-none focus:border-chandua";

function L({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-xs font-bold text-ink mb-1">{label}</span>
      {children}
    </label>
  );
}
