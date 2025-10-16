import Container from "@/components/Container";
import Link from "next/link";

export default function UniqueDesign() {
  return (
    <section className="bg-white py-20 sm:py-28 text-center">
      <Container>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-widest uppercase">
          Your Unique DL Design
        </h2>
        <p className="mt-6 max-w-3xl mx-auto text-sm text-black/70">
          To personalize your DL pieces, connect directly with our concierge.
          Our team will assist you in creating your unique DL design.
        </p>
        <Link
          href="/contact"
          className="mt-8 inline-block px-8 py-3 border border-black text-xs uppercase tracking-wider hover:bg-black hover:text-white"
        >
          Message a Concierge
        </Link>
      </Container>
    </section>
  );
}
