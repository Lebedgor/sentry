/* Verify no horizontal overflow on every route at 390px. */
import puppeteer from "puppeteer-core";
const browser = await puppeteer.launch({ executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome", headless: "new", args: ["--no-sandbox"] });
const page = await browser.newPage();
await page.setViewport({ width: 390, height: 900 });
let failed = false;
for (const route of ["/", "/dashboard", "/incidents", "/incidents/INC-1051", "/assets", "/assets/a-01", "/team", "/settings"]) {
  await page.goto("http://localhost:5173" + route, { waitUntil: "networkidle0" });
  await new Promise((r) => setTimeout(r, 300));
  const sw = await page.evaluate(() => document.documentElement.scrollWidth);
  const ok = sw === 390;
  if (!ok) failed = true;
  console.log(`${ok ? "ok " : "FAIL"} ${route} scrollWidth: ${sw}`);
}
await browser.close();
process.exit(failed ? 1 : 0);
