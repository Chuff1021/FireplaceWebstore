# Fireplace Image Upgrade Plan

Generated from product datasets only (no parts): `gas-fireplaces`, `electric-fireplaces`, `wood-fireplaces`, `gas-inserts`, `electric-inserts`, `wood-inserts`, `gas-stoves`, `pellet-stoves`, `pellet-inserts`, and `outdoor-fireplaces`.

## Scope Snapshot

- Total fireplace products reviewed: **2,002**
- Local image references checked under `public/`: **2,002 / 2,002 exist**
- Output manifest: `image-upgrade/priority-products.csv`
- Manifest size: top **200** products by storefront priority

## Category Impact

| Category file | Products | Upgrade priority |
|---|---:|---|
| `data/gas-fireplaces-scraped.json` | 818 | Highest traffic/commercial impact; start here. |
| `data/electric-fireplaces-scraped.json` | 470 | Large catalog, strong visual-shopping category. |
| `data/outdoor-fireplaces-scraped.json` | 404 | High-ticket/lifestyle-heavy; images matter. |
| `data/wood-fireplaces-scraped.json` | 134 | Moderate count; prioritize best sellers/reviewed SKUs. |
| `data/gas-inserts-scraped.json` | 51 | Smaller but high-intent conversion category. |
| `data/gas-stoves-scraped.json` | 41 | Smaller; clean up after major categories. |
| `data/wood-inserts-scraped.json` | 34 | Smaller; prioritize best sellers. |
| `data/pellet-stoves-scraped.json` | 24 | Lower count; batch by brand. |
| `data/electric-inserts-scraped.json` | 22 | Lower count; batch by brand. |
| `data/pellet-inserts-scraped.json` | 4 | Final pass. |

## Top Brand Targets

Ranked by product count and weighted storefront impact:

1. **Empire** — 269 products; biggest gas-fireplace footprint.
2. **The Outdoor Plus** — 218 products; outdoor/lifestyle category with weak generic brand parse in source (`The`).
3. **Superior** — 169 products; many top-ranked fireplace SKUs.
4. **Amantii** — 134 products; electric category depth.
5. **Majestic** — 107 products; high-ticket gas/wood/inserts.
6. **Napoleon** — 100 products; strong brand recognition and reviews.
7. **FireRock** — 98 products; outdoor/wood masonry impact.
8. **SEI** — 93 products; electric catalog volume.
9. **Kingsman** — 92 products; gas/outdoor high-ticket products.
10. **Dimplex** — 57 products; electric fireplaces/inserts.

Other meaningful batches: Bio Flame, Mason Lite, Outdoor Lifestyles, Stone Age Manufacturing, Modern Flames, American Fyre Designs, Sierra, Litedeer, Simplifire, Montigo.

## Priority Product Examples

The first upgrade pass should start with Tier A rows in `priority-products.csv`. Top examples:

| Rank | SKU | Brand | Category | Why |
|---:|---|---|---|---|
| 1 | `SUP-DRL2055TEN` | Superior | gas fireplaces | Best seller/reviewed/high-ticket linear fireplace. |
| 2 | `CUI-DVD36FP30N` | Empire | gas fireplaces | Best seller with highest review signal. |
| 3 | `SUP-DRL2045TEN` | Superior | gas fireplaces | Best seller/reviewed related model. |
| 4 | `KGM-OFP7972S1P2` | Kingsman | gas fireplaces | Very high-ticket outdoor linear fireplace. |
| 5 | `EMP-VFLB60SP90N` | Empire | gas fireplaces | High-ticket see-through Boulevard model. |
| 6 | `SUP-ODLVF72ZEN` | Superior | gas fireplaces | Outdoor 72-inch linear model. |
| 7 | `ODL-ODLANAIGST-48` | Outdoor Lifestyles | gas fireplaces | Best seller outdoor see-through model. |
| 8 | `CUI-OLL60FP12SN` | Empire | gas fireplaces | Outdoor stainless linear model. |
| 9 | `EMP-VFLB72FP90N` | Empire | gas fireplaces | High-ticket 72-inch linear gas fireplace. |
| 10 | `NPL-RSS42NE` | Napoleon | gas fireplaces | Outdoor clean-face product from recognizable brand. |

## Recommended Workflow

1. **Tier A (rows 1-50):** Source/verify manufacturer-quality hero images first. Focus on Empire, Superior, Kingsman, Napoleon, Outdoor Lifestyles.
2. **Tier B (rows 51-150):** Continue high-count brands and electric leaders: Amantii, Dimplex, Modern Flames, SEI.
3. **Tier C / batch work:** Work brand-by-brand using normalized brand + model guess from the CSV.
4. For each sourced image later, record source URL, license/permission status, dimensions, and whether it replaces or supplements the current image.
5. Avoid overwriting existing local files until replacement quality is verified; all current local images exist, so this is an upgrade project, not a missing-image recovery project.

## CSV Fields

`priority-products.csv` includes the requested sourcing fields:

- `category_file`
- `sku`
- `brand`
- `normalized_brand`
- `model_guess`
- `name`
- `slug`
- `current_image_path_url`
- `current_local_image_exists`

It also includes ranking helpers: `priority_rank`, `priority_tier`, `priority_score`, `is_best_seller`, `rating`, `review_count`, and `sale_price`.

## Notes

- No images were downloaded.
- Some source brand fields were under-parsed and normalized in the CSV, e.g. `The` → `The Outdoor Plus`, `Bio` → `Bio Flame`, `Stone` → `Stone Age Manufacturing`, `Mason` → `Mason Lite`, `Modern` → `Modern Flames`, `American` → `American Fyre Designs`, `Outdoor` → `Outdoor Lifestyles`, `True` → `True North`, `JR` → `JR Home`.
- Priority scoring weighted category impact, best-seller flag, review count/rating, and sale price.
