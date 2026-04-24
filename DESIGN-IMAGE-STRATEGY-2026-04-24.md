# FireplaceWebstore Design + Product Image Strategy - 2026-04-24

## Direction Decision

Colton wants the site to look significantly better and does not believe the AI fireplace design tool can be made into a reliable functional tool. Sam agrees.

The AI design tool should not be treated as a core product feature unless it is heavily simplified. The better strategy is:

1. Build a premium, trust-heavy storefront design.
2. Turn the design tool into a guided fitment / quote / style recommendation intake flow.
3. Replace poor product imagery by cross-referencing products against manufacturer/dealer sources and building a durable image-quality workflow.

## Current Observations

- Current site design is serviceable but not premium enough for high-ticket fireplaces.
- Site mixes visual styles: modern ecommerce header/category layout, generic orange/red hero, and a separate warm gradient AI-design-tool style.
- Product cards and PDPs use local images, many of which are low-quality or sourced from small/legacy scraped images.
- Repo contains 34,115 product image files under `public/products`, which is too heavy for git and hard to curate manually.
- Product data includes useful cross-reference fields:
  - `sku`
  - `brand`
  - `name`
  - `productUrl`
  - CSV fields: `Brand`, `Model_SKU`, `Product_URL`, `Image_URL`, `Description`
- Example current image sources include old eFireplaceStore icon GIF URLs, which explains low quality.

## Recommended Design Positioning

The site should feel like a national fireplace superstore with local expertise, not a generic template.

Design vibe:

- Premium hearth showroom
- Warm but not cheesy
- Dark charcoal / warm cream / copper accents
- Large lifestyle photography
- Strong product discovery
- Dealer-grade trust
- Clear quote/support paths for complex purchases

Reference directions:

- Manufacturer-level polish: Napoleon, Fireplace Xtrordinair, European Home
- Ecommerce clarity: clean search, category mega-nav, product cards with specs and fitment cues
- High-ticket trust: phone support, install/advice messaging, warranty/returns clarity, financing/freight disclosures

## AI Design Tool Pivot

Current tool:

- Simulates AI processing.
- Uses sample products only.
- Upload preview is not a true room visualization.
- Risks disappointing users if marketed as AI visualization.

Recommended replacement:

### New Feature Name

- Fireplace Matchmaker
- Hearth Fit Finder
- Fireplace Planning Assistant
- Find My Fireplace

### Purpose

Capture high-intent buyer requirements and route them to:

1. matching product categories/SKUs,
2. a quote/contact flow,
3. optional expert follow-up.

### Inputs

- Fuel type
- Install type: new build, replacement, insert, outdoor
- Existing fireplace opening dimensions
- Room square footage
- Venting situation
- Style preference
- Budget range
- Zip code
- Timeline
- Photos optional, but framed as “help our experts review,” not “AI will render your room perfectly.”
- Email/phone before final recommendations.

### Output

- Recommended categories and 3-5 candidate products.
- “Talk to a fireplace expert” CTA.
- “Send my plan” lead capture.
- Internal lead payload for follow-up.

## Product Image Upgrade Strategy

### Core Rule

Do not blindly scrape and reuse images without checking rights. Prefer manufacturer/dealer media libraries, authorized dealer assets, or assets covered by dealer agreements.

### Image Source Priority

1. Manufacturer official product page / media library.
2. Authorized dealer product module/feed.
3. Distributor assets available to Aaron's Fireplace Co.
4. Current supplier/catalog data if usage is allowed.
5. Fallback: current image, but flagged as low quality.

### Workflow

For each product:

1. Normalize brand and model/SKU.
2. Search manufacturer site by `brand + model SKU + fireplace`.
3. Collect candidate image URLs.
4. Score candidates:
   - manufacturer domain preferred
   - high resolution preferred
   - product-only image preferred for card
   - lifestyle image preferred for PDP gallery/hero
   - avoid thumbnails, GIFs, watermarked images, tiny icon images
5. Store image metadata:
   - source URL
   - source domain
   - license/permission status
   - image width/height
   - type: product, lifestyle, diagram, manual/spec
   - confidence score
6. Download only approved/usable images to durable storage/CDN, not git long-term.
7. Update product data to use best primary image and gallery.

### Suggested Data File

Create `data/product-image-candidates.json` with records like:

```json
{
  "sku": "SUP-DRL2055TEN",
  "brand": "Superior",
  "model": "DRL2055TEN",
  "currentImage": "/products/...",
  "candidates": [
    {
      "url": "https://manufacturer.example/image.jpg",
      "sourceDomain": "manufacturer.example",
      "width": 1600,
      "height": 1000,
      "kind": "product",
      "confidence": 0.92,
      "usageStatus": "needs-review"
    }
  ]
}
```

## Manufacturer / Brand Targets First

Start with high-value/high-volume fireplace brands:

1. Superior
2. Empire
3. Napoleon
4. Dimplex
5. Majestic
6. Monessen
7. Osburn
8. Valcourt
9. Modern Flames
10. Amantii

## Immediate Design Backlog

### P0

1. Remove/reposition “AI-powered design studio” as a core promise.
2. Replace with guided buyer/quote tool.
3. Replace placeholder/fake phone and trust content.
4. Remove fake reviews before redesign polish.
5. Pick new visual system: charcoal/cream/copper, premium showroom look.

### P1

1. Redesign homepage hero with premium lifestyle imagery and clearer buyer paths:
   - Shop Fireplaces
   - Find Replacement Parts
   - Get Expert Help
   - Build/Plan My Fireplace
2. Redesign product cards:
   - cleaner image frame
   - brand + model/SKU
   - key specs: fuel, size, BTU/width where available
   - “Talk to expert” secondary CTA for complex products
3. Redesign PDP:
   - big gallery
   - sticky buy/quote panel
   - specs table
   - documents/manuals/spec sheets
   - freight/installation/warranty clarity
4. Redesign category pages around filters and education.

### P2

1. Create manufacturer-image candidate crawler/scorer.
2. Review top 100 revenue-relevant SKUs manually.
3. Move product assets to object storage/CDN.
4. Build admin image-review queue.
5. Add lifecycle statuses: approved image, low-quality image, missing manufacturer image.

## Practical First Build Recommendation

Before major redesign, build a focused design/image sprint:

1. Replace `/design-tool` with Fireplace Matchmaker copy and lead capture.
2. Redesign homepage and product cards using existing components.
3. Build `scripts/find-manufacturer-images.mjs` to generate candidates for top SKUs.
4. Manually approve image candidates for the top 25 fireplace products.
5. Update those top products first so the site immediately looks more credible.
