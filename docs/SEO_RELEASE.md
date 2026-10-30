# Aaron’s SEO release — October 30, 2026

## Implemented

- Server-rendered product and category content; unique product/category titles, descriptions, canonical URLs and social metadata. Existing product URLs retained.
- Real server 404s for absent products, brands, models, categories and out-of-range catalog pages. Filter/search and private checkout pages are deliberately noindex; ordinary pagination has its own canonical URL.
- Product, breadcrumb, article, business and local service JSON-LD. No fabricated reviews, product IDs, offers, ratings, live-stock claims or nationwide installation claims. Product offers only emit when actual automatic checkout is eligible.
- The central catalog uses imported product sources rather than the remaining demonstration FP-1000 stock record.
- Removed repeated template reviews and the unsupported header price guarantee / blanket Made in USA footer. Imported supplier review scores are not republished as Aaron’s reviews.
- Crawlable parts and appliance pagination; server-populated parts results; twelve manufacturer hubs at `/parts/[brand]`, an all-manufacturer directory and contextual links.
- Twenty-three model-reference collections and 61 part/model associations. Current source IDs and SKUs were checked on 59 pages. Restrictive application, serial and package notes remain explicit; uncertain title-based matches and four source 404s were excluded. See `SEO_MODEL_REVIEW.md`.
- Selection content for the nine priority category families, eight practical buying/identification guides and two interactive worksheets. Insert measurements carry into the existing contact form for review before submission.
- Real Springfield metro installation context and the Republic showroom address. National product sales are stated separately; shipping eligibility is confirmed for each order.
- Sitemap and robots discovery. Sitemap retains useful out-of-stock pages and excludes clearly unrelated pool/spa and grill parts, private paths, query variations and missing pages. No invented last-modified timestamps. Existing URLs for unrelated imports remain accessible, with noindex rather than deletion.
- Bounded signed live-inventory reads and discovered-only pages preserve the scanner’s published additions without fetching 32K offers for a single product. Owner overrides and payment gates remain intact. Appliance data loads in parallel; product identities are indexed per worker.
- First-party, session-level channel and landing-page context on carts and new contact submissions. The existing private HearthOS cart report shows sources and landing paths. It does not count every visitor, treat a phone click as a sale or treat an authorization as captured revenue. No full referring URL, search query or ad identifier is retained. No customer details are exported to generic analytics.

## Verification

- Eight storefront regression/SEO tests, including JSON-LD escaping, conservative offers and safe attribution.
- Twenty-two backend commerce tests through local PostgreSQL, plus 235 security tests.
- TypeScript, targeted ESLint, production Next builds and `scripts/verify-seo.mjs` (initial HTML, metadata, schema JSON, real 404s, filter noindex, legacy brand redirect, exact-SKU search, MA-212400 and sitemap uniqueness).
- Phone-size browser checks for manufacturer changes, page 2 URL/canonical/results, worksheet summary and contact prefill. No contact form submission or production payment is needed for these checks.
- Additive `cart-attribution.sql` migration applied and verified; staged backend HMAC smoke passed (bounded/slug/discovery reads, MA override, private reports, attribution persistence, duplicate prevention and disabled payments). Synthetic anonymous QA cart was removed.
- Google Search Console in the current Chrome account opened to its welcome/setup page. No property access, search traffic, index coverage or GBP management is claimed. No verification token, Google ownership permission or listing change has been applied.

## Account and evidence work still required

1. Select/sign into the Google account that should own the website’s Search Console property. Verify ownership, check current canonical/index coverage and submit `https://aaronsfireplaceco.com/sitemap.xml`. Use the Google verification instructions for that account; do not post account credentials into chat. Only then establish query, landing-page and seasonal comparison baselines.
2. Connect the existing Google Business Profile. Confirm actual hours (website currently 9–5 weekdays; a directory differs), categories, service area and business contact details. Keep one real Republic location; do not create fake city offices. Owner-provided certification/dealer credentials need current evidence before expansion into new claims or directory submissions.
3. Merchant Center/free online listings remain an activation task: finish actual tax registrations, payment/shipping verification and AK/HI/freight/product eligibility. A quote-only checkout is not a verified merchant checkout. This SEO release does not activate Square charges or assume a nationwide flat sales-tax rate.
4. Supply original completed-project photos, model-plate/connector photos with permission, real service cases, qualified technical review and genuine customer reviews. No synthetic jobs, technician endorsements or reviews were published.
5. Manufacturer directory and earned-reference outreach requires eligibility and explicit authorization to contact those parties. Drafts are in `SEO_GROWTH_WORKLIST.md`; none were sent, and no links/subscriptions were purchased.
6. Continue source review before adding more model mappings or supersession chains. Unknown matches stay unknown. The model-reference review date is separate from the scanner’s current availability check.

SEO is ongoing: the code and first content release can be shipped now; rankings, new customer reviews, links and future source evidence cannot be marked complete in advance. No #1 position or traffic lift is guaranteed.
