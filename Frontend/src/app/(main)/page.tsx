import Hero from "@/components/Hero";
import CategoryGrid from "@/components/CategoryGrid";
import FeaturedContent from "@/components/FeaturedContent";
import WorldOfSection from "@/components/WorldOfSection";
import UniqueDesign from "@/components/UniqueDesign";
export const dynamic = "force-dynamic";

export default function Home() {
  return (
    <>
      <Hero />
      <CategoryGrid />
      <FeaturedContent />
      <WorldOfSection />
      <UniqueDesign />
    </>
  );
}
