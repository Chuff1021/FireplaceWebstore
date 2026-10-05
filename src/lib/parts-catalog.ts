import type { Product } from "@/lib/store-config";

export type PartsFacet = { name: string; count: number };
export type PartsCatalogResponse = {
  products: Product[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  catalogTotal: number;
  facets: { brands: PartsFacet[]; partTypes: PartsFacet[]; departments: PartsFacet[] };
};

export function normalizePartsBrand(value: string) {
  const label = value.trim()
    .replace(/\s+(?:Wood\s*&\s*(?:Coal|Oil)|Corn\s*&\s*Pellet|BBQ\s*&\s*Gas\s*Grill|Gas\s*Log\s*Set|Electric\s*Fireplace|Pellet\s*Grill|(?:Pellet|Wood|Coal|Gas|Electric|Outdoor|Fireplace|Stove|Grill)(?:\s+(?:Stove|Fireplace|Furnace))?)\s+Parts$/i, "")
    .replace(/(?<!&)\s+Parts$/i, "")
    .replace(/\s+/g, " ").trim();
  const aliases: Record<string, string> = {
    quadrafire: "Quadra-Fire",
    heatnglo: "Heat N Glo",
    heatglo: "Heat N Glo",
    modernflameselectric: "Modern Flames",
    modernflames: "Modern Flames",
    outdoorgreatroom: "Outdoor Greatroom",
    pelpro: "Pelpro",
  };
  return aliases[label.toLowerCase().replace(/[^a-z0-9]/g, "")] ?? label;
}

function key(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]/g, "");
}

function facets(values: string[]): PartsFacet[] {
  const counts = new Map<string, number>();
  for (const value of values) {
    if (value && value !== "N/A") counts.set(value, (counts.get(value) ?? 0) + 1);
  }
  return Array.from(counts, ([name, count]) => ({ name, count }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

export function filterPartsCatalog(products: Product[], params: URLSearchParams): PartsCatalogResponse {
  const category = params.get("category") || "parts";
  const brand = normalizePartsBrand(params.get("brand") || "");
  const partType = params.get("partType") || "";
  const query = (params.get("q") || "").trim().slice(0, 200).toLowerCase();
  const tokens = query.split(/\s+/).filter(Boolean);
  const matchesBrand = (product: Product) => !brand || key(product.brand) === key(brand);
  const departmentProducts = products.filter(product => category === "parts" || product.subcategoryId === category);
  const brandedProducts = departmentProducts.filter(matchesBrand);
  const filtered = brandedProducts.filter(product => {
    if (partType && key(product.specifications["Part Type"] || "") !== key(partType)) return false;
    if (!query) return true;
    if (key(product.sku).includes(key(query)) && key(query)) return true;
    const text = [product.name, product.sku, product.brand, product.description, product.specifications["Part Type"]].join(" ").toLowerCase();
    return tokens.every(token => text.includes(token));
  }).sort((a, b) => {
    if (query) {
      const exactA = key(a.sku) === key(query);
      const exactB = key(b.sku) === key(query);
      if (exactA !== exactB) return exactA ? -1 : 1;
    }
    const sort = params.get("sort");
    if (sort === "price-asc") return (a.salePrice ?? a.price) - (b.salePrice ?? b.price) || a.name.localeCompare(b.name);
    if (sort === "price-desc") return (b.salePrice ?? b.price) - (a.salePrice ?? a.price) || a.name.localeCompare(b.name);
    return a.name.localeCompare(b.name);
  });
  const positiveInteger = (value: string | null, fallback: number) => {
    const parsed = Number(value);
    return Number.isFinite(parsed) && parsed >= 1 ? Math.floor(parsed) : fallback;
  };
  const pageSize = Math.min(positiveInteger(params.get("pageSize"), 20), 48);
  const totalPages = Math.ceil(filtered.length / pageSize);
  const page = Math.min(positiveInteger(params.get("page"), 1), Math.max(totalPages, 1));
  return {
    products: filtered.slice((page - 1) * pageSize, page * pageSize),
    total: filtered.length, page, pageSize, totalPages, catalogTotal: products.length,
    facets: {
      brands: facets(departmentProducts.map(product => product.brand)),
      partTypes: facets(brandedProducts.map(product => product.specifications["Part Type"] || "")),
      departments: facets(products.map(product => product.subcategoryId || "parts")),
    },
  };
}
