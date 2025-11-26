"use client";

import React from "react";
import { usePathname } from "next/navigation";

export default function MainContent({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isHome = pathname === "/";
  return <main className={isHome ? "flex-1" : "flex-1 mt-16"}>{children}</main>;
}
