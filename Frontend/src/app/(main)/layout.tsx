"use client";

import AnimatedNavbar from "@/components/AnimatedNavbar";
import SimpleNavbar from "@/components/SimpleNavbar";
import Footer from "@/components/Footer";
import ScrollRevealInit from "@/components/ScrollRevealInit";
import MainContent from "@/components/MainContent";
import { usePathname } from "next/navigation";

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const isHomePage = pathname === "/";

  // Use AnimatedNavbar only on home page, SimpleNavbar for all other pages
  return (
    <div className="flex min-h-screen flex-col">
      <ScrollRevealInit />
      {isHomePage ? <AnimatedNavbar /> : <SimpleNavbar />}
      <MainContent>{children}</MainContent>
      <Footer />
    </div>
  );
}
