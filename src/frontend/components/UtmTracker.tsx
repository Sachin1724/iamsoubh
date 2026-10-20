"use client";

import { useEffect } from "react";
import { captureUtm } from "@/frontend/lib/utm";

export function UtmTracker() {
  useEffect(() => {
    captureUtm();
  }, []);

  return null;
}
