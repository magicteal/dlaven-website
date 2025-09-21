import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer"; // Import the Footer

export const metadata: Metadata = {
  title: "D’ LAVÉN",
  description: "Heritage meets modern luxury.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      {/* This new body structure creates the sticky footer layout.
        - flex & flex-col stack the navbar, main content, and footer vertically.
        - min-h-screen ensures the layout takes up at least the full screen height.
      */}
      <body className="font-sans antialiased flex flex-col min-h-screen">
        <Navbar />
        {/* - flex-1 allows this main section to grow and push the footer down.
          - pt-20 adds top padding (80px) to prevent content from being hidden by the fixed navbar.
        */}
        <main className="flex-1 pt-20">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
