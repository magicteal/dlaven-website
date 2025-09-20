import Hero from "@/components/Hero";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main>
      {/* Navbar is rendered in layout.tsx */}
      <Hero />
      <Footer />
    </main>
  );
}
