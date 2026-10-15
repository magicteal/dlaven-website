import type { Metadata } from "next";
import DlFantomeClient from "./DlFantomeClient";

export const metadata: Metadata = {
  title: "D' LAVÉN × DL FANTÔME",
  description:
    "DL FANTÔME — A rare, numbered collection of luxury clothing, accessories and jewelry.",
};

export default function DlFantomePage() {
  return <DlFantomeClient />;
}
