"use client";

import AnimatedNavbar from "@/components/AnimatedNavbar";
import Footer from "@/components/Footer";
import MainContent from "@/components/MainContent";

export default function CartLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <AnimatedNavbar />
      <MainContent>{children}</MainContent>
      <Footer />
    </div>
  );
}
