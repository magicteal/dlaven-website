import type { Metadata } from "next";
import DlLimitedClient from "./DlLimitedClient";

export const metadata: Metadata = {
  title: "D' LAVÉN × DL FANTOME | DL FANTÔME CREATION",
  description:
    "DL FANTÔME — A rare, numbered collection of luxury clothing, accessories and jewelry.",
};

export default function DlavenLimitedPage() {
  return <DlLimitedClient />;
}
