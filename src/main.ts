import fs from "fs";
import path from "path";
import { createCrawler } from "./crawlers/puppeteerCrawler.js";
import { parseProduct } from "./utils/parser.js";
import { routeUrl } from "./routes/routes.js";

const inputPath = path.resolve("input/input.json");
const outputPath = path.resolve("output/sample.json");

async function main() {
try {
const inputData = JSON.parse(fs.readFileSync(inputPath, "utf-8"));
if (!Array.isArray(inputData.urls)) {
throw new Error("input.json must contain { \"urls\": [ ... ] }");
}

const crawler = await createCrawler();

const results = [];
for (const url of inputData.urls) {
console.log(`Processing: ${url}`);
const handler = routeUrl(url);

const pageData = await crawler.fetch(url, handler);
const parsed = await parseProduct(pageData);
results.push(parsed);
}

fs.writeFileSync(outputPath, JSON.stringify(results, null, 2));
console.log("Scraping complete. Output saved to output/sample.json");

await crawler.close();
} catch (err) {
console.error("Fatal error:", err);
}
}

main();