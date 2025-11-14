import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollRevealInit from "@/components/ScrollRevealInit";

export const metadata: Metadata = {
    title: "D’ LAVÉN - Home",
};

export default function MainLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    // (main) layout: renders page chrome (Navbar + Footer) only for routes in this group
    return (
        <div className="flex min-h-screen flex-col">
            <ScrollRevealInit />
            <Navbar />
            <main className="flex-1 mt-12 sm:mt-20">
                {children}
            </main>
            <Footer />
        </div>
    );
}
