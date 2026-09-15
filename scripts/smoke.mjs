/* Smoke test: load every route headlessly, capture console errors and page errors. */
import puppeteer from "puppeteer-core";

const CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const BASE = "http://localhost:5173";
const routes = ["/", "/dashboard", "/incidents", "/incidents/INC-1051", "/assets", "/assets/a-01", "/team", "/settings", "/nope"];

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: "new",
  args: ["--no-sandbox", "--disable-gpu", "--window-size=1440,900"],
});

const results = [];
for (const width of [1440, 768, 390]) {
  const page = await browser.newPage();
  await page.setViewport({ width, height: 900 });
  const errors = [];
  page.on("pageerror", (e) => errors.push(`pageerror: ${e.message}`));
  page.on("console", (m) => {
    if (m.type() === "error") errors.push(`console: ${m.text()}`);
  });
  for (const route of routes) {
    errors.length = 0;
    await page.goto(BASE + route, { waitUntil: "networkidle0", timeout: 30000 });
    await new Promise((r) => setTimeout(r, 400));
    const text = await page.evaluate(() => document.body.innerText.slice(0, 120).replace(/\n/g, " | "));
    results.push({ width, route, errors: [...errors], text });
  }
  await page.close();
}
await browser.close();

let failed = false;
for (const r of results) {
  const status = r.errors.length ? "FAIL" : "ok";
  if (r.errors.length) failed = true;
  console.log(`[${r.width}] ${status} ${r.route} — ${r.text}`);
  for (const e of r.errors) console.log(`   ${e}`);
}
process.exit(failed ? 1 : 0);
