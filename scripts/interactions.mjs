/* Interaction test: exercises key flows and persistence. */
import puppeteer from "puppeteer-core";

const CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const BASE = "http://localhost:5173";
const results = [];
const check = (name, ok, detail = "") => results.push(`${ok ? "PASS" : "FAIL"} ${name} ${detail}`);

const browser = await puppeteer.launch({ executablePath: CHROME, headless: "new", args: ["--no-sandbox"] });
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900 });
const errors = [];
page.on("pageerror", (e) => errors.push(e.message));
page.on("console", (m) => m.type() === "error" && errors.push(m.text()));

// 1. Incident status change + persistence across reload
await page.goto(`${BASE}/incidents/INC-1048`, { waitUntil: "networkidle0" });
await page.waitForSelector("#incident-status");
await page.select("#incident-status", "investigating");
await new Promise((r) => setTimeout(r, 300));
const drawerText1 = await page.evaluate(() => document.body.innerText.includes("Status changed to investigating"));
check("incident status change appends timeline", drawerText1);
await page.reload({ waitUntil: "networkidle0" });
await new Promise((r) => setTimeout(r, 400));
const statusAfterReload = await page.$eval("#incident-status", (el) => el.value);
check("incident status persists after reload", statusAfterReload === "investigating", `got ${statusAfterReload}`);

// 2. Assignment persists
await page.select("#incident-assignee", "u-04");
await new Promise((r) => setTimeout(r, 300));
await page.reload({ waitUntil: "networkidle0" });
const assigneeAfter = await page.$eval("#incident-assignee", (el) => el.value);
check("assignee persists after reload", assigneeAfter === "u-04", `got ${assigneeAfter}`);

// reset incident via UI
await page.select("#incident-status", "open");
await page.select("#incident-assignee", "u-02");

// 3. Invite member
await page.goto(`${BASE}/team`, { waitUntil: "networkidle0" });
await page.evaluate(() => [...document.querySelectorAll('button')].find((b) => b.textContent.includes('Invite member'))?.click());
await new Promise((r) => setTimeout(r, 200));
await page.type("#invite-email", "nina.kovacs@northbeam.io");
await page.evaluate(() => [...document.querySelectorAll('button')].find((b) => b.textContent.includes('Send invite'))?.click());
await new Promise((r) => setTimeout(r, 300));
const invitedVisible = await page.evaluate(() => document.body.innerText.includes("nina.kovacs@northbeam.io"));
check("invite adds member row", invitedVisible);

// 4. API key create + revoke
await page.goto(`${BASE}/settings?section=api`, { waitUntil: "networkidle0" });
const sectionVisible = await page.evaluate(() => document.body.innerText.includes("API keys"));
check("settings deep-link (?section=api)", sectionVisible);
await page.type('input[aria-label="New API key name"]', "Smoke test key");
await page.keyboard.press("Enter");
await new Promise((r) => setTimeout(r, 300));
const keyCreated = await page.evaluate(() => document.body.innerText.includes("Smoke test key"));
check("API key created", keyCreated);

// 5. Key persists across reload
await page.reload({ waitUntil: "networkidle0" });
const keyPersisted = await page.evaluate(() => document.body.innerText.includes("Smoke test key"));
check("API key persists after reload", keyPersisted);

// 6. Notifications mark all read persists
const unreadBefore = await page.evaluate(() => document.querySelectorAll('[aria-label^="Notifications"]').length);
await page.click('[aria-label^="Notifications"]');
await new Promise((r) => setTimeout(r, 200));
await page.evaluate(() => {
  const btn = [...document.querySelectorAll("button")].find((b) => b.textContent.includes("Mark all read"));
  btn?.click();
});
await new Promise((r) => setTimeout(r, 300));
await page.reload({ waitUntil: "networkidle0" });
await new Promise((r) => setTimeout(r, 400));
const unreadDot = await page.evaluate(() => !!document.querySelector('[aria-label="Notifications"] .bg-red-600'));
check("notifications unread state persists (no dot after mark all read)", !unreadDot, `menu buttons: ${unreadBefore}`);

// 7. Reset demo data
await page.goto(`${BASE}/settings?section=workspace`, { waitUntil: "networkidle0" });
await page.evaluate(() => {
  const btn = [...document.querySelectorAll("button")].find((b) => b.textContent.includes("Reset demo data"));
  btn?.click();
});
await page.waitForNavigation({ waitUntil: "networkidle0" });
await new Promise((r) => setTimeout(r, 400));
const keyGone = await page.evaluate(() => !document.body.innerText.includes("Smoke test key"));
check("reset demo clears persisted state", keyGone);

// 8. Mobile nav drawer
await page.setViewport({ width: 390, height: 844 });
await page.goto(`${BASE}/dashboard`, { waitUntil: "networkidle0" });
await page.click('[aria-label="Open navigation"]');
await new Promise((r) => setTimeout(r, 300));
const drawerOpen = await page.evaluate(() => document.body.innerText.includes("Dashboard") && document.querySelector('[aria-label="Close navigation"]') !== null);
check("mobile nav drawer opens", drawerOpen);
await page.click('[aria-label="Close navigation"]');

console.log(results.join("\n"));
console.log(`\nConsole/page errors: ${errors.length}`);
errors.slice(0, 5).forEach((e) => console.log("  ", e));
await browser.close();
process.exit(results.some((r) => r.startsWith("FAIL")) || errors.length ? 1 : 0);
