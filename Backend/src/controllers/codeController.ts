import type { Request, Response } from "express";
import { Code, ICode } from "../models/Code";
import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";

// Extend Request when we expect auth info on req.user
interface AuthRequest extends Request {
  user?: { sub?: string } | null;
}

// Helper to generate a random alphabet character
function randomAlphabet(): string {
  const alphabets = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  return alphabets[Math.floor(Math.random() * alphabets.length)];
}

export async function generateCodes(req: Request, res: Response) {
  try {
  const { count } = (req.body || {}) as { count?: number };
    const C = typeof count === "number" && Number.isInteger(count) ? count : 0;

    if (C <= 0)
      return res
        .status(400)
        .json({ error: "'count' must be a positive integer" });

    const year = new Date().getFullYear().toString().slice(-2);
    // Always use the DL Prive prefix and collection
    const prefix = `DLPV${year}`;

    // Find the last code generated for the current year
    const lastCodeInYear = await Code.findOne({ code: { $regex: `^${prefix}` } })
      .sort({ code: -1 })
      .lean()
      .exec() as ICode | null;

    let lastNumber = 0;
    if (lastCodeInYear && lastCodeInYear.code) {
        // Regex to extract the number between the year and the final letter
        const match = lastCodeInYear.code.match(/^DLPV\d{2}(\d+)[A-Z]$/);
        if (match && match[1]) {
            lastNumber = parseInt(match[1], 10);
        }
    }

    // Find the latest batch number
    const latestBatchDoc = await Code.findOne().sort({ batch: -1 }).lean().exec() as ICode | null;
    const newBatchNumber = latestBatchDoc ? latestBatchDoc.batch + 1 : 1;
    
    const generatedCodes: string[] = [];
    
    for (let i = 1; i <= C; i++) {
      // THE FIX: Changed padding from 5 to 3
      const newNumber = (lastNumber + i).toString().padStart(3, "0"); 
      const alphabet = randomAlphabet();
      const newCode = `${prefix}${newNumber}${alphabet}`;
      generatedCodes.push(newCode);
    }
    
    const existingCodes = await Code.find({ code: { $in: generatedCodes } }).lean().exec();
    if (existingCodes.length > 0) {
        return res.status(500).json({ error: "Duplicate code generation attempt failed. Please try again." });
    }

    const docs = generatedCodes.map((code) => ({
      code,
      batch: newBatchNumber,
      isDeleted: false,
    }));
    await Code.insertMany(docs, { ordered: false });

    res.json({ items: generatedCodes, batch: newBatchNumber });
  } catch (err) {
    console.error("[codes] generate error", err);
    res.status(500).json({ error: "Failed to generate codes" });
  }
}

export async function importCodes(req: Request, res: Response) {
  try {
    // Accept body { codes: string[] } OR, if missing, read the repo JSON file for batch 1
    let { codes } = (req.body || {}) as { codes?: string[] };

    if (!Array.isArray(codes) || codes.length === 0) {
      // Try loading Backend/data/codes-batch-1.json from disk
      const filePath = path.join(__dirname, '..', '..', 'data', 'codes-batch-1.json');
      if (!fs.existsSync(filePath)) {
        return res.status(400).json({ error: "'codes' must be provided in body or Backend/data/codes-batch-1.json must exist" });
      }
      const raw = fs.readFileSync(filePath, 'utf8');
      try {
        const parsed = JSON.parse(raw);
        if (!Array.isArray(parsed)) {
          return res.status(400).json({ error: 'codes JSON must be an array of strings' });
        }
        codes = parsed;
      } catch (err) {
        return res.status(400).json({ error: 'Failed to parse codes JSON file' });
      }
    }

    // Normalize codes: uppercase and trim
    const normalized = codes
      .map((c) => (typeof c === 'string' ? c.trim().toUpperCase() : ''))
      .filter(Boolean);

    if (normalized.length === 0) {
      return res.status(400).json({ error: 'No valid codes provided' });
    }

    // Ensure no duplicates in payload
    const unique = Array.from(new Set(normalized));

    // Check which codes already exist in DB
    const existing = await Code.find({ code: { $in: unique } }).lean().exec();
    const existingSet = new Set(existing.map((d) => d.code));

    // Batch number for these imported codes is explicitly 1
    const importBatchNumber = 1;

    // Prepare docs for insertion for those that do not exist
    const toInsert = unique.filter((c) => !existingSet.has(c)).map((code) => ({
      code,
      batch: importBatchNumber,
      isDeleted: false,
    }));

    let insertedCount = 0;
    if (toInsert.length > 0) {
      const result = await Code.insertMany(toInsert, { ordered: false });
      // Mongoose insertMany may return an array of docs or an object with insertedCount depending on driver/version
      if (Array.isArray(result)) {
        insertedCount = result.length;
      } else if ((result as any).insertedCount != null) {
        insertedCount = (result as any).insertedCount;
      } else {
        insertedCount = toInsert.length;
      }
    }

    const skipped = unique.filter((c) => existingSet.has(c));

    res.json({ inserted: insertedCount, skipped, batch: importBatchNumber });
  } catch (err) {
    console.error('[codes] import error', err);
    res.status(500).json({ error: 'Failed to import codes' });
  }
}

export async function verifyLimitedCode(req: Request, res: Response) {
    try {
        const { code } = req.body as { code?: string };
        if (!code) {
            return res.status(400).json({ error: "Code is required" });
        }
    const codeDoc = await Code.findOne({
      code: code,
      usedBy: null, // Check if it's not used
      isDeleted: { $ne: true }
    }).lean();

        if (!codeDoc) {
            return res.status(404).json({ error: "Invalid or already used code.", ok: false });
        }

        // We don't mark it as used here. That might happen upon purchase.
        // For now, just verifying it exists and is available is enough to grant access.
        return res.json({ ok: true });
    } catch (err) {
        console.error("[codes] verify limited code error", err);
        res.status(500).json({ error: "Failed to verify code" });
    }
}

export async function verifyPriveCode(req: Request, res: Response) {
    try {
        const { code } = req.body as { code?: string };
        if (!code) {
            return res.status(400).json({ error: "Code is required" });
        }
    const codeDoc = await Code.findOne({
      code: code,
      usedBy: null, // Check if it's not used yet
      isDeleted: { $ne: true }
    }).lean();

        if (!codeDoc) {
            return res.status(404).json({ error: "Invalid or already used code.", ok: false });
        }

            // Mark the code as used by this user if they're logged in
            const authReq = req as AuthRequest;
            if (authReq.user?.sub) {
              await Code.updateOne(
                { _id: (codeDoc as any)._id },
                { $set: { usedBy: authReq.user.sub } }
              );
            }
        

        return res.json({ ok: true });
    } catch (err) {
        console.error("[codes] verify prive code error", err);
        res.status(500).json({ error: "Failed to verify code" });
    }
}


export async function getBatchHistory(req: Request, res: Response) {
  try {
    const history = await Code.aggregate([
      {
        $match: { isDeleted: { $ne: true } }
      },
      {
        $group: {
          _id: '$batch',
          count: { $sum: 1 },
          createdAt: { $first: '$createdAt' }
        }
      },
      { $sort: { _id: -1 } },
      {
        $project: {
          _id: 0,
          batch: '$_id',
          count: 1,
          createdAt: 1
        }
      }
    ]);
    res.json({ items: history });
  } catch (err) {
    console.error("[codes] history error", err);
    res.status(500).json({ error: "Failed to fetch batch history" });
  }
}

export async function deleteBatch(req: Request, res: Response) {
  try {
    const { batch } = req.params;
    const batchNum = parseInt(batch, 10);
    if (isNaN(batchNum)) {
      return res.status(400).json({ error: "Invalid batch number" });
    }

    const result = await Code.updateMany(
        { batch: batchNum },
        { $set: { isDeleted: true } }
    );

    if (result.matchedCount === 0) {
        return res.status(404).json({ error: "Batch not found." });
    }

    res.json({ ok: true, modifiedCount: result.modifiedCount });
  } catch (err) {
    console.error("[codes] delete batch error", err);
    res.status(500).json({ error: "Failed to delete batch" });
  }
}

export async function downloadCodeBatch(req: Request, res: Response) {
  try {
    const { batch } = req.params;
    const batchNum = parseInt(batch, 10);
    if (isNaN(batchNum)) {
      return res.status(400).json({ error: "Invalid batch number" });
    }

    const codes = await Code.find({ batch: batchNum, isDeleted: { $ne: true } }).lean().exec();
    if (!codes.length) {
      return res.status(404).json({ error: "Batch not found or has been deleted" });
    }

    const doc = new PDFDocument({ margin: 50, bufferPages: true });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=dlaven-codes-batch-${batchNum}.pdf`
    );
    doc.pipe(res);
    
    doc.fontSize(20).font('Helvetica-Bold').text("D'LAVÉN", 50, 57, { align: 'left' });
    doc.fontSize(10).font('Helvetica').text("Unique Code Report", 50, 80, { align: 'left' });

    doc.fontSize(10).font('Helvetica-Bold').text(`Batch Number: ${batchNum}`, 50, 57, { align: 'right' });
    doc.fontSize(10).font('Helvetica').text(`Date Generated: ${new Date(codes[0].createdAt).toLocaleDateString()}`, 50, 72, { align: 'right' });
    
    doc.moveDown(3);

    const tableTop = 150;
    const itemCodeX = 50;
    const serialNoX = 350;

    const generateHeader = () => {
      doc.font('Helvetica-Bold')
         .fontSize(10)
         .text("Code", itemCodeX, doc.y)
         .text("Serial No.", serialNoX, doc.y);
      doc.moveDown(0.5);
      doc.moveTo(itemCodeX, doc.y)
         .lineTo(serialNoX + 100, doc.y)
         .stroke();
      doc.moveDown(0.5);
    };
    
    doc.y = tableTop;
    generateHeader();
    
    doc.font('Helvetica').fontSize(9);
    
    const rowHeight = 15;
    
    for (let i = 0; i < codes.length; i++) {
        const item = codes[i];
        if (doc.y + rowHeight > doc.page.height - doc.page.margins.bottom) {
            doc.addPage();
            generateHeader();
        }
        doc.text(item.code, itemCodeX, doc.y);
        doc.text((i + 1).toString(), serialNoX, doc.y);
        doc.moveDown(0.7);
    }
    
    const pages = doc.bufferedPageRange();
    for (let i = 0; i < pages.count; i++) {
        doc.switchToPage(i);
        let oldBottomMargin = doc.page.margins.bottom;
        doc.page.margins.bottom = 0;
        doc.fontSize(8).text(
            `Page ${i + 1} of ${pages.count}`,
            50,
            doc.page.height - 30,
            { align: 'center' }
        );
        doc.page.margins.bottom = oldBottomMargin;
    }

    doc.end();
  } catch (err) {
    console.error("[codes] pdf download error", err);
    res.status(500).json({ error: "Failed to generate PDF" });
  }
}
