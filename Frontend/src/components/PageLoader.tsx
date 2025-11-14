"use client";

import React from "react";
import { usePathname } from "next/navigation";
import Loader from "@/components/Loader";

export default function PageLoader() {
  const pathname = usePathname();
  const [show, setShow] = React.useState(false);

  React.useEffect(() => {
    // Don't show loader on admin pages
    if (pathname?.startsWith("/admin")) {
      setShow(false);
      return;
    }

    // Check if loader has been shown in this session
    const hasShownLoader = sessionStorage.getItem("hasShownLoader");
    
    if (!hasShownLoader) {
      setShow(true);
    }
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
