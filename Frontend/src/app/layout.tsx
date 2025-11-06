import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/components/providers/AuthProvider";
import { CartProvider } from "@/components/providers/CartProvider";
import BarbaProvider from "@/components/BarbaProvider";
import { Toaster } from "@/components/ui/sonner";
import PageLoader from "@/components/PageLoader";

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
      <body className="font-sans antialiased">
        <AuthProvider>
          {/* Initial page load animation overlay */}
          <PageLoader />
          <BarbaProvider>
            <CartProvider>{children}</CartProvider>
          </BarbaProvider>
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
