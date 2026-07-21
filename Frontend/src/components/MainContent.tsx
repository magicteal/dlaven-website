"use client";

import React from "react";

export default function MainContent({
  children,
}: {
  children: React.ReactNode;
}) {
  return <main className="flex-1 w-full">{children}</main>;
}
