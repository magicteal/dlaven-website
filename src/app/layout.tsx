import type { Metadata } from "next";
import "./globals.css";

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
        {children}
      </body>
    </html>
  );
}
