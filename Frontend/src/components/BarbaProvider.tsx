"use client";

import { useEffect, useRef } from "react";

type BarbaCtx = { container: Element };

export default function BarbaProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let destroyed = false;
    let _barba: unknown = null;

    (async () => {
      try {
        // Dynamically import to avoid SSR evaluation errors
        const [{ default: barba }, gsapModule] = await Promise.all([
          import("@barba/core"),
          import("gsap"),
        ]);
        type GSAPBasic = {
          to: (
            target: Element | Element[] | NodeListOf<Element> | unknown,
            vars: Record<string, unknown>
          ) => unknown;
          from: (
            target: Element | Element[] | NodeListOf<Element> | unknown,
            vars: Record<string, unknown>
          ) => unknown;
        };
        const gsap: GSAPBasic =
          (gsapModule as unknown as { default?: GSAPBasic }).default ??
          (gsapModule as unknown as GSAPBasic);

        if (destroyed) return;

        _barba = barba;
        (barba as unknown as { init: (opts: unknown) => unknown }).init({
          sync: true,
          preventRunning: true,
          transitions: [
            {
              name: "fade",
              once({ next }: { next: BarbaCtx }) {
                gsap.from(next.container, { autoAlpha: 0, duration: 0.6 });
              },
              leave({ current }: { current: BarbaCtx }) {
                return gsap.to(current.container, {
                  autoAlpha: 0,
                  duration: 0.45,
                });
              },
              enter({ next }: { next: BarbaCtx }) {
                return gsap.from(next.container, {
                  autoAlpha: 0,
                  duration: 0.45,
                });
              },
            },
          ],
        });
        // After mount, set a deterministic namespace to avoid hydration mismatch, then update to the real path
        if (containerRef.current && typeof window !== "undefined") {
          containerRef.current.setAttribute(
            "data-barba-namespace",
            window.location.pathname
          );
        }
      } catch (err) {
        // if barba fails to init (missing package, SSR issues), log and continue
        // use console directly; this is not a runtime-critical error
        console.warn("barba init failed:", err);
      }
    })();

    return () => {
      destroyed = true;
      try {
        if (
          _barba &&
          typeof (_barba as unknown as { destroy?: unknown }).destroy ===
            "function"
        ) {
          (_barba as unknown as { destroy?: () => unknown }).destroy?.();
        }
      } catch {
        // ignore
      }
    };
  }, []);

  // data-barba attributes are required by barba to find wrapper/container
  return (
    <div data-barba="wrapper" ref={wrapperRef}>
      <div
        data-barba="container"
        // use a stable SSR attribute to avoid hydration mismatch; set real value after mount
        data-barba-namespace="default"
        ref={containerRef}
      >
        {children}
      </div>
    </div>
  );
}
