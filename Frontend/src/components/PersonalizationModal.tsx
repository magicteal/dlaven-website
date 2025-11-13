"use client";

import React, { useEffect, useCallback, useRef } from "react";
import { createPortal } from "react-dom";
import gsap from "gsap";
import StyledText from "@/components/StyledText";
import Plus from "@/components/Plus";

export default function PersonalizationModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  // Lock body scroll while open and restore on close
  useEffect(() => {
    if (isOpen) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prev || "auto";
      };
    }
    return;
  }, [isOpen])

  // Refs for animation targets
  const backdropRef = useRef<HTMLDivElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const isClosingRef = useRef(false);
  const enterTlRef = useRef<gsap.core.Timeline | null>(null);
  const exitTlRef = useRef<gsap.core.Timeline | null>(null);

  // Close on Escape (runs animated close)
  const closeWithAnimation = useCallback(() => {
    if (isClosingRef.current) return;
    isClosingRef.current = true;
    // kill any running enter timeline
    if (enterTlRef.current) {
      enterTlRef.current.kill();
      enterTlRef.current = null;
    }

    // remove expensive blur immediately to avoid jank during exit
    try {
      if (backdropRef.current) {
        backdropRef.current.style.backdropFilter = "";
        backdropRef.current.style.backgroundColor = "rgba(0,0,0,0.3)";
      }
    } catch {
      /* ignore */
    }

    // animate panel upward (center -> up) and backdrop fade
    const tl = gsap.timeline({ defaults: { ease: "power3.in" } });
    exitTlRef.current = tl;
    tl.to(panelRef.current, {
      y: -40,
      autoAlpha: 0,
      scale: 0.98,
      duration: 0.34,
    })
      .to(backdropRef.current, { autoAlpha: 0, duration: 0.28 }, "-=" + 0.28)
      .call(() => {
        // notify parent to unmount / set isOpen=false
        isClosingRef.current = false;
        exitTlRef.current = null;
        onClose();
      });
  }, [onClose]);

  const handleKey = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") closeWithAnimation();
    },
    [closeWithAnimation]
  );

  useEffect(() => {
    if (!isOpen) return;
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [isOpen, handleKey]);

  const modal = (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center px-4">
      {/* Backdrop: covers whole viewport. Removed heavy blur for performance; animate opacity only */}
      <div
        ref={backdropRef}
        className="absolute inset-0 bg-black/30"
        onClick={closeWithAnimation}
        style={{ opacity: 0, willChange: "opacity, transform" }}
      />

      {/* Panel */}
      <div
        ref={panelRef}
        className="relative z-10 max-w-3xl w-full max-h-[90vh] overflow-auto bg-white p-8 sm:p-12 shadow-xl rounded-md transform"
        style={{
          opacity: 0,
          transform: "translateY(24px) scale(0.99)",
          willChange: "transform, opacity",
        }}
      >
        <button
          aria-label="Close"
          onClick={closeWithAnimation}
          className="absolute right-4 top-4 text-gray-600 hover:text-black text-2xl leading-none"
        >
          ×
        </button>

        <div className="text-center">
          <h2 className="text-2xl sm:text-3xl tracking-wider uppercase font-semibold mb-6">
            PERSONALIZATION SERVICES
          </h2>

          <p className="text-base sm:text-lg leading-relaxed mb-8">
            To personalize your DL pieces, connect directly with our concierge.
          </p>

          <p className="mb-6 text-lg">
            <StyledText>{"Message us at : - "}</StyledText>
            <span className="font-medium">
              <Plus />917488575159
            </span>
          </p>

          <p className="text-sm italic text-neutral-600 mb-8">
             Our team will assist you in creating your unique DL design
          </p>

          <p className="text-lg font-medium tracking-wide uppercase mb-8">
            Personalization is available across all DL products
          </p>

          <div>
            <button
              onClick={() => {
                // open phone dialer
                window.location.href = "tel:+917488575159";
              }}
              className="inline-block bg-black text-white px-6 py-3 rounded-none tracking-wide uppercase"
            >
              Message Concierge
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // Render via portal so the modal/backdrop cover the full viewport and are not clipped by parent stacking contexts
  // Play entrance animation after mount
  useEffect(() => {
    if (!isOpen) return;

    // kill any previous exit timeline
    if (exitTlRef.current) {
      exitTlRef.current.kill();
      exitTlRef.current = null;
    }
    // helper: enable lightweight backdrop blur after entrance completes
    const enableBackdropBlur = () => {
      try {
        if (!backdropRef.current) return;
        const width = typeof window !== "undefined" ? window.innerWidth : 0;
        const blurPx = width >= 768 ? 6 : 4;
        backdropRef.current.style.backdropFilter = `blur(${blurPx}px)`;
        backdropRef.current.style.backgroundColor = "rgba(0,0,0,0.38)";
      } catch {
        /* ignore */
      }
    };

    // entrance animation: slide up from below to center (faster)
    const tl = gsap.timeline({ defaults: { ease: "power2.out" } });
    enterTlRef.current = tl;
    // start states
    tl.set(backdropRef.current, { autoAlpha: 0 });
    tl.set(panelRef.current, { autoAlpha: 0, y: 90, scale: 0.995 });
    // animate backdrop and panel (shorter durations)
    tl.to(backdropRef.current, { autoAlpha: 1, duration: 0.18 }, 0);
    tl.to(
      panelRef.current,
      { y: 0, autoAlpha: 1, scale: 1, duration: 0.22 },
      0.02
    );
    // enable blur once entrance completes
    tl.call(enableBackdropBlur, [], ">");

    return () => {
      if (enterTlRef.current) {
        enterTlRef.current.kill();
        enterTlRef.current = null;
      }
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return typeof document !== "undefined"
    ? createPortal(modal, document.body)
    : null;
}
