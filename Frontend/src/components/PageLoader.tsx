"use client";

import React from "react";
import { usePathname } from "next/navigation";
import Loader from "@/components/Loader";

export default function PageLoader() {
  const pathname = usePathname();
  const [show, setShow] = React.useState(false);

  React.useEffect(() => {
    // Only show once per session and never on admin
    if (pathname?.startsWith("/admin")) return;
    const alreadyShown = sessionStorage.getItem("hasShownLoader") === "true";
    if (!alreadyShown) {
      setShow(true);
    }
    // run only on initial mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
