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
    image: "/categories/wood-stoves.jpg",
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
    image: "/categories/gas-fireplaces.jpg",
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
    image: "/categories/gas-stoves.jpg",
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
    image: "/categories/pellet-stoves.jpg",
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
    name: "Electric Stove Parts",
    slug: "electric-stove-parts",
    description: "Heating elements, controls, switches, lamps, and service parts for electric hearth units.",
    image: "/categories/electric-fireplaces.jpg",
    sourceUrl: "https://www.stove-parts-unlimited.com/electric-stove-parts/",
    brands: [
      { name: "Dimplex", sourceUrl: "https://www.stove-parts-unlimited.com/brands/Dimplex.html" },
      { name: "SimpliFire", sourceUrl: "https://www.stove-parts-unlimited.com/simplifyre-electric-parts/" },
      { name: "Modern Flames", sourceUrl: "https://www.stove-parts-unlimited.com/modern-flames/" },
      { name: "Amantii", sourceUrl: "https://www.stove-parts-unlimited.com/amantii/" },
      { name: "Napoleon", sourceUrl: "https://www.stove-parts-unlimited.com/brands/Napoleon.html" },
      { name: "Majestic", sourceUrl: "https://www.stove-parts-unlimited.com/brands/Majestic.html" },
    ],
  },
  {
    name: "Outdoor Fireplace Parts",
    slug: "outdoor-fireplace-parts",
    description: "Burner assemblies, valves, ignition parts, media, and service components for outdoor hearth products.",
    image: "/categories/outdoor-fireplaces.jpg",
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
