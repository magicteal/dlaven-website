"use client";

import { useEffect } from "react";
import { initAllScrollReveals, cleanupScrollReveals } from "@/lib/gsap-scroll";

/**
 * Client component that initializes GSAP scroll reveal animations
 * Add this to your layout or any page that needs scroll animations
 */
export default function ScrollRevealInit() {
  useEffect(() => {
    // Initialize animations
    initAllScrollReveals();

    // Cleanup on unmount
    return () => {
      cleanupScrollReveals();
    };
  }, []);

  return null;
}
