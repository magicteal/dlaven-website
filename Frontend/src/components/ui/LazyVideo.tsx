"use client";

import { useEffect, useRef, useState } from "react";

type Source = { src: string; type?: string };

type LazyVideoProps = {
  className?: string;
  poster?: string;
  autoPlay?: boolean;
  loop?: boolean;
  muted?: boolean;
  playsInline?: boolean;
  controls?: boolean;
  preload?: "none" | "metadata" | "auto";
  src?: string; // fallback single source
  sources?: Source[]; // multiple sources
};

export default function LazyVideo({
  className,
  poster,
  autoPlay = true,
  loop = true,
  muted = true,
  playsInline = true,
  controls = false,
  preload = "none",
  src,
  sources,
}: LazyVideoProps) {
  const ref = useRef<HTMLVideoElement | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      { rootMargin: "200px" }
    );

    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!ref.current) return;
    if (inView && autoPlay) {
      const v = ref.current;
      // try play once sources are attached
      v.play().catch(() => {});
    }
  }, [inView, autoPlay]);

  return (
    <video
      ref={ref}
      className={className}
      poster={poster}
      muted={muted}
      loop={loop}
      playsInline={playsInline}
      controls={controls}
      preload={preload}
    >
      {inView ? (
        sources?.length ? (
          sources.map((s, i) => <source key={i} src={s.src} type={s.type} />)
        ) : src ? (
          <source src={src} />
        ) : null
      ) : null}
    </video>
  );
}
