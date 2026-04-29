import Link from "next/link";
import Image from "next/image";
import { Facebook, Instagram, Youtube, Phone, Mail, MapPin, Clock, ShieldCheck, Truck, Wrench } from "lucide-react";
import { defaultStoreConfig, productCategories } from "@/lib/store-config";

const footerLinkClass = "text-sm leading-6 text-[#d8c7b2] transition hover:text-[#ffb36b]";
const footerHeadingClass = "mb-4 text-xs font-black uppercase tracking-[0.22em] text-[#ff8a24]";
const footerCategoryLabels: Record<string, string> = {
  fireplaces: "Fireplace Categories",
  inserts: "Insert Options",
  stoves: "Stove Collection",
  outdoor: "Outdoor Fire Features",
  accessories: "Hearth Accessories",
  parts: "Replacement Parts Catalog",
};

export function Footer({ lightLogoUrl }: { lightLogoUrl?: string }) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden bg-[#0b0b0a] text-[#d8c7b2]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_14%_8%,rgba(255,122,24,0.16),transparent_28%),radial-gradient(circle_at_84%_28%,rgba(255,179,107,0.10),transparent_24%)]" />

      <div className="relative border-y border-[#ff7a18]/20 bg-[#11100e]/90">
        <div className="mx-auto flex max-w-[1640px] flex-col gap-5 px-4 py-8 md:px-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.26em] text-[#ff8a24]">Aaron&apos;s Fireplace Co.</p>
            <h3 className="mt-2 text-2xl font-black tracking-[-0.04em] text-white">Need help before you order?</h3>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-[#d8c7b2]">
              Fireplaces, parts, service, and contractor projects can get technical. Send us the model number, photos, or project details and we&apos;ll help point you in the right direction.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link href="/contact" className="inline-flex justify-center bg-[#ff7a18] px-6 py-4 text-sm font-black uppercase tracking-[0.14em] text-black transition hover:bg-[#ff963f]">
              Contact Us
            </Link>
            <Link href="/service-appointment" className="inline-flex justify-center border border-white/20 px-6 py-4 text-sm font-black uppercase tracking-[0.14em] text-white transition hover:border-[#ff7a18] hover:text-[#ffb36b]">
              Book Service
            </Link>
          </div>
        </div>
      </div>

      <div className="relative mx-auto max-w-[1640px] px-4 py-14 md:px-5">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-[1.15fr_0.8fr_0.9fr_0.85fr]">
          <div className="border border-white/10 bg-white/[0.04] p-6 backdrop-blur">
            <Image
              src={lightLogoUrl ?? "/logo.png"}
              alt={defaultStoreConfig.storeName}
              width={260}
              height={120}
              className="h-20 w-auto object-contain"
            />
            <p className="mt-5 max-w-sm text-sm leading-6 text-[#d8c7b2]">{defaultStoreConfig.tagline}</p>

            <div className="mt-6 space-y-3 text-sm">
              <a href={`tel:${defaultStoreConfig.phone}`} className="flex items-center gap-3 text-white transition hover:text-[#ffb36b]">
                <Phone className="h-4 w-4 text-[#ff7a18]" />
                {defaultStoreConfig.phone}
              </a>
              <a href={`mailto:${defaultStoreConfig.email}`} className="flex items-center gap-3 text-white transition hover:text-[#ffb36b]">
                <Mail className="h-4 w-4 text-[#ff7a18]" />
                {defaultStoreConfig.email}
              </a>
              <div className="flex items-start gap-3 text-white">
                <MapPin className="mt-0.5 h-4 w-4 text-[#ff7a18]" />
                <span>
                  {defaultStoreConfig.address.street}
                  <br />
                  {defaultStoreConfig.address.city}, {defaultStoreConfig.address.state} {defaultStoreConfig.address.zip}
                </span>
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              {defaultStoreConfig.social.facebook && (
                <a href={defaultStoreConfig.social.facebook} target="_blank" rel="noopener noreferrer" className="border border-white/10 bg-white/[0.06] p-2 text-white transition hover:border-[#ff7a18] hover:text-[#ffb36b]" aria-label="Facebook">
                  <Facebook className="h-5 w-5" />
                </a>
              )}
              {defaultStoreConfig.social.instagram && (
                <a href={defaultStoreConfig.social.instagram} target="_blank" rel="noopener noreferrer" className="border border-white/10 bg-white/[0.06] p-2 text-white transition hover:border-[#ff7a18] hover:text-[#ffb36b]" aria-label="Instagram">
                  <Instagram className="h-5 w-5" />
                </a>
              )}
              {defaultStoreConfig.social.youtube && (
                <a href={defaultStoreConfig.social.youtube} target="_blank" rel="noopener noreferrer" className="border border-white/10 bg-white/[0.06] p-2 text-white transition hover:border-[#ff7a18] hover:text-[#ffb36b]" aria-label="YouTube">
                  <Youtube className="h-5 w-5" />
                </a>
              )}
            </div>
          </div>

          <div>
            <h4 className={footerHeadingClass}>Shop By Category</h4>
            <ul className="space-y-2">
              {productCategories.map((category) => (
                <li key={category.id}>
                  <Link href={`/category/${category.slug}`} className={footerLinkClass}>
                    {footerCategoryLabels[category.id] ?? category.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/sale" className="text-sm font-black uppercase tracking-[0.12em] text-[#ff8a24] transition hover:text-[#ffb36b]">
                  Sale Items
                </Link>
              </li>
              <li>
                <Link href="/brand" className={footerLinkClass}>
                  Shop All Brands
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className={footerHeadingClass}>Customer Service</h4>
            <ul className="space-y-2">
              {[
                ["About Us", "/about"],
                ["Contact Us", "/contact"],
                ["Shipping Information", "/shipping"],
                ["Returns & Exchanges", "/returns"],
                ["Frequently Asked Questions", "/faq"],
                ["Warranty Information", "/warranty"],
                ["Professional Installation", "/installation"],
              ].map(([label, href]) => (
                <li key={href}>
                  <Link href={href} className={footerLinkClass}>{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className={footerHeadingClass}>Store Hours</h4>
            <div className="space-y-3 text-sm text-[#d8c7b2]">
              <div className="flex items-center gap-3"><Clock className="h-4 w-4 text-[#ff7a18]" /> Mon-Fri: {defaultStoreConfig.business.hours.weekdays}</div>
              <div className="flex items-center gap-3"><Clock className="h-4 w-4 text-[#ff7a18]" /> Saturday: {defaultStoreConfig.business.hours.saturday}</div>
              <div className="flex items-center gap-3"><Clock className="h-4 w-4 text-[#ff7a18]" /> Sunday: {defaultStoreConfig.business.hours.sunday}</div>
            </div>

            <h4 className={`${footerHeadingClass} mt-8`}>Services</h4>
            <ul className="space-y-2">
              <li><Link href="/showrooms" className={footerLinkClass}>Visit Our Showroom</Link></li>
              <li><Link href="/local/fireplace-store-republic-mo" className={footerLinkClass}>Republic Fireplace Store</Link></li>
              <li><Link href="/local/fireplace-store-springfield-mo" className={footerLinkClass}>Springfield Fireplace Store</Link></li>
              <li><Link href="/installation" className={footerLinkClass}>Installation Planning</Link></li>
              <li><Link href="/local/fireplace-installation-springfield-mo" className={footerLinkClass}>Springfield Installation Help</Link></li>
              <li><Link href="/financing" className={footerLinkClass}>Financing Options</Link></li>
              <li><Link href="/trade-program" className={footerLinkClass}>Trade Program</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-10 grid gap-4 border-y border-white/10 py-8 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: Truck, title: "Nationwide Parts", text: "Localized part photos and SKU search" },
            { icon: ShieldCheck, title: "Real Company", text: "Republic, Missouri showroom" },
            { icon: Wrench, title: "Service Support", text: "Gas, wood, and pellet service requests" },
            { icon: Phone, title: "Expert Help", text: "Call before you order if unsure" },
          ].map(({ icon: Icon, title, text }) => (
            <div key={title} className="border border-white/10 bg-white/[0.04] p-5">
              <Icon className="h-6 w-6 text-[#ff7a18]" />
              <p className="mt-4 font-black text-white">{title}</p>
              <p className="mt-1 text-sm text-[#d8c7b2]">{text}</p>
            </div>
          ))}
        </div>

        <div className="flex flex-col items-center justify-between gap-4 pt-6 text-sm text-[#b7a795] md:flex-row">
          <div>© {currentYear} {defaultStoreConfig.storeName}. All rights reserved.</div>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/privacy" className="transition hover:text-[#ffb36b]">Privacy Policy</Link>
            <Link href="/terms" className="transition hover:text-[#ffb36b]">Terms of Service</Link>
            <Link href="/accessibility" className="transition hover:text-[#ffb36b]">Accessibility</Link>
          </div>
          <span>Made in USA</span>
        </div>
      </div>
    </footer>
  );
}
