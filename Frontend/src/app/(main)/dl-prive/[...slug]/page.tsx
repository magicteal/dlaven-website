import type { Metadata } from "next";
import SubCategoryExploreView from "@/components/SubCategoryExploreView";
import GenderCategoryView from "@/components/GenderCategoryView";
import CollectionProductsView from "@/components/CollectionProductsView";

interface Props {
  params: Promise<{ slug: string[] }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolved = await params;
  const parts = resolved.slug.map((s) => s.toUpperCase()).join(" — ");
  return {
    title: `DL PRIVÉ | ${parts} | D' LAVÉN`,
    description: `Explore DL PRIVÉ ${parts} exclusive collections, fine jewellery, and bespoke creations.`,
  };
}

function parseSlugParams(slugs: string[]) {
  let collection: "heritage" | "international" | null = null;
  let category: "jewellery" | "clothes" | "fragrances" | "all" = "clothes";
  let gender: "mens" | "womens" | null = null;

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
    } else if (s === "mens" || s === "men") {
      gender = "mens";
    } else if (s === "womens" || s === "women") {
      gender = "womens";
    }
  }

  return { collection, category, gender };
}

export default async function DlPriveSubRoutePage({ params }: Props) {
  const resolved = await params;
  const { collection, category, gender } = parseSlugParams(resolved.slug || []);

  if (collection && gender) {
    return (
      <CollectionProductsView
        pillarName="DL PRIVÉ"
        pillarSlug="dl-prive"
        collection={collection}
        category={category}
        gender={gender}
      />
    );
  }

  if (gender) {
    return (
      <GenderCategoryView
        pillarName="DL PRIVÉ"
        pillarSlug="dl-prive"
        collection={collection || "all"}
        category={category}
        gender={gender}
      />
    );
  }

  return (
    <SubCategoryExploreView
      pillarName="DL PRIVÉ"
      pillarSlug="dl-prive"
      collection={collection || "all"}
      category={category}
    />
  );
}
