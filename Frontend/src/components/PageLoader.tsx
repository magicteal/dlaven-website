"use client";

import React from "react";
import { usePathname } from "next/navigation";
import Loader from "@/components/Loader";

export default function PageLoader() {
  const pathname = usePathname();
  const [show, setShow] = React.useState(false);
  const firstRender = React.useRef(true);

  React.useEffect(() => {
    // Don't show loader on admin pages
    if (pathname?.startsWith("/admin")) {
      setShow(false);
      return;
    }
    // Skip the initial page render — show loader on subsequent client-side navigations
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }

    setShow(true);
  }, [pathname]);

  const handleComplete = () => {
    sessionStorage.setItem("hasShownLoader", "true");
    setShow(false);
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[9999]">
      <Loader onComplete={handleComplete} />
    </div>
  );
}
