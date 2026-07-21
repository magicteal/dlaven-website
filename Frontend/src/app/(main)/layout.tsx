"use client";

import AnimatedNavbar from "@/components/AnimatedNavbar";
import Footer from "@/components/Footer";
import ScrollRevealInit from "@/components/ScrollRevealInit";
import MainContent from "@/components/MainContent";

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-screen flex-col">
      <ScrollRevealInit />
      <AnimatedNavbar />
      <MainContent>{children}</MainContent>
      <Footer />
    </div>
  );
}
