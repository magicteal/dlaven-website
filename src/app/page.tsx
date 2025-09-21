import Hero from "@/components/Hero";
import CategoryGrid from "@/components/CategoryGrid";
// import FeaturedContent from "@/components/FeaturedContent";

export default function Home() {
  return (
    // The Footer component is removed from here
    <>
      <Hero />
      <CategoryGrid />
      {/* <FeaturedContent /> */}
    </>
  );
}
