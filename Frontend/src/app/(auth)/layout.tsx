"use client";

import SimpleNavbar from "@/components/SimpleNavbar";
import Footer from "@/components/Footer";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-screen flex-col">
      <SimpleNavbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
