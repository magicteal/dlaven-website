import type { Metadata } from "next";
import DlPriveClient from "./DlPriveClient";

export const metadata: Metadata = {
  title: "D' LAVEN PRIVÉ | D' LAVEN × DL PRIVÉ L'ORDONNANCE",
  description:
    "DL PRIVÉ L'ACCÈS — A dedicated space encompassing clothing, accessories and jewelry. India meets L'inde rencontre L'autorité.",
};

export default function DlPrivePage() {
  return <DlPriveClient />;
}
