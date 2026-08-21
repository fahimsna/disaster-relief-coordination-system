const PDFDocument = require("pdfkit");

/**
 * Generate a Volunteer Completion Certificate as PDF Buffer
 * @param {Object} data - Volunteer and mission data
 * @param {string} data.fullName - Volunteer's full name
 * @param {string} data.disasterZone - Name of the disaster zone/mission
 * @param {string} data.startDate - Mission start date
 * @param {string} data.endDate - Mission completion date
 * @param {string} data.serialNumber - Unique certificate serial number
 * @returns {Promise<Buffer>} - PDF file as buffer
 */
const generateCertificate = (data) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({
        size: "A4",
        layout: "landscape",
        margin: 50,
      });

      // Collect PDF data chunks
      const buffers = [];
      doc.on("data", buffers.push.bind(buffers));
      doc.on("end", () => {
        const pdfData = Buffer.concat(buffers);
        resolve(pdfData);
      });

      // =============================================
      // 1. OUTER BORDER
      // =============================================
      doc
        .rect(30, 30, doc.page.width - 60, doc.page.height - 60)
        .strokeColor("#1a3a5c") // Dark blue
        .lineWidth(4)
        .stroke();

      // =============================================
      // 2. INNER BORDER
      // =============================================
      doc
        .rect(45, 45, doc.page.width - 90, doc.page.height - 90)
        .strokeColor("#2d6a9f") // Lighter blue
        .lineWidth(1.5)
        .stroke();

      // =============================================
      // 3. ORGANIZATION HEADER
      // =============================================
      doc
        .fontSize(26)
        .fillColor("#1a3a5c")
        .text("DISASTER RESPONSE & RELIEF COORDINATION SYSTEM", {
          align: "center",
        })
        .fontSize(14)
        .fillColor("#666")
        .text("DRRCS", { align: "center" })
        .moveDown(0.5);

      // =============================================
      // 4. DECORATIVE LINE
      // =============================================
      doc
        .moveTo(150, doc.y)
        .lineTo(doc.page.width - 150, doc.y)
        .strokeColor("#2d6a9f")
        .lineWidth(2)
        .stroke();
      doc.moveDown(0.5);

      // =============================================
      // 5. TITLE
      // =============================================
      doc
        .fontSize(34)
        .fillColor("#1a3a5c")
        .text("CERTIFICATE OF APPRECIATION", {
          align: "center",
          underline: true,
        })
        .moveDown(0.5);

      // =============================================
      // 6. BODY TEXT
      // =============================================
      doc
        .fontSize(16)
        .fillColor("#333")
        .text(
          "This certificate is proudly presented to",
          { align: "center" }
        )
        .moveDown(0.5);

      // =============================================
      // 7. VOLUNTEER NAME (Large Display)
      // =============================================
      doc
        .fontSize(42)
        .fillColor("#1a3a5c")
        .text(data.fullName || "Volunteer", {
          align: "center",
          bold: true,
        })
        .moveDown(0.5);

      // =============================================
      // 8. MISSION DESCRIPTION
      // =============================================
      doc
        .fontSize(16)
        .fillColor("#333")
        .text(
          "for their outstanding dedication and service during",
          { align: "center" }
        )
        .moveDown(0.3);

      doc
        .fontSize(20)
        .fillColor("#2d6a9f")
        .text(data.disasterZone || "Disaster Relief Mission", {
          align: "center",
        })
        .moveDown(0.5);

      // =============================================
      // 9. DATES
      // =============================================
      doc
        .fontSize(14)
        .fillColor("#555")
        .text(
          `Mission Start: ${data.startDate || "N/A"}  |  Mission End: ${data.endDate || "N/A"}`,
          { align: "center" }
        )
        .moveDown(0.5);

      // =============================================
      // 10. SERIAL NUMBER
      // =============================================
      doc
        .fontSize(12)
        .fillColor("#999")
        .text(`Certificate No: ${data.serialNumber || "N/A"}`, {
          align: "center",
        })
        .moveDown(1.5);

      // =============================================
      // 11. SIGNATURE LINE
      // =============================================
      const signatureY = doc.y;
      doc
        .moveTo(200, signatureY)
        .lineTo(400, signatureY)
        .strokeColor("#333")
        .lineWidth(1)
        .stroke();

      doc
        .fontSize(12)
        .fillColor("#333")
        .text("Administrator Signature", 200, signatureY + 5, {
          width: 200,
          align: "center",
        });

      // =============================================
      // 12. FOOTER
      // =============================================
      doc
        .fontSize(10)
        .fillColor("#aaa")
        .text(
          "This certificate is automatically generated upon mission completion.",
          { align: "center" }
        );

      // =============================================
      // 13. BOTTOM DECORATIVE LINE
      // =============================================
      const footerY = doc.y + 20;
      doc
        .moveTo(150, footerY)
        .lineTo(doc.page.width - 150, footerY)
        .strokeColor("#2d6a9f")
        .lineWidth(1)
        .stroke();

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = { generateCertificate };