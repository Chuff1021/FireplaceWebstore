# Napoleon outdoor collection — September 21, 2026

Added 15 manufacturer-identified outdoor products: four Timberwolf wood fire pits
(including the blue 50th Anniversary edition), ten gas tables / fire pits / burner
kits, and the Phantom Freestand electric patio heater. No grills, kitchens, or
standalone furniture accessories were added. Existing outdoor products are retained.

Fourteen prices are Napoleon’s published US MSRP, not temporary sale prices.
The blue anniversary edition appears in Napoleon’s official US support catalog
(updated September 18, 2026), but has no published US MSRP; it explicitly uses
Contact for Pricing. Numeric zero is a catalog sentinel and is never displayed as
free. All new items require availability confirmation, with no invented inventory
quantities or reviews. The contact form carries the selected SKU into the inquiry.

## Sources

Model-specific price pages, image origins, and verification dates are recorded in
`data/napoleon-outdoor.json`. Images are served locally so removed manufacturer
URLs cannot break these listings. Official Salsify catalog images replace several
broken Napoleon image links. Three older-model photos were extracted/rendered
from Napoleon’s linked outdoor brochure (pages 10, 14, 20); the GPFL48MHP image
shows an optional windscreen, disclosed in its description. Brochure pricing was
not used. No AI-generated product imagery is used.

| Model | US MSRP | Official source |
| --- | ---: | --- |
| NWFPMTI-PHM | $549.00 | [Napoleon](https://www.napoleon.com/en/us/grills/products/outdoor-heating/timberwolf-smokeless-fire-pits/timberwolf-smokeless-fire-pit-nwfpmti-phm) |
| NWFPMTI-SS | $509.00 | [Napoleon](https://www.napoleon.com/en/us/grills/products/outdoor-heating/timberwolf-smokeless-fire-pits/timberwolf-smokeless-fire-pit-nwfpmti-ss) |
| NWFPLTI-SS | $709.00 | [Napoleon](https://www.napoleon.com/en/us/grills/products/outdoor-heating/timberwolf-smokeless-fire-pits/timberwolf-smokeless-fire-pit-nwfplti-ss) |
| NWFPMTI-BL-C | Contact for Pricing | [Napoleon](https://sites.salsify.com/7f15a6c7-dece-4721-ac9e-9fd4858ab82f/0a903af4-e810-4038-8e02-abddd690fdff/en-US/product/NWFPMTI-BL-C/50th-Anniversary-Edition-Timberwolf(r)-Smokeless-Fire-Pit-18-inch-Blue/) |
| NEOFV80IH | $859.00 | [Napoleon](https://www.napoleon.com/en/us/grills/products/outdoor-heating/freestand-patio-heater-series/phantom-freestand-neofv80ih) |
| GPFRCN72 | $2,999.00 | [Napoleon](https://www.napoleon.com/en/us/grills/products/outdoor-fire-tables/nexus-series/nexus-72-patioflame-table-gpfrcn72) |
| GPFCCN36 | $1,769.00 | [Napoleon](https://www.napoleon.com/en/us/grills/products/outdoor-fire-tables/nexus-series/nexus-36-patioflame-table-gpfccn36) |
| STTR1-BZ | $1,889.00 | [Napoleon](https://www.napoleon.com/en/us/grills/products/outdoor-fire-tables/st-tropez-series/st-tropez-rectangle-patioflame-table-sttr1-bz) |
| STTR2-BZ | $1,889.00 | [Napoleon](https://www.napoleon.com/en/us/grills/products/outdoor-fire-tables/st-tropez-series/st-tropez-square-patioflame-table-sttr2-bz) |
| HAMP1-GY | $1,499.00 | [Napoleon](https://www.napoleon.com/en/us/grills/products/outdoor-fire-tables/hamptons-series/hamptons-rectangle-patioflame-table-hamp1-gy) |
| HAMP2-GY | $1,499.00 | [Napoleon](https://www.napoleon.com/en/us/grills/products/outdoor-fire-tables/hamptons-series/hamptons-square-patioflame-table-hamp2-gy) |
| GPFR60 | $719.00 | [Napoleon](https://www.napoleon.com/en/us/grills/products/outdoor-fire-tables/patioflame-series/30-inch-linear-patioflame-burner-kit-gpfr60) |
| GPFS60 | $719.00 | [Napoleon](https://www.napoleon.com/en/us/grills/products/outdoor-fire-tables/patioflame-series/24-inch-square-patioflame-burner-kit-gpfs60) |
| GPFL48 | $1,659.00 | [Napoleon](https://www.napoleon.com/en/us/grills/products/outdoor-fire-tables/patioflame-series/48-inch-linear-patioflame-gpfl48) |
| GPFL48MHP | $1,999.00 | [Napoleon](https://www.napoleon.com/en/us/grills/products/outdoor-fire-tables/patioflame-series/linear-gas-patioflame-gpfl48mhp) |

## Behavior and validation

- New collection appears first under Outdoor Living’s default Featured sort.
- Napoleon is the first outdoor brand filter; wood, gas, and electric classifications
  use the new products’ explicit fuel specifications.
- Added Patio Heaters category; category navigation reloads its matching catalog.
- TypeScript and focused ESLint checks; API checks for every model, price, photo,
  unique SKU/slug, and unknown stock status; desktop/mobile browser checks.
- Product inquiry prefill checked without submitting a customer message.
