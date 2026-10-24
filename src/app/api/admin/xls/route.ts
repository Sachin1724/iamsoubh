import { NextResponse } from "next/server";
import ExcelJS from "exceljs";
import { listPaidOrders, toTable } from "@/backend/orders";

export const dynamic = "force-dynamic";

/** Same rows as the CSV, as a real Excel file. Generated per request, stored nowhere. */
export async function GET(req: Request) {
  try {
    const all = await listPaidOrders(true);
    const complete = new URL(req.url).searchParams.get("only") === "complete";
    const orders = complete ? all.filter((o) => o.address || o.city || o.pincode) : all;
    const stamp = new Date().toISOString().slice(0, 10);

    const wb = new ExcelJS.Workbook();
    const ws = wb.addWorksheet("Orders");
    // Strings stay strings in xlsx, so phone/pincode keep leading + and zeros.
    ws.addRows(toTable(orders));
    ws.getRow(1).font = { bold: true };
    ws.columns.forEach((c) => (c.width = 18));

    return new NextResponse(Buffer.from(await wb.xlsx.writeBuffer()), {
      headers: {
        "content-type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "content-disposition": `attachment; filename="orders-${stamp}.xlsx"`,
        "cache-control": "no-store",
        "X-Robots-Tag": "noindex, nofollow",
      },
    });
  } catch {
    return NextResponse.json({ code: "RAZORPAY_FAILED" }, { status: 502 });
  }
}
