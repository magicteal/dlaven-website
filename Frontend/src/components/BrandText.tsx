import Image from "next/image";

export default function BrandText({ className = "" }: { className?: string }) {
  return (
    <Image
      src="/logos/logoText.svg"
      alt="D’ LAVÉN"
      width={360}
      height={86}
      priority
      className={className}
    />
  );
}
