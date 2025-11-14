import { JSDOM } from "jsdom";

export async function parseProduct(data: any) {
const dom = new JSDOM(data.html);
const doc = dom.window.document;

const title = doc.querySelector("title")?.textContent?.trim() || null;

// Simple price extraction
let price = null;
const priceEl = doc.querySelector("[itemprop='price'], .price, .product-price");
if (priceEl) {
const raw = priceEl.textContent?.replace(/[^0-9.]/g, "") || null;
price = raw ? Number(raw) : null;
}

const availability =
doc.querySelector(".out-of-stock, .sold-out") ? "Out of Stock" : "In Stock";

return {
url: data.url,
title,
price,
category: data.handler === "category" ? "Category Page" : "Product",
brand: null,
availability
};
}