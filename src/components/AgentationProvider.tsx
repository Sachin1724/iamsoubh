"use client";

import React, { useEffect, useState } from "react";
import { Agentation } from "agentation";

export function AgentationProvider() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return <Agentation />;
}
