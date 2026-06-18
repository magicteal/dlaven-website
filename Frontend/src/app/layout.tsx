import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import { AuthProvider } from "@/components/providers/AuthProvider";
import { CartProvider } from "@/components/providers/CartProvider";
import { Toaster } from "@/components/ui/sonner";
import PageLoader from "@/components/PageLoader";

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-manrope",
  display: "swap",
});

const leGrand = localFont({
  src: "../../public/fonts/le-grand-capital.ttf",
  variable: "--font-le-grand",
  display: "swap",
});

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
      <body className={`${manrope.variable} ${leGrand.variable} font-sans antialiased`} suppressHydrationWarning>
        <AuthProvider>
          <CartProvider>
            <PageLoader />
            {children}
            <Toaster />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
