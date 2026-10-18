"use client";

import React, { useEffect, useRef, useState } from "react";
import { X, ArrowRight, Loader2 } from "lucide-react";
import { siteConfig } from "@/config/site-config";
import { track, trackGA } from "@/lib/track";

const RANGES = ["10–25", "26–50", "51–100", "100+"] as const;

export function QuoteModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [name, setName] = useState("");
  const [group, setGroup] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [range, setRange] = useState<string>(RANGES[0]);
  const [neededBy, setNeededBy] = useState("");
  const [cityField, setCityField] = useState("");
  const [notes, setNotes] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");

  const dialogRef = useRef<HTMLDivElement>(null);

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

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");

    const key = process.env.NEXT_PUBLIC_WEB3FORMS_KEY;
    if (!key) {
      setStatus("error");
      return;
    }

    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          access_key: key,
          subject: `Bulk quote request — ${range} boxes`,
          name,
          group,
          whatsapp: phone,
          email,
          boxes: range,
          needed_by: neededBy,
          delivery_city: cityField,
          notes,
        }),
      });
      if (res.ok) track("Lead", "generate_lead", { boxes: range });
      setStatus(res.ok ? "done" : "error");
    } catch {
      setStatus("error");
    }
  };

  const firstName = name.trim().split(" ")[0] || "there";

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-ink/55"
      onClick={onClose}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label="Request a bulk quote"
        onClick={(e) => e.stopPropagation()}
        className="flex w-full flex-col overflow-hidden sm:max-w-[480px] max-h-[92dvh] bg-rice rounded-t-3xl sm:rounded-3xl border-2 border-ink"
        style={{ boxShadow: "8px 8px 0 0 #1B1B1B" }}
      >
        <div className="shrink-0 bg-rice flex items-start justify-between gap-4 p-5 border-b-2 border-ink">
          <div>
            <h3 className="font-disko text-2xl text-ink">Let&apos;s talk numbers.</h3>
            <p className="text-sm text-muted mt-0.5">
              Tell me what you need. I&apos;ll reply on WhatsApp within 24 hours.
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="shrink-0 w-11 h-11 rounded-full bg-white border-2 border-ink flex items-center justify-center press cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {status === "done" ? (
          <div className="p-6 text-center">
            <p className="font-disko text-2xl text-ink">Got it, {firstName}.</p>
            <p className="mt-2 text-sm text-muted">
              Expect a WhatsApp from me within 24 hours.
            </p>
          </div>
        ) : (
          <form onSubmit={submit} className="flex min-h-0 flex-1 flex-col">
            <div className="min-h-0 flex-1 overflow-y-auto no-scrollbar p-5 space-y-4">
            <L label="Your name *">
              <input required value={name} onChange={(e) => setName(e.target.value)} className={inp} />
            </L>
            <L label="Company or group (optional)">
              <input value={group} onChange={(e) => setGroup(e.target.value)} className={inp} />
            </L>
            <L label="WhatsApp number *">
              <input
                required
                type="tel"
                inputMode="numeric"
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                className={inp}
              />
            </L>
            <L label="Email (optional)">
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={inp} />
            </L>

            <fieldset>
              <legend className="text-xs font-bold text-ink mb-2">How many boxes? *</legend>
              <div className="flex flex-wrap gap-2">
                {RANGES.map((r) => (
                  <button
                    type="button"
                    key={r}
                    onClick={() => setRange(r)}
                    aria-pressed={range === r}
                    className={`min-h-[36px] px-4 rounded-full border-2 border-ink text-sm font-semibold press cursor-pointer ${
                      range === r ? "bg-ink text-rice" : "bg-white text-ink"
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </fieldset>

            <L label="Need them by *">
              <input
                required
                type="date"
                min={minDate}
                value={neededBy}
                onChange={(e) => setNeededBy(e.target.value)}
                className={inp}
              />
            </L>
            <L label="Delivery city *">
              <input
                required
                value={cityField}
                onChange={(e) => setCityField(e.target.value)}
                className={inp}
              />
            </L>
            <L label="Anything else?">
              <textarea
                rows={2}
                placeholder="Mixed packs, a gift message, one address or many"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className={inp}
              />
            </L>

            {status === "error" && (
              <p className="text-sm font-bold text-chandua">
                That didn&apos;t go through. Try once more, or{" "}
                <a
                  href={siteConfig.whatsappBulkUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline underline-offset-4"
                >
                  WhatsApp me directly
                </a>
                .
              </p>
            )}

            </div>

            {/* Action bar stays put, so the submit is never scrolled out of reach */}
            <div className="shrink-0 border-t-2 border-ink bg-rice p-5 pb-[max(1.25rem,env(safe-area-inset-bottom))]">
            <button
              type="submit"
              disabled={status === "sending"}
              className="w-full min-h-[52px] rounded-full bg-chandua text-rice font-disko text-lg flex items-center justify-center gap-2 border-2 border-ink press cursor-pointer disabled:opacity-60"
              style={{ boxShadow: "5px 5px 0 0 #1B1B1B" }}
            >
              {status === "sending" ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <span>Send request</span>
                  <ArrowRight className="w-5 h-5 stroke-[2.5]" />
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

const inp =
  "w-full px-3.5 py-3 rounded-xl border-2 border-ink text-base text-ink bg-white focus:outline-none focus:border-chandua";

function L({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-xs font-bold text-ink mb-1">{label}</span>
      {children}
    </label>
  );
}
