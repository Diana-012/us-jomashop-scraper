import puppeteer, { Browser } from "puppeteer";
import fs from "fs";

interface Crawler {
fetch: (url: string, handler: string) => Promise<any>;
close: () => Promise<void>;
}

export async function createCrawler(): Promise<Crawler> {
const proxyConfig = JSON.parse(fs.readFileSync("src/config/proxy.config.json", "utf-8"));
const launchOptions: any = { headless: true };

if (proxyConfig.proxy && proxyConfig.proxy !== "") {
launchOptions.args = [`--proxy-server=${proxyConfig.proxy}`];
}

const browser: Browser = await puppeteer.launch(launchOptions);

return {
fetch: async (url: string, handler: string) => {
const page = await browser.newPage();
try {
await page.goto(url, { waitUntil: "networkidle2", timeout: 60000 });

const content = await page.content();

return {
url,
html: content,
handler
};
} catch (err) {
console.error("Fetch error:", err);
return { url, html: "", handler };
} finally {
await page.close();
}
},

close: async () => {
await browser.close();
}
};
}