import type { Metadata } from "next";
import SubCategoryExploreView from "@/components/SubCategoryExploreView";

interface Props {
  params: Promise<{ slug: string[] }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolved = await params;
  const parts = resolved.slug.map((s) => s.toUpperCase()).join(" — ");
  return {
    title: `DL BÉRRY | ${parts} | D' LAVÉN`,
    description: `Explore DL BÉRRY ${parts} creations, contemporary adornments, and haute parfumerie.`,
  };
}

function parseSlugParams(slugs: string[]) {
  let collection: "heritage" | "international" | "all" = "heritage";
  let category: "jewellery" | "clothes" | "fragrances" | "all" = "jewellery";

  for (const part of slugs) {
    const s = part.toLowerCase();
    if (s === "heritage" || s === "international") {
      collection = s;
    } else if (s === "clothes" || s === "ready-to-wear" || s === "clothing") {
      category = "clothes";
    } else if (s === "jewellery" || s === "adornments" || s === "jewelry") {
      category = "jewellery";
    } else if (s === "fragrance" || s === "fragrances" || s === "parfum") {
      category = "fragrances";
    }
  }

  return { collection, category };
}

export default async function DlBarrySubRoutePage({ params }: Props) {
  const resolved = await params;
  const { collection, category } = parseSlugParams(resolved.slug || []);

  return (
    <SubCategoryExploreView
      pillarName="DL BÉRRY"
      pillarSlug="dl-barry"
      collection={collection}
      category={category}
    />
  );
}
