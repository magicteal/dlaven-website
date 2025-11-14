"use client";

import React from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

type AnimationType =
  | "fade"
  | "slideUp"
  | "slideDown"
  | "slideLeft"
  | "slideRight"
  | "scale"
  | "scaleUp";

interface RevealOnScrollProps {
  children: React.ReactNode;
  animation?: AnimationType;
  delay?: number;
  duration?: number;
  start?: string;
  className?: string;
}

const animations: Record<AnimationType, { from: gsap.TweenVars; to: gsap.TweenVars }> = {
  fade: { from: { opacity: 0 }, to: { opacity: 1 } },
  slideUp: { from: { opacity: 0, y: 60 }, to: { opacity: 1, y: 0 } },
  slideDown: { from: { opacity: 0, y: -60 }, to: { opacity: 1, y: 0 } },
  slideLeft: { from: { opacity: 0, x: 60 }, to: { opacity: 1, x: 0 } },
  slideRight: { from: { opacity: 0, x: -60 }, to: { opacity: 1, x: 0 } },
  scale: { from: { opacity: 0, scale: 0.85 }, to: { opacity: 1, scale: 1 } },
  scaleUp: { from: { opacity: 0, scale: 1.15 }, to: { opacity: 1, scale: 1 } },
};

export default function RevealOnScroll({
  children,
  animation = "slideUp",
  delay = 0,
  duration = 0.8,
  start = "top 85%",
  className = "",
}: RevealOnScrollProps) {
  const ref = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    if (typeof window === "undefined") return;
    gsap.registerPlugin(ScrollTrigger);

    const el = ref.current;
    if (!el) return;

    const anim = animations[animation];
    gsap.set(el, anim.from);

    const tl = gsap.to(el, {
      ...anim.to,
      duration,
      delay,
      ease: "power3.out",
      scrollTrigger: {
        trigger: el,
        start,
        toggleActions: "play reverse play reverse",
      },
    });

    return () => {
      if (tl && tl.scrollTrigger) tl.scrollTrigger.kill();
      tl.kill();
    };
  }, [animation, delay, duration, start]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
