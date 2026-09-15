/* Capture portfolio screenshots into ./screenshots as compressed JPEGs. */
import puppeteer from "puppeteer-core";
import { mkdirSync } from "node:fs";

const CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const BASE = "http://localhost:5173";
const OUT = new URL("../screenshots/", import.meta.url).pathname;

const shots = [
  { route: "/", w: 1440, name: "01-landing-hero" },
  { route: "/dashboard", w: 1440, name: "02-dashboard" },
  { route: "/incidents", w: 1440, name: "03-incidents" },
  { route: "/incidents/INC-1051", w: 1440, name: "04-incident-detail" },
  { route: "/assets", w: 1440, name: "05-assets" },
  { route: "/team", w: 1440, name: "06-team" },
  { route: "/settings", w: 1440, name: "07-settings" },
  { route: "/dashboard", w: 390, name: "08-dashboard-mobile" },
  { route: "/incidents", w: 390, name: "09-incidents-mobile" },
];

mkdirSync(OUT, { recursive: true });

const browser = await puppeteer.launch({ executablePath: CHROME, headless: "new", args: ["--no-sandbox", "--disable-gpu"] });

for (const s of shots) {
  const page = await browser.newPage();
  await page.setViewport({ width: s.w, height: 900, deviceScaleFactor: 1.5 });
  await page.goto(BASE + s.route, { waitUntil: "networkidle0", timeout: 30000 });
  await new Promise((r) => setTimeout(r, 600));
  await page.screenshot({ path: `${OUT}${s.name}.jpg`, type: "jpeg", quality: 72, fullPage: false });
  await page.close();
  console.log("saved", s.name);
}
await browser.close();
