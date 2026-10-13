import React from "react";
import Link from "next/link";
import { siteConfig } from "@/config/site-config";

/** Shows a loud marker instead of silently rendering an empty legal field. */
export function Confirm({ value, label }: { value: string; label: string }) {
  if (value) return <>{value}</>;
  return (
    <mark className="bg-[#E0A526] text-[#1B1B1B] font-bold px-1.5 py-0.5 rounded">
      [TO CONFIRM: {label}]
    </mark>
  );
}

export function PolicyPage({
  title,
  updated = "October 2026",
  children,
}: {
  title: string;
  updated?: string;
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen bg-[#F6EFE2] text-[#1B1B1B]">
      <div className="max-w-[680px] mx-auto px-5 py-14 sm:py-20">
        <Link
          href="/"
          className="text-sm font-semibold underline underline-offset-4 decoration-2"
        >
          Back to the calendar
        </Link>

        <h1 className="font-disko text-4xl sm:text-5xl mt-6">{title}</h1>
        <p className="text-sm text-[#4A4642] mt-2">Last updated {updated}</p>

        <div className="mt-8 space-y-5 text-base leading-relaxed [&_h2]:font-disko [&_h2]:text-2xl [&_h2]:mt-10 [&_h2]:mb-1 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-2 [&_a]:underline [&_a]:underline-offset-4">
          {children}
        </div>

        <hr className="my-12 border-t-2 border-[#1B1B1B]" />

        <p className="text-sm text-[#4A4642]">
          Questions? WhatsApp {siteConfig.whatsappNumber} or write to{" "}
          <Confirm value={siteConfig.supportEmail} label="support email" />.
        </p>
      </div>
    </main>
  );
}
