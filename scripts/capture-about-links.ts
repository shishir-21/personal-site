/**
 * One-off script to capture screenshots for about page links.
 * Run with: npx tsx scripts/capture-about-links.ts
 */
import { chromium } from "playwright";
import fs from "fs/promises";

const URLS = [
  "https://coffeecoach.app",
  "https://github.com/rav4nn/youtube-rag-scraper",
  "https://github.com/rav4nn/flux-rag",
];

const OUTPUT_DIR = "public/previews";
const MANIFEST_PATH = "public/previews/manifest.json";

function hashUrl(url: string): string {
  let hash = 0;
  for (let i = 0; i < url.length; i++) {
    const char = url.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(16).padStart(12, "0").slice(0, 12);
}

async function main() {
  console.log("📸 Capturing about page link previews...\n");

  const manifest = JSON.parse(await fs.readFile(MANIFEST_PATH, "utf-8"));
  const browser = await chromium.launch({ headless: true });

  for (const url of URLS) {
    const hash = hashUrl(url);
    const filename = `${hash}.jpeg`;
    const outputPath = `${OUTPUT_DIR}/${filename}`;

    console.log(`Capturing: ${url}`);

    const context = await browser.newContext({
      viewport: { width: 1200, height: 630 },
      userAgent:
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    });
    const page = await context.newPage();

    try {
      await page.route("**/*", (route) => {
        const type = route.request().resourceType();
        if (["font", "media", "websocket"].includes(type)) {
          route.abort();
        } else {
          route.continue();
        }
      });

      try {
        await page.goto(url, { waitUntil: "networkidle", timeout: 20000 });
      } catch {
        await page.goto(url, { waitUntil: "domcontentloaded", timeout: 30000 });
        await page.waitForTimeout(3000);
      }

      await page.waitForTimeout(1000);
      await page.screenshot({ path: outputPath, type: "jpeg", quality: 80 });

      manifest.previews[hash] = {
        url,
        screenshotPath: `/previews/${filename}`,
        width: 1200,
        height: 630,
        generatedAt: new Date().toISOString(),
        status: "success",
      };

      console.log(`  ✓ Done\n`);
    } catch (err) {
      console.log(`  ✗ Failed: ${err}\n`);
      manifest.previews[hash] = {
        url,
        screenshotPath: `/previews/${filename}`,
        width: 1200,
        height: 630,
        generatedAt: new Date().toISOString(),
        status: "failed",
        errorMessage: String(err),
      };
    } finally {
      await context.close();
    }
  }

  await browser.close();
  manifest.generated = new Date().toISOString();
  await fs.writeFile(MANIFEST_PATH, JSON.stringify(manifest, null, 2));
  console.log("✓ Manifest updated.");
}

main().catch(console.error);
