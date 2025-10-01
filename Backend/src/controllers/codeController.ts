import type { Request, Response } from "express";
import { Code } from "../models/Code";

// Helper: generate zero-padded numeric string of given length
function randomNumericString(length: number): string {
  // Generate a random integer in [0, 10^length - 1] and pad with leading zeros
  const max = Math.pow(10, length);
  const n = Math.floor(Math.random() * max);
  return n.toString().padStart(length, "0");
}

export async function generateCodes(req: Request, res: Response) {
  try {
    const { count } = (req.body || {}) as { count?: number };
    const L = 6; // fixed digit length
    const C = typeof count === "number" && Number.isInteger(count) ? count : 0;

    if (C <= 0)
      return res
        .status(400)
        .json({ error: "'count' must be a positive integer" });

    // Capacity check for this length
    const maxForLength = Math.pow(10, L);
    const existingOfLen = await Code.countDocuments({
      code: { $regex: new RegExp(`^\\d{${L}}$`) },
    }).exec();
    const available = Math.max(0, maxForLength - existingOfLen);
    if (C > available) {
      return res.status(400).json({
        error: `Not enough unique codes available. Available for 6 digits: ${available}`,
      });
    }

    // Generate unique codes not colliding with DB
    const generated = new Set<string>();
    const target = C;
    const BATCH_LIMIT = Math.min(10000, target * 10); // guard excessive looping
    let attempts = 0;
    while (generated.size < target) {
      const candidate = randomNumericString(L);
      generated.add(candidate);
      attempts++;
      if (attempts > BATCH_LIMIT) break;
    }

    // Remove those already existing in DB, then top-up if needed
    const initial = Array.from(generated);
    if (initial.length) {
      const existing = await Code.find({ code: { $in: initial } })
        .select("code")
        .lean()
        .exec();
      const existingSet = new Set(existing.map((d: any) => d.code as string));
      for (const c of initial) if (existingSet.has(c)) generated.delete(c);
    }

    // Top-up loop to reach count while avoiding DB collisions
    attempts = 0;
    while (generated.size < target && attempts < BATCH_LIMIT) {
      const candidate = randomNumericString(L);
      if (!generated.has(candidate)) {
        const exists = await Code.exists({ code: candidate }).lean().exec();
        if (!exists) generated.add(candidate);
      }
      attempts++;
    }

    if (generated.size < target) {
      return res.status(500).json({
        error: "Failed to generate enough unique codes. Try lowering count.",
      });
    }

    const docs = Array.from(generated).map((code) => ({ code }));
    await Code.insertMany(docs, { ordered: false });

    res.json({ items: Array.from(generated) });
  } catch (err) {
    console.error("[codes] generate error", err);
    res.status(500).json({ error: "Failed to generate codes" });
  }
}
