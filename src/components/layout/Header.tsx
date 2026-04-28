"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Search, ShoppingCart, Menu, X, Phone, ChevronDown } from "lucide-react";
import { useCartStore } from "@/lib/cart-store";
import { defaultStoreConfig, productCategories } from "@/lib/store-config";

export function Header({ logoUrl }: { logoUrl?: string }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const { getItemCount, toggleCart } = useCartStore();
  const addressLine = `${defaultStoreConfig.address.street}, ${defaultStoreConfig.address.city}, ${defaultStoreConfig.address.state} ${defaultStoreConfig.address.zip}`;
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(addressLine)}`;

  return (
    <>
      <div className="hidden bg-[#11100e] text-white md:block">
        <div className="mx-auto flex max-w-[1640px] items-center justify-between px-5 py-2 text-[13px]">
          <div className="flex items-center divide-x divide-white/20">
            {[
              "Free Shipping on orders over $99",
              "110% Low Price Guaranteed",
              "Expert Sales Support",
            ].map((message) => (
              <span key={message} className="px-7 first:pl-0 last:pr-0">
                {message}
              </span>
            ))}
          </div>

        </div>
      </div>

      <header className="sticky top-0 z-50 border-b border-[#ff7a18]/25 bg-[#080808] shadow-lg shadow-black/20">
        <div className="mx-auto max-w-[1640px] px-4 md:px-5">
          <div className="flex h-20 items-center justify-between gap-4 md:h-24">
            <button
              className="p-2 text-white transition hover:text-[#ffb36b] lg:hidden"
              onClick={() => setIsMenuOpen((current) => !current)}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>

            <Link href="/" className="flex w-[180px] shrink-0 items-center self-stretch py-2 xl:w-[220px]">
              <Image
                src={logoUrl ?? defaultStoreConfig.logo}
                alt={defaultStoreConfig.storeName}
                width={640}
                height={591}
                className="h-full w-auto max-w-full object-contain drop-shadow-[0_10px_24px_rgba(0,0,0,0.45)]"
                priority
              />
            </Link>

            <div className="hidden min-w-[360px] flex-1 lg:block xl:pl-4">
              <form action="/search" method="GET" className="mx-auto w-full max-w-[980px]">
                <div className="flex h-12 items-center border border-[#ff7a18]/45 bg-[#fffaf2] shadow-inner shadow-black/10">
                  <input
                    type="text"
                    name="q"
                    placeholder="Search by brand, model, SKU, or part number"
                    className="h-full min-w-0 flex-1 bg-transparent px-4 text-sm text-[#201914] outline-none placeholder:text-[#7a6a5a]"
                  />
                  <button
                    type="submit"
                    className="flex h-full w-14 items-center justify-center border-l border-[#e0cbb4] bg-[#ff7a18] text-black transition hover:bg-[#ff963f]"
                    aria-label="Search"
                  >
                    <Search className="h-4 w-4" />
                  </button>
                </div>
              </form>
            </div>

            <div className="hidden items-center gap-5 lg:flex">
              <Link
                href="/contractor-portal"
                className="inline-flex items-center justify-center rounded-full border border-white/20 bg-white/8 px-4 py-2 text-xs font-black uppercase tracking-[0.12em] text-white shadow-[0_12px_30px_rgba(0,0,0,0.18)] transition hover:border-[#ff7a18] hover:text-[#ffb36b]"
              >
                Contractor Portal
              </Link>

              <div className="text-right text-sm text-[#e7d9c7]">
                <p>Order Online or Call</p>
                <a
                  href={`tel:${defaultStoreConfig.phone}`}
                  className="block font-semibold text-white hover:text-[#ffb36b]"
                >
                  {defaultStoreConfig.phone}
                </a>
                <a
                  href={mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1 block text-xs text-[#ffb36b] hover:text-white"
                >
                  {defaultStoreConfig.address.street}, {defaultStoreConfig.address.city}
                </a>
              </div>

              <button
                className="relative flex items-center gap-2 text-white transition-colors hover:text-[#ffb36b]"
                onClick={toggleCart}
                aria-label="Shopping cart"
              >
                <ShoppingCart className="h-5 w-5" />
                <span className="text-sm">Cart</span>
                {getItemCount() > 0 && (
                  <span className="absolute -right-2 -top-2 flex h-[18px] w-[18px] items-center justify-center rounded-full border-2 border-black bg-[#ff7a18] text-[10px] font-semibold text-black">
                    {getItemCount()}
                  </span>
                )}
              </button>
            </div>

            <div className="flex items-center gap-2 lg:hidden">
              <button
                className="p-2"
                onClick={() => setIsSearchOpen((current) => !current)}
                aria-label="Search"
              >
                <Search className="h-5 w-5 text-white" />
              </button>
              <button
                className="relative p-2"
                onClick={toggleCart}
                aria-label="Shopping cart"
              >
                <ShoppingCart className="h-5 w-5 text-white" />
                {getItemCount() > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-[18px] w-[18px] items-center justify-center rounded-full border-2 border-black bg-[#ff7a18] text-[10px] font-semibold text-black">
                    {getItemCount()}
                  </span>
                )}
              </button>
            </div>
          </div>

          {isSearchOpen && (
            <div className="border-t border-black/10 py-3 lg:hidden">
              <form action="/search" method="GET" className="flex h-11 items-center border border-[#bdbdbd] bg-white">
                <input
                  type="text"
                  name="q"
                  placeholder="Search by brand, model, or keyword"
                  className="h-full min-w-0 flex-1 px-4 text-sm text-[#424242] outline-none"
                  autoFocus
                />
                <button
                  type="submit"
                  className="flex h-full w-12 items-center justify-center border-l border-[#bdbdbd] text-[#424242]"
                  aria-label="Search"
                >
                  <Search className="h-4 w-4" />
                </button>
              </form>
            </div>
          )}
        </div>

        <div className="hidden border-t border-white/10 bg-[#15120f] lg:block">
          <nav className="mx-auto flex h-10 max-w-[1640px] items-center px-5">
            <Link
              href="/contractor-portal"
              className="mr-5 flex h-10 items-center text-xs font-semibold uppercase tracking-[0.08em] text-[#ffb36b] transition-colors hover:text-white"
            >
              Contractor Portal
            </Link>
            {productCategories.slice(0, 5).map((category) => (
              <div
                key={category.id}
                className="relative mr-5"
                onMouseEnter={() => setActiveDropdown(category.id)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <Link
                  href={`/category/${category.slug}`}
                  className="flex h-10 items-center gap-1 text-xs font-semibold uppercase tracking-[0.08em] text-[#f3e7d4] transition-colors hover:text-[#ffb36b]"
                >
                  {category.name}
                  {category.subcategories && <ChevronDown className="h-4 w-4" />}
                </Link>

                {category.subcategories && activeDropdown === category.id && (
                  <div className="absolute left-0 top-full z-20 min-w-[240px] border border-[#d7d7d7] bg-white py-2 shadow-lg">
                    {category.subcategories.map((subcategory) => (
                      <Link
                        key={subcategory.id}
                        href={`/category/${subcategory.slug}`}
                        className="block px-4 py-2 text-sm text-[#424242] transition-colors hover:bg-[#faf7f1] hover:text-[#a54210]"
                      >
                        {subcategory.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <Link
              href="/category/parts"
              className="mr-5 flex h-10 items-center text-xs font-semibold uppercase tracking-[0.08em] text-[#f3e7d4] transition-colors hover:text-[#ffb36b]"
            >
              Parts Department
            </Link>
          </nav>
        </div>

        {isMenuOpen && (
          <div className="border-t border-black/10 bg-white lg:hidden">
            <nav className="space-y-2 px-4 py-4">
              <Link
                href="/contractor-portal"
                className="block py-2 text-sm font-bold text-[#a54210]"
                onClick={() => setIsMenuOpen(false)}
              >
                Contractor Portal
              </Link>
              {productCategories.map((category) => (
                <div key={category.id}>
                  <Link
                    href={`/category/${category.slug}`}
                    className="block py-2 text-sm font-medium text-[#212121]"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {category.name}
                  </Link>
                  {category.subcategories && (
                    <div className="pl-4">
                      {category.subcategories.map((subcategory) => (
                        <Link
                          key={subcategory.id}
                          href={`/category/${subcategory.slug}`}
                          className="block py-1.5 text-sm text-[#5b5d5b]"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          {subcategory.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </nav>
          </div>
        )}
      </header>
    </>
  );
}
