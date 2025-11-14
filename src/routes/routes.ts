export function routeUrl(url: string) {
  // Simple router: returns handler ID string
  if (url.includes("watch")) return "product";
  if (url.includes("category")) return "category";

  return "generic";
}