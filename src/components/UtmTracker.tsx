"use client";

import { useEffect } from "react";
import { captureUtm } from "@/lib/utm";

export function UtmTracker() {
  useEffect(() => {
    captureUtm();
  }, []);

  return null;
}
