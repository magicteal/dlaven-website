/**
 * Seed a single category into MongoDB if it does not already exist.
 * Usage (PowerShell):
 *   $env:MONGODB_URI="mongodb://127.0.0.1:27017/dlaven"; node Backend/scripts/seed_category.js
 */

const { MongoClient } = require("mongodb");

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/dlaven";

const CATEGORY = {
  slug: "dl-prive",
  name: "DL PRIVE",
  imageSrc: "/images/prive.jpg",
  imageAlt: "DL PRIVE collection image",
  heroImage: "/images/prive.jpg",
  badge: "Prive",
  description: "Exclusive DL PRIVE collection — limited and curated pieces.",
  createdAt: new Date(),
  updatedAt: new Date(),
};

async function main() {
  const client = new MongoClient(MONGODB_URI, { useUnifiedTopology: true });
  await client.connect();
  console.log("Connected to", MONGODB_URI);

  // Determine DB name from URI (best-effort)
  let dbName = "dlaven";
  try {
    const url = new URL(MONGODB_URI);
    dbName = url.pathname.replace(/^\//, "") || dbName;
  } catch (e) {
    // ignore
  }

  const db = client.db(dbName);
  const coll = db.collection("categories");

  const existing = await coll.findOne({ slug: CATEGORY.slug });
  if (existing) {
    console.log(`Category '${CATEGORY.slug}' already exists. No action taken.`);
  } else {
    const toInsert = Object.assign({}, CATEGORY);
    // remove createdAt/updatedAt if schema doesn't expect them (safe to keep)
    const res = await coll.insertOne(toInsert);
    if (res.insertedId) console.log(`Inserted category '${CATEGORY.slug}' with id ${res.insertedId}`);
    else console.log("Insert returned no id — check the DB and permissions.");
  }

  await client.close();
  console.log("Done");
}

main().catch((err) => {
  console.error("Seeding failed:", err);
  process.exit(1);
});
