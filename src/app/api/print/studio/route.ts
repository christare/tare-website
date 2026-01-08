import { NextResponse } from "next/server";
import { chromium } from "playwright";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const origin = url.origin;

  const target = new URL("/print/studio", origin);

  // Optional query params (e.g. /api/print/studio?scale=0.9)
  const scaleParam = url.searchParams.get("scale");
  const scale = scaleParam ? Number(scaleParam) : 1;

  const browser = await chromium.launch({
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  try {
    const context = await browser.newContext({
      viewport: { width: 900, height: 1200 },
      deviceScaleFactor: 2,
    });
    const page = await context.newPage();

    await page.emulateMedia({ media: "print" });
    await page.goto(target.toString(), { waitUntil: "networkidle" });

    const pdf = await page.pdf({
      format: "Letter",
      printBackground: true,
      scale: Number.isFinite(scale) && scale > 0 ? scale : 1,
      margin: { top: "0in", right: "0in", bottom: "0in", left: "0in" },
    });

    return new NextResponse(pdf, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'attachment; filename="tare-studio-onepager.pdf"',
        "Cache-Control": "no-store",
      },
    });
  } finally {
    await browser.close();
  }
}


