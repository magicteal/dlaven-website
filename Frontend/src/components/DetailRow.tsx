import React from "react";

export default function DetailRow({
  label,
  value,
  muted,
  bold,
}: {
  label: string;
  value: string;
  muted?: boolean;
  bold?: boolean;
}) {
  return (
    <div className={`flex justify-between ${bold ? "font-semibold" : ""}`}>
      <span className={muted ? "text-black/50" : ""}>{label}</span>
      <span>{value}</span>
    </div>
  );
}
