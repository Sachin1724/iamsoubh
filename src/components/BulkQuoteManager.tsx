"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import { BulkSection } from "@/components/BulkSection";

// Only load the heavy modal and form dependencies if user clicks "Request a quote"
const QuoteModal = dynamic(
  () => import("@/components/QuoteModal").then((mod) => mod.QuoteModal),
  { ssr: false }
);

export function BulkQuoteManager() {
  const [quoteOpen, setQuoteOpen] = useState(false);

  return (
    <>
      <BulkSection onRequestQuote={() => setQuoteOpen(true)} />
      {quoteOpen && <QuoteModal open={quoteOpen} onClose={() => setQuoteOpen(false)} />}
    </>
  );
}
