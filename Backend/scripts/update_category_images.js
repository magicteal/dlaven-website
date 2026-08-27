const { MongoClient } = require("mongodb");

const uri = process.env.MONGODB_URI_LOCAL || process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/dlavenDB";

const CATEGORY_UPDATES = [
  {
    slug: "prive",
    name: "DL PRIVE",
    imageSrc: "/images/dlprive_1.jpg",
    imageAlt: "DL Privé Haute Couture & High Jewelry",
    heroImage: "/images/dlprive_1.jpg",
    badge: "Privé Edition",
    description: "Exclusive DL PRIVE collection — limited and curated haute couture & high jewelry.",
  },
  {
    slug: "dl-prive",
    name: "DL PRIVE",
    imageSrc: "/images/dlprive_1.jpg",
    imageAlt: "DL Privé Haute Couture & High Jewelry",
    heroImage: "/images/dlprive_1.jpg",
    badge: "Privé Edition",
    description: "Exclusive DL PRIVE collection — limited and curated haute couture & high jewelry.",
  },
  {
    slug: "fragrances",
    name: "Fragrances",
    imageSrc: "/images/frangrence.png",
    imageAlt: "D' LAVÉN Artisanal Fragrance & Haute Parfumerie",
    heroImage: "/images/frangrence.png",
    badge: "Essence",
    description: "Signature scents that define presence, crafted with rare and evocative notes.",
  },
  {
    slug: "heritage-jewelry",
    name: "Heritage Jewelry",
    imageSrc: "/images/heritage.png",
    imageAlt: "D' LAVÉN Heritage Jewelry Collection",
    heroImage: "/images/heritage.png",
    badge: "Heritage",
    description: "Explore timeless craftsmanship and iconic designs from our heritage jewelry line.",
  },
  {
    slug: "mens-ready-to-wear",
    name: "Mens Ready To Wear",
    imageSrc: "/images/mensReady.png",
    imageAlt: "D' LAVÉN Mens Ready To Wear & Tailoring",
    heroImage: "/images/mensReady.png",
    badge: "Menswear",
    description: "Modern silhouettes and refined tailoring for the contemporary wardrobe.",
  },
];

async function updateDb(mongoUri) {
  const client = new MongoClient(mongoUri);
  try {
    await client.connect();
    console.log("Connected to", mongoUri);
    const db = client.db();
    const coll = db.collection("categories");

    for (const cat of CATEGORY_UPDATES) {
      const res = await coll.updateOne(
        { slug: cat.slug },
        {
          $set: {
            name: cat.name,
            imageSrc: cat.imageSrc,
            imageAlt: cat.imageAlt,
            heroImage: cat.heroImage,
            badge: cat.badge,
            description: cat.description,
            updatedAt: new Date(),
          },
        },
        { upsert: false }
      );
      console.log(`Updated '${cat.slug}': matched ${res.matchedCount}, modified ${res.modifiedCount}`);
    }

    const all = await coll.find().toArray();
    console.log("Current categories in DB:", all.map(c => ({ slug: c.slug, name: c.name, imageSrc: c.imageSrc })));
  } finally {
    await client.close();
  }
}

async function main() {
  await updateDb(uri);
}

main().catch(console.error);
