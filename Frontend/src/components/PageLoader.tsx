"use client";

import React from "react";
import Loader from "@/components/Loader";

export default function PageLoader() {
  const [show, setShow] = React.useState(true);

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[9999]">
      <Loader onComplete={() => setShow(false)} />
    </div>
  );
}
