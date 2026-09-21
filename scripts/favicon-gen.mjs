import puppeteer from "puppeteer-core";
import { pathToFileURL } from "node:url";
const svgUrl = pathToFileURL("public/favicon.svg").href;
const browser = await puppeteer.launch({ executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome", headless: "new", args: ["--no-sandbox"] });
const page = await browser.newPage();
for (const size of [16, 32, 180, 512]) {
  const page2 = size === 16 ? page : await browser.newPage();
  await page2.setViewport({ width: size, height: size });
  await page2.goto(svgUrl, { waitUntil: "networkidle0" });
  await page2.screenshot({ path: `public/favicon-${size}.png`, omitBackground: false });
  if (size !== 16) await page2.close();
  console.log("generated", size);
}
await browser.close();
