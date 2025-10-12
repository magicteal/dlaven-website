/**
 * Simple import script to insert codes from Backend/data/codes-batch-1.json
 * - Skips codes that already exist
 * - Adds a `batch` number (1) and timestamps
 * - Usage (PowerShell):
 *   $env:MONGODB_URI = "mongodb://127.0.0.1:27017/dlaven"; node Backend/scripts/import_codes.js
 */

const fs = require("fs");
const path = require("path");
const { MongoClient } = require("mongodb");

const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/dlaven";
const DB_NAME = (() => {
  try {
    const url = new URL(MONGODB_URI);
    return url.pathname.replace(/^\//, "") || "dlaven";
  } catch (err) {
    return "dlaven";
  }
})();

const dataPath = path.join(__dirname, "..", "data", "codes-batch-1.json");
const BATCH_NUMBER = 1;

async function main() {
  const raw = fs.readFileSync(dataPath, "utf8");
  const codes = JSON.parse(raw)
    .map((s) => String(s).trim())
    .filter(Boolean);
  if (codes.length === 0) {
    console.error("No codes found in JSON");
    process.exit(1);
  }

  const client = new MongoClient(MONGODB_URI, { useUnifiedTopology: true });
  await client.connect();
  console.log("Connected to", MONGODB_URI);
  const db = client.db(DB_NAME);
  const collection = db.collection("codes");

  // Normalize codes and build docs
  const uniqueCodes = Array.from(new Set(codes.map((c) => c.toUpperCase())));
  console.log(
    `Found ${codes.length} codes, ${uniqueCodes.length} unique after dedupe`
  );

  // Check which codes already exist
  const existingCursor = await collection.find(
    { code: { $in: uniqueCodes } },
    { projection: { code: 1 } }
  );
  const existing = await existingCursor.toArray();
  const existingSet = new Set(existing.map((d) => d.code));

  const toInsert = uniqueCodes
    .filter((c) => !existingSet.has(c))
    .map((c) => ({
      code: c,
      batch: BATCH_NUMBER,
      isDeleted: false,
      usedBy: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    }));

  console.log(
    `${existingSet.size} codes already exist, ${toInsert.length} new codes to insert`
  );

  if (toInsert.length > 0) {
    const res = await collection.insertMany(toInsert, { ordered: false });
    console.log(
      `Inserted ${res.insertedCount} codes into collection 'codes' (batch ${BATCH_NUMBER})`
    );
  } else {
    console.log("No new codes to insert");
  }

  await client.close();
  console.log("Done");
}

main().catch((err) => {
  console.error("Import failed:", err);
  process.exit(1);
});
