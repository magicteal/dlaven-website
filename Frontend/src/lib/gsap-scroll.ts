"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register ScrollTrigger plugin
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * Initialize GSAP scroll reveal animations on elements with data-reveal attributes
 * Usage: Add data-reveal="fade" or data-reveal="slideUp" etc. to any element
 */
export function initScrollReveal() {
  if (typeof window === "undefined") return;

  // Animation configurations
  const animations: Record<string, { from: gsap.TweenVars; to: gsap.TweenVars }> = {
    fade: {
      from: { opacity: 0 },
      to: { opacity: 1 },
    },
    slideUp: {
      from: { opacity: 0, y: 60 },
      to: { opacity: 1, y: 0 },
    },
    slideDown: {
      from: { opacity: 0, y: -60 },
      to: { opacity: 1, y: 0 },
    },
    slideLeft: {
      from: { opacity: 0, x: 60 },
      to: { opacity: 1, x: 0 },
    },
    slideRight: {
      from: { opacity: 0, x: -60 },
      to: { opacity: 1, x: 0 },
    },
    scale: {
      from: { opacity: 0, scale: 0.85 },
      to: { opacity: 1, scale: 1 },
    },
    scaleUp: {
      from: { opacity: 0, scale: 1.15 },
      to: { opacity: 1, scale: 1 },
    },
    blur: {
      from: { opacity: 0, filter: "blur(10px)" },
      to: { opacity: 1, filter: "blur(0px)" },
    },
    rotateIn: {
      from: { opacity: 0, rotation: -10, scale: 0.9 },
      to: { opacity: 1, rotation: 0, scale: 1 },
    },
    flipX: {
      from: { opacity: 0, rotationX: -90 },
      to: { opacity: 1, rotationX: 0 },
    },
    flipY: {
      from: { opacity: 0, rotationY: -90 },
      to: { opacity: 1, rotationY: 0 },
    },
  };

  // Find all elements with data-reveal attribute
  const revealElements = document.querySelectorAll("[data-reveal]");

  revealElements.forEach((element) => {
    const animationType = element.getAttribute("data-reveal") || "fade";
    const delay = parseFloat(element.getAttribute("data-delay") || "0");
    const duration = parseFloat(element.getAttribute("data-duration") || "0.8");
    const triggerStart = element.getAttribute("data-trigger") || "top 85%";
    const stagger = parseFloat(element.getAttribute("data-stagger") || "0");

    const animation = animations[animationType] || animations.fade;

    // Check if element has children for stagger effect
    const hasStagger = stagger > 0 && element.children.length > 0;
    const targets = hasStagger
      ? gsap.utils.toArray(element.children)
      : element;

    // Set initial state
    gsap.set(targets, animation.from);

    // Create scroll-triggered animation
    gsap.to(targets, {
      ...animation.to,
      duration,
      delay,
      stagger: hasStagger ? stagger : 0,
      ease: "power3.out",
      scrollTrigger: {
        trigger: element,
        start: triggerStart,
        toggleActions: "play reverse play reverse",
      },
    });
  });
}

/**
 * Class-based approach for easier usage
 * Usage: <div className="reveal-fade">Content</div>
 */
export function initScrollRevealClasses() {
  if (typeof window === "undefined") return;

  const classAnimations: Record<string, { animation: string; config?: Partial<gsap.TweenVars> }> = {
    "reveal-fade": { animation: "fade" },
    "reveal-slide-up": { animation: "slideUp" },
    "reveal-slide-down": { animation: "slideDown" },
    "reveal-slide-left": { animation: "slideLeft" },
    "reveal-slide-right": { animation: "slideRight" },
    "reveal-scale": { animation: "scale" },
    "reveal-scale-up": { animation: "scaleUp" },
    "reveal-blur": { animation: "blur" },
    "reveal-rotate": { animation: "rotateIn" },
    "reveal-flip-x": { animation: "flipX" },
    "reveal-flip-y": { animation: "flipY" },
  };

  Object.keys(classAnimations).forEach((className) => {
    const elements = document.querySelectorAll(`.${className}`);
    const { animation } = classAnimations[className];

    elements.forEach((element) => {
      const delay = parseFloat(element.getAttribute("data-delay") || "0");
      const duration = parseFloat(element.getAttribute("data-duration") || "0.8");
      const triggerStart = element.getAttribute("data-trigger") || "top 85%";

      const animations: Record<string, { from: gsap.TweenVars; to: gsap.TweenVars }> = {
        fade: {
          from: { opacity: 0 },
          to: { opacity: 1 },
        },
        slideUp: {
          from: { opacity: 0, y: 60 },
          to: { opacity: 1, y: 0 },
        },
        slideDown: {
          from: { opacity: 0, y: -60 },
          to: { opacity: 1, y: 0 },
        },
        slideLeft: {
          from: { opacity: 0, x: 60 },
          to: { opacity: 1, x: 0 },
        },
        slideRight: {
          from: { opacity: 0, x: -60 },
          to: { opacity: 1, x: 0 },
        },
        scale: {
          from: { opacity: 0, scale: 0.85 },
          to: { opacity: 1, scale: 1 },
        },
        scaleUp: {
          from: { opacity: 0, scale: 1.15 },
          to: { opacity: 1, scale: 1 },
        },
        blur: {
          from: { opacity: 0, filter: "blur(10px)" },
          to: { opacity: 1, filter: "blur(0px)" },
        },
        rotateIn: {
          from: { opacity: 0, rotation: -10, scale: 0.9 },
          to: { opacity: 1, rotation: 0, scale: 1 },
        },
        flipX: {
          from: { opacity: 0, rotationX: -90 },
          to: { opacity: 1, rotationX: 0 },
        },
        flipY: {
          from: { opacity: 0, rotationY: -90 },
          to: { opacity: 1, rotationY: 0 },
        },
      };

      const anim = animations[animation] || animations.fade;

      gsap.set(element, anim.from);

      gsap.to(element, {
        ...anim.to,
        duration,
        delay,
        ease: "power3.out",
        scrollTrigger: {
          trigger: element,
          start: triggerStart,
          toggleActions: "play reverse play reverse",
        },
      });
    });
  });
}

/**
 * Initialize all scroll reveal animations
 * Call this in your root layout or page component
 */
export function initAllScrollReveals() {
  if (typeof window === "undefined") return;

  // Wait for DOM to be ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
      initScrollReveal();
      initScrollRevealClasses();
    });
  } else {
    initScrollReveal();
    initScrollRevealClasses();
  }
}

/**
 * Cleanup function to remove all ScrollTrigger instances
 */
export function cleanupScrollReveals() {
  if (typeof window !== "undefined") {
    ScrollTrigger.getAll().forEach((st) => st.kill());
  }
}
