import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import { pdfQueue } from "../queue";
import { prisma } from "../../database/prisma";

pdfQueue.process(async (job) => {
  const { type, data, userId } = job.data;

  try {
    if (type === "resume") {
      // Generate resume PDF
      const pdfDoc = await PDFDocument.create();
      const page = pdfDoc.addPage();
      const { width, height } = page.getSize();
      const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

      page.drawText("Resume", {
        x: 50,
        y: height - 50,
        size: 30,
        font,
        color: rgb(0, 0, 0),
      });

      const pdfBytes = await pdfDoc.save();
      console.log("[PDF Worker] Resume PDF generated for user:", userId);

      return { success: true, size: pdfBytes.length };
    }

    return { success: true };
  } catch (error) {
    console.error("[PDF Worker] Failed:", error);
    throw error;
  }
});

console.log("[PDF Worker] Started");
