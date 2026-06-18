import Container from "@/components/Container";
import Link from "next/link";


export default function UniqueDesign() {
  return (
    <section className="py-20 sm:py-28 text-center" style={{ backgroundColor: "#F6F4E6" }}>
      <Container>
        <h2
          className="font-le-grand text-3xl sm:text-5xl md:text-6xl font-normal tracking-widest uppercase"
          style={{ color: "#431717" }}
        >
          Your Unique DL Design
        </h2>

        <p
          className="mt-6 max-w-3xl mx-auto text-sm"
          style={{ color: "#431717", opacity: 0.7 }}
        >
          To personalize your DL pieces, connect directly with our concierge.
          Our team will assist you in creating your unique DL design.
        </p>

        <Link
          href="/contact"
          className="mt-8 inline-block px-8 py-3 text-xs uppercase tracking-wider transition-colors duration-300 border border-[#431717] text-[#431717] hover:bg-[#431717] hover:text-[#F6F4E6]"
        >
          Message a Concierge
        </Link>
      </Container>
    </section>
  );
}
