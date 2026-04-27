export type PartsBrand = {
  name: string;
  sourceUrl: string;
};

export type PartsDepartment = {
  name: string;
  slug: string;
  description: string;
  image: string;
  sourceUrl: string;
  brands: PartsBrand[];
};

export const partsCatalogStats = {
  indexedProducts: 32018,
  indexedBrands: 195,
  indexedSitemapGroups: 6,
};

export const partsPartTypes = [
  "Auger Motors",
  "Combustion Blowers",
  "Convection Fans",
  "Control Boards",
  "Gaskets & Sealants",
  "Igniters",
  "Pilot Assemblies",
  "Thermopiles",
];

export const partsDepartments: PartsDepartment[] = [
  {
    name: "Wood & Coal Stove Parts",
    slug: "wood-coal-stove-parts",
    description: "Model-specific replacement parts for wood and coal stoves, inserts, and furnaces.",
    image: "/products/parts/cc-300.jpg",
    sourceUrl: "https://www.stove-parts-unlimited.com/wood-coal-stove-parts/",
    brands: [
      { name: "Napoleon", sourceUrl: "https://www.stove-parts-unlimited.com/brands/Napoleon.html" },
      { name: "Osburn", sourceUrl: "https://www.stove-parts-unlimited.com/brands/Osburn.html" },
      { name: "Buck", sourceUrl: "https://www.stove-parts-unlimited.com/brands/Buck.html" },
      { name: "Ashley", sourceUrl: "https://www.stove-parts-unlimited.com/ashley-wood-parts/" },
      { name: "Appalachian", sourceUrl: "https://www.stove-parts-unlimited.com/brands/Appalachian.html" },
      { name: "Country Flame", sourceUrl: "https://www.stove-parts-unlimited.com/brands/Country-Flame.html" },
    ],
  },
  {
    name: "Gas Fireplace Parts",
    slug: "gas-fireplace-parts",
    description: "Valves, pilots, logs, burners, control boards, and ignition parts for gas fireplaces.",
    image: "/products/parts/1006-p002si.jpg",
    sourceUrl: "https://www.stove-parts-unlimited.com/gas-fireplace-parts/",
    brands: [
      { name: "Majestic", sourceUrl: "https://www.stove-parts-unlimited.com/brands/Majestic.html" },
      { name: "Heatilator", sourceUrl: "https://www.stove-parts-unlimited.com/heatilator-eco-choice/" },
      { name: "Kingsman", sourceUrl: "https://www.stove-parts-unlimited.com/brands/Kingsman.html" },
      { name: "Superior", sourceUrl: "https://www.stove-parts-unlimited.com/brands/IHP.html" },
      { name: "Monessen", sourceUrl: "https://www.stove-parts-unlimited.com/brands/Majestic.html" },
      { name: "Napoleon", sourceUrl: "https://www.stove-parts-unlimited.com/brands/Napoleon.html" },
    ],
  },
  {
    name: "Gas Stove Parts",
    slug: "gas-stove-parts",
    description: "Replacement burners, valves, blowers, controls, and trim parts for freestanding gas stoves.",
    image: "/products/parts/50-589.jpg",
    sourceUrl: "https://www.stove-parts-unlimited.com/gas-stove-parts/",
    brands: [
      { name: "Napoleon", sourceUrl: "https://www.stove-parts-unlimited.com/brands/Napoleon.html" },
      { name: "Regency", sourceUrl: "https://www.stove-parts-unlimited.com/brands/Regency.html" },
      { name: "Enviro", sourceUrl: "https://www.stove-parts-unlimited.com/brands/Enviro.html" },
      { name: "Kingsman", sourceUrl: "https://www.stove-parts-unlimited.com/brands/Kingsman.html" },
      { name: "Lennox", sourceUrl: "https://www.stove-parts-unlimited.com/brands/Lennox.html" },
      { name: "IHP", sourceUrl: "https://www.stove-parts-unlimited.com/brands/IHP.html" },
    ],
  },
  {
    name: "Pellet Stove Parts",
    slug: "pellet-stove-parts",
    description: "Augers, exhaust blowers, igniters, control boards, and wear parts for pellet appliances.",
    image: "/products/parts/812-0180.jpg",
    sourceUrl: "https://www.stove-parts-unlimited.com/pellet-stove-parts/",
    brands: [
      { name: "Harman", sourceUrl: "https://www.stove-parts-unlimited.com/brands/Harman.html" },
      { name: "Quadra-Fire", sourceUrl: "https://www.stove-parts-unlimited.com/brands/Quadrafire.html" },
      { name: "Englander", sourceUrl: "https://www.stove-parts-unlimited.com/brands/Englander.html" },
      { name: "Lopi", sourceUrl: "https://www.stove-parts-unlimited.com/brands/Lopi.html" },
      { name: "Whitfield", sourceUrl: "https://www.stove-parts-unlimited.com/brands/Whitfield.html" },
      { name: "Pelpro", sourceUrl: "https://www.stove-parts-unlimited.com/pelpro-pellet-parts/" },
    ],
  },
  {
    name: "Electric Fireplace Parts",
    slug: "electric-fireplace-parts",
    description: "Heating elements, controls, switches, lamps, remotes, and service parts for electric fireplaces.",
    image: "/products/parts/led-all40.jpg",
    sourceUrl: "https://www.stove-parts-unlimited.com/electric-fireplace-parts/",
    brands: [
      { name: "Napoleon", sourceUrl: "https://www.stove-parts-unlimited.com/brands/Napoleon.html" },
      { name: "SimpliFyre", sourceUrl: "https://www.stove-parts-unlimited.com/simplifyre-electric-parts/" },
      { name: "Superior", sourceUrl: "https://www.stove-parts-unlimited.com/brands/IHP.html" },
      { name: "Newmac", sourceUrl: "https://www.stove-parts-unlimited.com/brands/Newmac.html" },
      { name: "Modern Flames Electric", sourceUrl: "https://www.stove-parts-unlimited.com/modern-flames/" },
      { name: "Astria", sourceUrl: "https://www.stove-parts-unlimited.com/brands/Astria.html" },
      { name: "Forge & Flame", sourceUrl: "https://www.stove-parts-unlimited.com/forge-flame/" },
      { name: "Lennox", sourceUrl: "https://www.stove-parts-unlimited.com/brands/Lennox.html" },
      { name: "FMI", sourceUrl: "https://www.stove-parts-unlimited.com/brands/FMI.html" },
      { name: "Heat N Glo", sourceUrl: "https://www.stove-parts-unlimited.com/brands/Heat-N-Glo.html" },
      { name: "Heatilator", sourceUrl: "https://www.stove-parts-unlimited.com/brands/Heatilator.html" },
      { name: "Outdoor Greatroom", sourceUrl: "https://www.stove-parts-unlimited.com/outdoor-greatroom-company/" },
      { name: "Majestic", sourceUrl: "https://www.stove-parts-unlimited.com/brands/Majestic.html" },
      { name: "Comfort Flame", sourceUrl: "https://www.stove-parts-unlimited.com/brands/Comfort-Flame.html" },
    ],
  },
  {
    name: "Outdoor Fireplace Parts",
    slug: "outdoor-fireplace-parts",
    description: "Burner assemblies, valves, ignition parts, media, and service components for outdoor hearth products.",
    image: "/products/parts/w565-0062.jpg",
    sourceUrl: "https://www.stove-parts-unlimited.com/outdoor-fireplace-parts/",
    brands: [
      { name: "Napoleon", sourceUrl: "https://www.stove-parts-unlimited.com/brands/Napoleon.html" },
      { name: "Outdoor Lifestyles", sourceUrl: "https://www.stove-parts-unlimited.com/outdoor-lifestyles/" },
      { name: "Majestic", sourceUrl: "https://www.stove-parts-unlimited.com/brands/Majestic.html" },
      { name: "Kingsman", sourceUrl: "https://www.stove-parts-unlimited.com/brands/Kingsman.html" },
      { name: "Superior", sourceUrl: "https://www.stove-parts-unlimited.com/brands/IHP.html" },
      { name: "Regency", sourceUrl: "https://www.stove-parts-unlimited.com/brands/Regency.html" },
    ],
  },
];

export const featuredPartsBrands = [
  "Harman",
  "Quadra-Fire",
  "Napoleon",
  "Lopi",
  "Regency",
  "Majestic",
  "Enviro",
  "Heatilator",
  "Kingsman",
  "Buck",
  "Osburn",
  "Dimplex",
];

export function getPartsDepartmentBySlug(slug: string) {
  return partsDepartments.find((department) => department.slug === slug) ?? null;
}

export const partsDepartmentSlugs = new Set(partsDepartments.map((department) => department.slug));
