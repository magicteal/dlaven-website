import type { Request, Response } from "express";
import { Code, ICode } from "../models/Code";
import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";

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
    const prefix = `DLPV${year}`;

    // Find the last code generated for the current year to determine the starting number
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