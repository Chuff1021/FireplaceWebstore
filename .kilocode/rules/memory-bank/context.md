# Active Context: Aaron's Hearth and Home — E-Commerce Website

## Current State

**Template Status**: ✨ Luxury Rebrand + AI Design Tool + Placeholder-First Bulk Catalog Workflow + Category Route Reliability / Premium Gas Fireplaces Category UX

The project has been rebranded from the generic "Elite Fireplace Store" template to **Aaron's Hearth and Home** in Republic, Missouri. All placeholder emojis and gradient backgrounds have been replaced with real stock photography from Unsplash. The SVG logo, product images, category images, and hero background are all in place.

## Recently Completed

- [x] White-label configuration system (`src/lib/store-config.ts`) — store branding, contact, theme colors, SEO, categories, sample products
- [x] Shopping cart with Zustand (`src/lib/cart-store.ts`) — persistent cart, add/remove/update, totals with tax & shipping
- [x] Header with mega-menu navigation, search bar, mobile responsive (`src/components/layout/Header.tsx`)
- [x] Cart slide-out panel (`src/components/layout/CartSlideout.tsx`)
- [x] Footer with newsletter, categories, contact info, trust badges (`src/components/layout/Footer.tsx`)
- [x] Homepage sections: Hero, BrandsBar, CategoryGrid, FeaturedProducts, PromoBanner
- [x] Product catalog page with sidebar filters and sorting (`/category/[slug]`)
- [x] Product detail page with image gallery, tabs (description/specs/reviews), related products (`/product/[slug]`)
- [x] Full cart page with quantity controls and order summary (`/cart`)
- [x] Multi-step checkout flow: shipping → payment → review (`/checkout`)
- [x] ProductCard component with badges, ratings, quick-add-to-cart
- [x] 6 sample products across categories
- [x] **Rebranded to Aaron's Fireplace Co** (Republic, MO) — store name, tagline, contact info, SEO, theme colors
- [x] **Created SVG logo** (`public/logo.svg`) — flame icon + "Aaron's FIREPLACE CO" text
- [x] **Added Unsplash stock photos** — 7 product images, 25 category images, 2 hero images
- [x] **Updated Header** to use SVG logo via `next/image` instead of emoji
- [x] **Updated Footer** to use SVG logo with inverted colors
- [x] **Updated Hero** with background image overlay and Republic, MO copy
- [x] **Updated CategoryGrid** to show real category images instead of emojis
- [x] **Updated ProductCard** to display product images instead of emoji placeholders
- [x] **Updated product detail page** with real image gallery and thumbnails
- [x] TypeScript strict mode — zero errors
- [x] ESLint — zero errors/warnings

## Current Structure

| File/Directory | Purpose | Status |
|----------------|---------|--------|
| `src/lib/store-config.ts` | White-label config for Aaron's Hearth and Home | ✅ Branded |
| `src/lib/cart-store.ts` | Zustand cart store (persistent) | ✅ Ready |
| `src/components/layout/Header.tsx` | Header with SVG logo, nav, search, cart | ✅ Updated |
| `src/components/layout/Footer.tsx` | Footer with SVG logo, newsletter, links | ✅ Updated |
| `src/components/layout/CartSlideout.tsx` | Slide-out cart panel | ✅ Ready |
| `src/components/ui/ProductCard.tsx` | Product card with real images | ✅ Updated |
| `src/components/sections/Hero.tsx` | Homepage hero with background image | ✅ Updated |
| `src/components/sections/CategoryGrid.tsx` | Category grid with real images | ✅ Updated |
| `src/components/sections/FeaturedProducts.tsx` | Featured products section | ✅ Ready |
| `src/components/sections/PromoBanner.tsx` | Promotional banners | ✅ Ready |
| `src/components/sections/BrandsBar.tsx` | Brand logos bar | ✅ Ready |
| `src/app/page.tsx` | Homepage | ✅ Ready |
| `src/app/layout.tsx` | Root layout with Header/Footer | ✅ Ready |
| `src/app/category/[slug]/page.tsx` | Category catalog page | ✅ Ready |
| `src/app/product/[slug]/page.tsx` | Product detail page with image gallery | ✅ Updated |
| `src/app/cart/page.tsx` | Shopping cart page | ✅ Ready |
| `src/app/checkout/page.tsx` | Checkout flow | ✅ Ready |
| `public/logo.svg` | Aaron's Hearth and Home SVG logo | ✅ New |
| `public/products/` | 7 product stock photos (Unsplash) | ✅ New |
| `public/categories/` | 25 category stock photos (Unsplash) | ✅ New |
| `public/hero/` | 2 hero background images (Unsplash) | ✅ New |

## White-Label System

The template is branded for Aaron's Hearth and Home by editing `src/lib/store-config.ts`:
- **Store name**: Aaron's Hearth and Home
- **Tagline**: Republic, Missouri's Trusted Fireplace & Heating Experts
- **Contact**: (417) 555-0199, info@aaronshearthandhome.com
- **Address**: 100 E Hines St, Republic, MO 65738
- **Theme colors**: Deep Red primary (#b91c1c), Navy Blue secondary (#1e3a5f), Amber accent
- **SEO**: Optimized for "Aaron's Hearth and Home" and "Republic Missouri fireplace"
- **Logo**: SVG at `/logo.svg` with flame icon and company name

## Recently Completed (Session 3)

- [x] Fixed all product/category/hero images (re-downloaded proper fireplace photos from Unsplash)
- [x] Created About Us page (`/about`) with story, services, contact info
- [x] Created Contact page (`/contact`) with form (name, email, phone, subject, message)
- [x] Created FAQ page (`/faq`) with accordion-style Q&A across 5 categories
- [x] Created Shipping & Delivery page (`/shipping`)
- [x] Created Privacy Policy page (`/privacy`)
- [x] Created Terms of Service page (`/terms`)
- [x] Created 404 Not Found page (`src/app/not-found.tsx`)
- [x] Created Search page (`/search`) with live product/category search using `useMemo`
- [x] Updated Footer to include About Us link
- [x] Zero TypeScript errors, zero ESLint errors
- [x] Committed and pushed (commit `301d6e1`)

## Recently Completed (Session 4)

- [x] Added database integration (Drizzle ORM + SQLite via `@kilocode/app-builder-db`)
- [x] Created DB schema: `products`, `categories`, `admin_users`, `admin_sessions` tables (`src/db/schema.ts`)
- [x] Created DB client (`src/db/index.ts`), migration script (`src/db/migrate.ts`), Drizzle config (`drizzle.config.ts`)
- [x] Generated SQL migrations (`src/db/migrations/`)
- [x] Built password-protected admin dashboard at `/admin`
- [x] Admin login page (`/admin/login`) with session cookie auth
- [x] Admin products list page (`/admin/products`) — view all products
- [x] Admin add product page (`/admin/products/new`) with image upload
- [x] Admin edit product page (`/admin/products/[id]/edit`)
- [x] Admin categories list page (`/admin/categories`)
- [x] Admin add/edit category pages with image upload
- [x] Image upload API (`/api/admin/upload`) — saves to `public/uploads/`
- [x] Products CRUD API (`/api/admin/products`, `/api/admin/products/[id]`)
- [x] Categories CRUD API (`/api/admin/categories`, `/api/admin/categories/[id]`)
- [x] Public products API (`/api/products`) for storefront
- [x] Default admin credentials: username `admin`, password `admin123` (change via `ADMIN_PASSWORD` env var)
- [x] Zero TypeScript errors, zero ESLint errors

## Recently Completed (Session 5)

- [x] Redesigned logo to luxury/high-end SVG (`public/logo.svg`) — gradient gold flame, elegant serif typography (Didot/Playfair Display), gold divider line
- [x] Created light/inverted logo for footer (`public/logo-light.svg`) — white text + gold flame on dark backgrounds
- [x] Updated Header to use new logo with larger sizing (h-11/h-14)
- [x] Updated Footer to use `logo-light.svg` directly instead of CSS invert filter
- [x] Added "✦ Design Tool" link to Header desktop nav and mobile menu
- [x] Created AI Design Tool page (`/design-tool`) — 7-step wizard:
  - Step 1: Fuel type (gas/wood/electric/pellet/unsure)
  - Step 2: Room size with BTU guidance
  - Step 3: Design style (traditional/modern/rustic/transitional)
  - Step 4: Budget range
  - Step 5: Installation type (new/replace/insert)
  - Step 6: Photo upload with drag-and-drop + AI visualization generation
  - Step 7: Results with product recommendations + room visualization + CTA
- [x] AI visualization flow: photo upload → simulated AI processing → overlay result (ready for real API integration)
- [x] Zero TypeScript errors, zero ESLint errors

## Recently Completed (Session 6)

- [x] Created `DesignToolBanner` section component (`src/components/sections/DesignToolBanner.tsx`) — full-width dark banner with AI badge, feature list, CTA button linking to `/design-tool`, and a live wizard mockup card on the right
- [x] Added `DesignToolBanner` to homepage (`src/app/page.tsx`) between `FeaturedProducts` and `PromoBanner`
- [x] Zero TypeScript errors, zero ESLint errors
- [x] Committed and pushed (commit `4b2731a`)

## Recently Completed (Session 7)

- [x] Created logo upload API route (`src/app/api/admin/logo/route.ts`) — POST saves uploaded file as `public/logo-custom.{ext}` or `public/logo-custom-light.{ext}`; GET returns current custom logo URLs
- [x] Created `src/lib/logo-resolver.ts` — server-side utility that checks for custom logo files and falls back to default SVGs
- [x] Created admin Branding & Logo settings page (`src/app/admin/settings/page.tsx`) — drag-and-drop upload UI for main logo and footer logo, with live preview and status feedback
- [x] Added "Branding & Logo" link to `AdminSidebar.tsx` (Settings icon)
- [x] Updated `Header` component to accept optional `logoUrl` prop
- [x] Updated `Footer` component to accept optional `lightLogoUrl` prop
- [x] Updated root layout (`src/app/layout.tsx`) to resolve logo URLs server-side via `logo-resolver.ts` and pass to Header/Footer
- [x] Zero TypeScript errors, zero ESLint errors
- [x] Committed and pushed (commit `3b698b7`)

## Recently Completed (Session 8)

- [x] Added default product placeholder image asset (`public/products/placeholder-product.svg`)
- [x] Added shared product image resolver utility (`src/lib/product-images.ts`) with fallback helpers
- [x] Updated storefront/admin image render points to use placeholder fallback when product images are missing:
  - `src/components/ui/ProductCard.tsx`
  - `src/app/product/[slug]/page.tsx`
  - `src/app/search/page.tsx`
  - `src/app/design-tool/page.tsx`
  - `src/app/admin/page.tsx`
  - `src/app/admin/products/page.tsx`
- [x] Extended existing import pipeline with local CSV import support (`src/lib/catalog-import.ts`) using required columns: `brand, model, sku, name, category, price` (optional `description`, `image`)
- [x] Added CSV import path through existing imports API (`src/app/api/admin/imports/route.ts`) via `importType: "csv"` and repo-local `csvPath`
- [x] Ensured imported rows without images are assigned placeholder image automatically
- [x] Added starter seed CSV dataset with major fireplace brands/models/SKUs (`data/starter-fireplace-catalog.csv`)
- [x] Added direct “replace photo by SKU” API (`src/app/api/admin/products/by-sku/image/route.ts`)
- [x] Updated admin imports UI (`src/app/admin/imports/page-client.tsx`) with:
  - Starter CSV import controls + instructions
  - CSV path input
  - SKU photo upload + assign workflow
  - Clarified placeholder-first process and retained optional demo JSON import
- [x] Ran `bun typecheck` and `bun lint` successfully

## Recently Completed (Session 9)

- [x] Fixed category/subcategory navigation 404s caused by links targeting non-existent nested route pattern (`/category/[parent]/[child]`)
- [x] Updated header desktop/mobile dropdown links to use supported single-slug route pattern (`/category/[slug]`) for subcategories
- [x] Updated category page subcategory chips to link to `/category/[subcategory-slug]`
- [x] Enhanced category page route resolution so a single slug can represent either top-level category or subcategory
- [x] Ensured target routes resolve reliably: `/category/fireplaces`, `/category/gas-fireplaces`, `/category/wood-fireplaces`, plus all rendered category/subcategory links from nav/grid
- [x] Reworked category product listing from sparse cards to denser catalog rows with Product / Make / Model / SKU / Price + inline add-to-cart
- [x] Added Fireplaces quick-browse links (All/Gas/Wood) on homepage category section and dedicated fireplace fuel jump links on category pages
- [x] Ran `bun typecheck` and `bun lint` successfully after route/catalog updates

## Recently Completed (Session 10)

- [x] Rebranded storefront/admin visible brand naming to **Aaron's Hearth and Home**
- [x] Replaced primary logo asset (`public/logo.svg`) with a modern premium mark (framed flame crest, refined serif + sans pairing, premium gold charcoal palette)
- [x] Replaced footer/light logo asset (`public/logo-light.svg`) with matching premium dark-background variant (white headline text + warm gold accents)
- [x] Updated white-label branding config (`src/lib/store-config.ts`) for store name + SEO title/description + keyword brand string + branded contact/social handles
- [x] Updated admin metadata/title strings to new brand (`src/app/admin/layout.tsx`, `src/app/admin/login/page.tsx`)
- [x] Preserved logo override compatibility by keeping existing resolver flow unchanged (`src/lib/logo-resolver.ts`, `src/app/layout.tsx`, `src/components/layout/Header.tsx`, `src/components/layout/Footer.tsx`)
- [x] Ran `bun typecheck` and `bun lint` successfully

## Recently Completed (Session 11)

- [x] Redesigned category page experience with a premium, modern layout style for gas fireplaces (`src/app/category/[slug]/page.tsx`)
- [x] Added large visual hero section, stronger spacing/typography hierarchy, and trust badges for category landing context
- [x] Upgraded product listing from compact rows to high-visual cards with larger images, richer metadata blocks, and clearer CTAs
- [x] Added functional client-side filtering (brand, price buckets, in-stock) with reset flow and refined toolbar controls
- [x] Preserved existing category route support and overall store branding while improving perceived product/image quality presentation
- [x] Ran `bun typecheck` and `bun lint` successfully

## Recently Completed (Session 12)

- [x] Refined `gas-fireplaces` category UX in `src/app/category/[slug]/page.tsx` to more closely mirror high-end marketplace/category layouts (hero polish, premium filter panel, and cleaner product browsing rhythm)
- [x] Added gas-fireplaces-specific top-of-page messaging and quick capability highlights (fuel, installation types, support)
- [x] Switched gas-fireplaces product rendering to a denser premium card grid while preserving existing behavior for other categories
- [x] Enhanced toolbar/filter visual language for gas-fireplaces (badge/check/filter iconography and warmer premium palette)
- [x] Kept existing routing/data/filter logic intact and scoped styling emphasis to gas-fireplaces page state
- [x] Ran `bun typecheck` and `bun lint` successfully

## Recently Completed (Session 13)

- [x] Updated gas fireplaces category listing layout in `src/app/category/[slug]/page.tsx` to a more marketplace-style horizontal product row format inspired by fireplaces.com
- [x] Kept changes scoped to `/category/gas-fireplaces` rendering while preserving existing category behavior for non-gas pages
- [x] Added right-side pricing/action panel for gas fireplace cards with stronger purchase CTAs and product detail link placement
- [x] Added placeholder-style capability chips/metadata blocks for gas products so layout remains stable before full catalog import
- [x] Ran `bun typecheck` and `bun lint` successfully

## Next Steps / Future Enhancements

- [ ] Connect real AI image generation API (OpenAI DALL-E or Stability AI) for room visualization
- [ ] Replace placeholder phone/email/address with real Aaron's Hearth and Home contact info
- [ ] Add user's actual logo PNG (luxury SVG now in place)
- [ ] Add more products via admin dashboard (currently only 6 sample products in config)
- [ ] Add user authentication (login/register)
- [ ] Add wishlist functionality
- [ ] Add payment gateway integration (Stripe)
- [ ] Add order confirmation/tracking pages
- [ ] Add product comparison feature
- [ ] Add recently viewed products
- [ ] Add email notifications (order confirmation, shipping updates)
- [ ] Replace stock photos with actual Aaron's Hearth and Home product photos

## Dependencies

- `zustand` — Client-side state management (cart)
- `lucide-react` — Icon library
- `clsx` — Conditional class names utility

## Session History

| Date | Changes |
|------|---------|
| Initial | Template created with base setup |
| 2026-02-24 | Built complete fireplace e-commerce white-label template |
| 2026-02-24 | Rebranded to Aaron's Fireplace Co (Republic, MO), added SVG logo, Unsplash stock photos for products/categories/hero, replaced all emoji placeholders with real images |
| 2026-03-09 | Added placeholder-first bulk catalog workflow: local CSV import seeding, default product image fallback, starter catalog CSV, and admin SKU photo replacement flow |
| 2026-03-09 | Fixed category/subcategory route mismatches causing 404s and converted category listing UX to a denser make/model/price catalog layout with improved Fireplaces → Gas/Wood discoverability |
| 2026-03-09 | Rebranded to Aaron's Hearth and Home with refreshed premium primary/footer SVG logos and updated site/admin branding text |
