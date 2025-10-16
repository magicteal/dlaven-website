"use client";

import { useEffect, useRef, useState } from "react";

export default function RevealOnScroll({
  children,
  rootMargin = "0px 0px -80px 0px",
}: {
  children: React.ReactNode;
  rootMargin?: string;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setVisible(true);
        });
      },
      { root: null, rootMargin, threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [rootMargin]);

  return (
    <div ref={ref} className={visible ? "is-visible" : "not-visible"}>
      {children}
    </div>
  );
}
