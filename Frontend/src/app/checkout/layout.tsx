"use client";

import SimpleNavbar from "@/components/SimpleNavbar";
import Footer from "@/components/Footer";
import MainContent from "@/components/MainContent";

export default function CheckoutLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <SimpleNavbar />
      <MainContent>{children}</MainContent>
      <Footer />
    </div>
  );
}
