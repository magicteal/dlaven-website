import type { Metadata } from "next";
import DlLimitedClient from "./DlLimitedClient";

export const metadata: Metadata = {
  title: "D' LAVÉN LIMITED | D' LAVÉN × DL LIMITED L'ÉDITION",
  description:
    "DL LIMITED L'ÉDITION — A rare, numbered collection of luxury clothing, accessories and jewelry.",
};

export default function DlavenLimitedPage() {
  return <DlLimitedClient />;
}
