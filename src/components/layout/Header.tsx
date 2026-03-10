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

  return (
    <>
      <div className="hidden bg-[#212121] text-white md:block">
        <div className="mx-auto flex max-w-[1640px] items-center justify-between px-5 py-2 text-[13px]">
          <div className="flex items-center divide-x divide-white/20">
            {[
              "Free Shipping on orders over $99",
              "110% Low Price Guaranteed",
              "Expert Sales Support 7 Days a Week",
            ].map((message) => (
              <span key={message} className="px-7 first:pl-0 last:pr-0">
                {message}
              </span>
            ))}
          </div>
          <a
            href={`tel:${defaultStoreConfig.phone}`}
            className="flex items-center gap-2 text-white/90 transition-colors hover:text-white"
          >
            <Phone className="h-4 w-4" />
            {defaultStoreConfig.phone}
          </a>
        </div>
      </div>

      <header className="sticky top-0 z-50 border-b border-black/10 bg-white">
        <div className="mx-auto max-w-[1640px] px-4 md:px-5">
          <div className="flex h-16 items-center justify-between gap-4 md:h-[66px]">
            <button
              className="p-2 lg:hidden"
              onClick={() => setIsMenuOpen((current) => !current)}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>

            <Link href="/" className="flex shrink-0 items-center">
              <Image
                src={logoUrl ?? defaultStoreConfig.logo}
                alt={defaultStoreConfig.storeName}
                width={171}
                height={53}
                className="h-10 w-auto md:h-12"
                priority
              />
            </Link>

            <div className="hidden min-w-0 flex-1 lg:block">
              <form action="/search" method="GET" className="mx-auto max-w-[760px]">
                <div className="flex h-11 items-center border border-[#bdbdbd] bg-white">
                  <input
                    type="text"
                    name="q"
                    placeholder="Search by brand, model, or keyword"
                    className="h-full min-w-0 flex-1 px-4 text-sm text-[#424242] outline-none"
                  />
                  <button
                    type="submit"
                    className="flex h-full w-12 items-center justify-center border-l border-[#bdbdbd] text-[#424242]"
                    aria-label="Search"
                  >
                    <Search className="h-4 w-4" />
                  </button>
                </div>
              </form>
            </div>

            <div className="hidden items-center gap-5 lg:flex">
              <div className="text-right text-sm text-[#424242]">
                <p>Order Online or Call</p>
                <a
                  href={`tel:${defaultStoreConfig.phone}`}
                  className="font-semibold text-[#212121] hover:text-[#a54210]"
                >
                  {defaultStoreConfig.phone}
                </a>
              </div>

              <button
                className="relative flex items-center gap-2 text-[#424242] transition-colors hover:text-[#a54210]"
                onClick={toggleCart}
                aria-label="Shopping cart"
              >
                <ShoppingCart className="h-5 w-5" />
                <span className="text-sm">Cart</span>
                {getItemCount() > 0 && (
                  <span className="absolute -right-2 -top-2 flex h-[18px] w-[18px] items-center justify-center rounded-full border-2 border-white bg-[#212121] text-[10px] font-semibold text-white">
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
                <Search className="h-5 w-5 text-[#424242]" />
              </button>
              <button
                className="relative p-2"
                onClick={toggleCart}
                aria-label="Shopping cart"
              >
                <ShoppingCart className="h-5 w-5 text-[#424242]" />
                {getItemCount() > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-[18px] w-[18px] items-center justify-center rounded-full border-2 border-white bg-[#212121] text-[10px] font-semibold text-white">
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

        <div className="hidden border-t border-black/10 bg-[#f4f4f4] lg:block">
          <nav className="mx-auto flex h-10 max-w-[1640px] items-center px-5">
            {productCategories.slice(0, 5).map((category) => (
              <div
                key={category.id}
                className="relative mr-5"
                onMouseEnter={() => setActiveDropdown(category.id)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <Link
                  href={`/category/${category.slug}`}
                  className="flex h-10 items-center gap-1 text-xs font-medium tracking-[0.3px] text-[#212121] transition-colors hover:text-[#a54210]"
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
          </nav>
        </div>

        {isMenuOpen && (
          <div className="border-t border-black/10 bg-white lg:hidden">
            <nav className="space-y-2 px-4 py-4">
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
