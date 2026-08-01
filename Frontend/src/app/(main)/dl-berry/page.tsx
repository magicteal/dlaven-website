import type { Metadata } from "next";
import DlBarryClient from "../dl-barry/DlBarryClient";

export const metadata: Metadata = {
  title: "D' LAVÉN BÉRRY | D' LAVÉN × DL BÉRRY CREATIONS",
  description:
    "DL BÉRRY CREATIONS — Bold, contemporary luxury creations encompassing clothing, accessories and jewelry.",
};

export default function DlBerryPage() {
  return <DlBarryClient />;
}
