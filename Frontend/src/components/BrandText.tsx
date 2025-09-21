"use client";

import Image from "next/image";

export default function BrandText({ className = "" }: { className?: string }) {
  return (
    <Image
      src="/logos/logoText.png"
      alt="D’ LAVÉN"
      width={1200}
      height={240}
      priority
      className={className}
    />
  );
}
