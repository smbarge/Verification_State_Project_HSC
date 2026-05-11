import { queryDb } from "$lib/db/db";
import ExcelJS from "exceljs";

export async function GET() {
  try {
    const query = `
    SELECT
    ps.division_code,

    -- Verification (type 1)
    COUNT(*) FILTER (
        WHERE ra.recheck_type = 1
        AND rc.recheck_case_id LIKE '%H301%'
    ) AS verification_received,

    COUNT(*) FILTER (
        WHERE ra.recheck_type = 1
        AND rc.recheck_case_id LIKE '%H301%'
        AND ra.status = 'Complete'
    ) AS verification_completed,

    COUNT(*) FILTER (
        WHERE ra.recheck_type = 1
        AND rc.recheck_case_id LIKE '%H301%'
        AND COALESCE(ra.status,'') <> 'Complete'
    ) AS verification_pending,

    -- Photocopy (type 2)
    COUNT(*) FILTER (
        WHERE ra.recheck_type = 2
        AND rc.recheck_case_id LIKE '%H302%'
    ) AS photocopy_received,

    COUNT(*) FILTER (
        WHERE ra.recheck_type = 2
        AND rc.recheck_case_id LIKE '%H302%'
        AND ra.status = 'Complete'
    ) AS photocopy_completed,

    COUNT(*) FILTER (
        WHERE ra.recheck_type = 2
        AND rc.recheck_case_id LIKE '%H302%'
        AND COALESCE(ra.status,'') <> 'Complete'
    ) AS photocopy_pending,

    -- Revaluation (type 3)
    COUNT(*) FILTER (
        WHERE ra.recheck_type = 3
        AND rc.recheck_case_id LIKE '%H303%'
    ) AS revaluation_received,

    COUNT(*) FILTER (
        WHERE ra.recheck_type = 3
        AND rc.recheck_case_id LIKE '%H303%'
        AND ra.status = 'Complete'
    ) AS revaluation_completed,

    COUNT(*) FILTER (
        WHERE ra.recheck_type = 3
        AND rc.recheck_case_id LIKE '%H303%'
        AND COALESCE(ra.status,'') <> 'Complete'
    ) AS revaluation_pending

FROM (
    SELECT DISTINCT
        ps.recheck_case_id,
        ps.division_code
    FROM paper_status ps
    WHERE ps.division_code BETWEEN '1' AND '9'
) ps

JOIN recheck_case rc
    ON ps.recheck_case_id = rc.recheck_case_id

JOIN recheck_application ra
    ON rc.recheck_application_id = ra.recheck_application_id

GROUP BY ps.division_code
ORDER BY ps.division_code;
    `;

    const rows = await queryDb(query);

    const total = {
      verification_received: 0,
      verification_completed: 0,
      verification_pending: 0,
      photocopy_received: 0,
      photocopy_completed: 0,
      photocopy_pending: 0,
      revaluation_received: 0,
      revaluation_completed: 0,
      revaluation_pending: 0,
    };

    rows.forEach((r) => {
      total.verification_received += Number(r.verification_received);
      total.verification_completed += Number(r.verification_completed);
      total.verification_pending += Number(r.verification_pending);
      total.photocopy_received += Number(r.photocopy_received);
      total.photocopy_completed += Number(r.photocopy_completed);
      total.photocopy_pending += Number(r.photocopy_pending);
      total.revaluation_received += Number(r.revaluation_received);
      total.revaluation_completed += Number(r.revaluation_completed);
      total.revaluation_pending += Number(r.revaluation_pending);
    });

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("HSC Report");

    const today = new Date();
    const formattedDateTime = today.toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

    const colors = {
      darkBlue: "1F5A78",
      verification: "B9DDEE",
      photocopy: "D9EDC8",
      revaluation: "F6DDCF",
      totalLabel: "B7E1A1",
      white: "FFFFFF",
      black: "000000",
      border: "D9D9D9",
    };

    sheet.views = [{ state: "frozen", ySplit: 3 }];

    sheet.mergeCells("A1:K1");
    sheet.getCell("A1").value =
      `HSC-Verification/Photocopy/Revaluation status as on ${formattedDateTime}`;
    sheet.getCell("A1").font = {
      bold: true,
      size: 18,
      color: { argb: colors.black },
    };
    sheet.getCell("A1").alignment = {
      horizontal: "left",
      vertical: "middle",
    };
    sheet.getRow(1).height = 28;

    sheet.mergeCells("A2:A3");
    sheet.mergeCells("B2:B3");
    sheet.mergeCells("C2:E2");
    sheet.mergeCells("F2:H2");
    sheet.mergeCells("I2:K2");

    sheet.getCell("A2").value = "Division Code";
    sheet.getCell("B2").value = "Divisional Board";
    sheet.getCell("C2").value = "Verification";
    sheet.getCell("F2").value = "Photocopy";
    sheet.getCell("I2").value = "Revaluation";

    const subHeaders = [
      "Received",
      "Completed",
      "Pending",
      "Received",
      "Completed",
      "Pending",
      "Received",
      "Completed",
      "Pending",
    ];

    subHeaders.forEach((h, i) => {
      sheet.getCell(3, i + 3).value = h;
    });

    ["A2", "B2", "A3", "B3"].forEach((cell) => {
      sheet.getCell(cell).fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: colors.darkBlue },
      };
      sheet.getCell(cell).font = {
        bold: true,
        color: { argb: colors.white },
        size: 11,
      };
      sheet.getCell(cell).alignment = {
        horizontal: "center",
        vertical: "middle",
        wrapText: true,
      };
    });

    ["C2", "D2", "E2", "C3", "D3", "E3"].forEach((cell) => {
      sheet.getCell(cell).fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: colors.verification },
      };
      sheet.getCell(cell).font = { bold: true, color: { argb: colors.black } };
    });

    ["F2", "G2", "H2", "F3", "G3", "H3"].forEach((cell) => {
      sheet.getCell(cell).fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: colors.photocopy },
      };
      sheet.getCell(cell).font = { bold: true, color: { argb: colors.black } };
    });

    ["I2", "J2", "K2", "I3", "J3", "K3"].forEach((cell) => {
      sheet.getCell(cell).fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: colors.revaluation },
      };
      sheet.getCell(cell).font = { bold: true, color: { argb: colors.black } };
    });

    ["C2", "F2", "I2"].forEach((cell) => {
      sheet.getCell(cell).alignment = {
        horizontal: "center",
        vertical: "middle",
      };
      sheet.getCell(cell).font = {
        bold: true,
        size: 14,
        color: { argb: colors.black },
      };
    });

    ["C3", "D3", "E3", "F3", "G3", "H3", "I3", "J3", "K3"].forEach((cell) => {
      sheet.getCell(cell).alignment = {
        horizontal: "center",
        vertical: "middle",
      };
      sheet.getCell(cell).font = {
        bold: true,
        size: 10,
        color: { argb: colors.black },
      };
    });

    sheet.getRow(2).height = 34;
    sheet.getRow(3).height = 28;

    rows.forEach((r) => {
      const row = sheet.addRow([
        r["Division Code"],
        r["Division Name"],
        Number(r.verification_received),
        Number(r.verification_completed),
        Number(r.verification_pending),
        Number(r.photocopy_received),
        Number(r.photocopy_completed),
        Number(r.photocopy_pending),
        Number(r.revaluation_received),
        Number(r.revaluation_completed),
        Number(r.revaluation_pending),
      ]);

      row.height = 26;
    });

    const totalRow = sheet.addRow([
      "",
      "Total",
      total.verification_received,
      total.verification_completed,
      total.verification_pending,
      total.photocopy_received,
      total.photocopy_completed,
      total.photocopy_pending,
      total.revaluation_received,
      total.revaluation_completed,
      total.revaluation_pending,
    ]);

    totalRow.height = 28;
    totalRow.font = { bold: true };

    sheet.getCell(`B${totalRow.number}`).fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: colors.totalLabel },
    };

    [
      `C${totalRow.number}`,
      `D${totalRow.number}`,
      `E${totalRow.number}`,
    ].forEach((cell) => {
      sheet.getCell(cell).fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: colors.verification },
      };
    });

    [
      `F${totalRow.number}`,
      `G${totalRow.number}`,
      `H${totalRow.number}`,
    ].forEach((cell) => {
      sheet.getCell(cell).fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: colors.photocopy },
      };
    });

    [
      `I${totalRow.number}`,
      `J${totalRow.number}`,
      `K${totalRow.number}`,
    ].forEach((cell) => {
      sheet.getCell(cell).fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: colors.revaluation },
      };
    });

    sheet.eachRow((row, rowNumber) => {
      row.eachCell((cell) => {
        cell.border = {
          top: { style: "thin", color: { argb: colors.border } },
          left: { style: "thin", color: { argb: colors.border } },
          right: { style: "thin", color: { argb: colors.border } },
          bottom: { style: "thin", color: { argb: colors.border } },
        };

        cell.alignment = {
          horizontal: rowNumber === 1 ? "left" : "center",
          vertical: "middle",
          wrapText: true,
        };

        if (rowNumber >= 4) {
          cell.font = {
            ...cell.font,
            size: 11,
            bold: rowNumber === totalRow.number,
          };
        }
      });
    });

    for (let rowNo = 4; rowNo < totalRow.number; rowNo++) {
      sheet.getCell(`B${rowNo}`).alignment = {
        horizontal: "left",
        vertical: "middle",
      };
    }

    sheet.columns = [
      { width: 10 },
      { width: 18 },
      { width: 12 },
      { width: 12 },
      { width: 12 },
      { width: 12 },
      { width: 12 },
      { width: 12 },
      { width: 12 },
      { width: 12 },
      { width: 12 },
    ];

    const buffer = await workbook.xlsx.writeBuffer();

    return new Response(buffer, {
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": 'attachment; filename="hsc_report.xlsx"',
      },
    });
  } catch (err) {
    console.error(err);

    return new Response(
      JSON.stringify({ error: "Failed to generate report" }),
      { status: 500 },
    );
  }
}
