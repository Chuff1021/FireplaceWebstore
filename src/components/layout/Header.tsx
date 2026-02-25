"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Search,
  ShoppingCart,
  Menu,
  X,
  Phone,
  MapPin,
  User,
  ChevronDown,
} from "lucide-react";
import { useCartStore } from "@/lib/cart-store";
import { defaultStoreConfig, productCategories } from "@/lib/store-config";
import { CartSlideout } from "./CartSlideout";

export function Header({ logoUrl }: { logoUrl?: string }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const { getItemCount, toggleCart } = useCartStore();

  return (
    <>
      {/* Top Bar */}
      <div className="bg-gray-900 text-white text-sm py-2 hidden md:block">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center gap-6">
            <a
              href={`tel:${defaultStoreConfig.phone}`}
              className="flex items-center gap-2 hover:text-amber-400 transition-colors"
            >
              <Phone className="w-4 h-4" />
              {defaultStoreConfig.phone}
            </a>
            <span className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              {defaultStoreConfig.address.city}, {defaultStoreConfig.address.state}
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/showrooms" className="hover:text-amber-400 transition-colors">
              Visit Our Showrooms
            </Link>
            <Link href="/installation" className="hover:text-amber-400 transition-colors">
              Professional Installation
            </Link>
            <Link href="/account" className="hover:text-amber-400 transition-colors">
              My Account
            </Link>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Mobile Menu Button */}
            <button
              className="lg:hidden p-2 -ml-2"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            {/* Logo */}
            <Link href="/" className="flex items-center">
              <Image
                src={logoUrl ?? defaultStoreConfig.logo}
                alt={defaultStoreConfig.storeName}
                width={240}
                height={58}
                className="h-11 lg:h-14 w-auto"
                priority
              />
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1">
              {productCategories.slice(0, 5).map((category) => (
                <div
                  key={category.id}
                  className="relative"
                  onMouseEnter={() => setActiveDropdown(category.id)}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  <Link
                    href={`/category/${category.slug}`}
                    className="flex items-center gap-1 px-4 py-2 text-gray-700 hover:text-orange-600 font-medium transition-colors"
                  >
                    {category.name}
                    {category.subcategories && (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </Link>
                  
                  {/* Dropdown Menu */}
                  {category.subcategories && activeDropdown === category.id && (
                    <div className="absolute top-full left-0 w-56 bg-white shadow-lg rounded-lg py-2 border">
                      {category.subcategories.map((sub) => (
                        <Link
                          key={sub.id}
                          href={`/category/${category.slug}/${sub.slug}`}
                          className="block px-4 py-2 text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors"
                        >
                          {sub.name}
                        </Link>
                      ))}
                      <div className="border-t mt-2 pt-2">
                        <Link
                          href={`/category/${category.slug}`}
                          className="block px-4 py-2 text-orange-600 font-medium hover:bg-orange-50 transition-colors"
                        >
                          View All {category.name}
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              ))}
              <Link
                href="/design-tool"
                className="px-4 py-2 text-amber-700 font-semibold hover:text-amber-800 transition-colors flex items-center gap-1"
              >
                ✦ Design Tool
              </Link>
              <Link
                href="/sale"
                className="px-4 py-2 text-red-600 font-bold hover:text-red-700 transition-colors"
              >
                🔥 Sale
              </Link>
            </nav>

            {/* Right Actions */}
            <div className="flex items-center gap-2">
              {/* Search Button */}
              <button
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                aria-label="Search"
              >
                <Search className="w-5 h-5 text-gray-600" />
              </button>

              {/* Account */}
              <Link
                href="/account"
                className="hidden sm:flex p-2 hover:bg-gray-100 rounded-full transition-colors"
                aria-label="My Account"
              >
                <User className="w-5 h-5 text-gray-600" />
              </Link>

              {/* Cart */}
              <button
                className="relative p-2 hover:bg-gray-100 rounded-full transition-colors"
                onClick={toggleCart}
                aria-label="Shopping cart"
              >
                <ShoppingCart className="w-5 h-5 text-gray-600" />
                {getItemCount() > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-orange-600 text-white text-xs font-bold rounded-full flex items-center justify-center">
                    {getItemCount()}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Search Bar */}
          {isSearchOpen && (
            <div className="py-4 border-t">
              <form action="/search" method="GET" className="flex gap-2">
                <input
                  type="text"
                  name="q"
                  placeholder="Search fireplaces, stoves, inserts..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  autoFocus
                />
                <button
                  type="submit"
                  className="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors font-medium"
                >
                  Search
                </button>
              </form>
            </div>
          )}
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden border-t bg-white">
            <nav className="max-w-7xl mx-auto px-4 py-4 space-y-2">
              {productCategories.map((category) => (
                <div key={category.id}>
                  <Link
                    href={`/category/${category.slug}`}
                    className="block py-2 font-medium text-gray-900 hover:text-orange-600"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {category.name}
                  </Link>
                  {category.subcategories && (
                    <div className="pl-4 space-y-1">
                      {category.subcategories.map((sub) => (
                        <Link
                          key={sub.id}
                          href={`/category/${category.slug}/${sub.slug}`}
                          className="block py-1 text-gray-600 hover:text-orange-600"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          {sub.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              <Link
                href="/design-tool"
                className="block py-2 font-semibold text-amber-700"
                onClick={() => setIsMenuOpen(false)}
              >
                ✦ AI Design Tool
              </Link>
              <Link
                href="/sale"
                className="block py-2 font-bold text-red-600"
                onClick={() => setIsMenuOpen(false)}
              >
                🔥 Sale Items
              </Link>
              <div className="pt-4 border-t space-y-2">
                <Link
                  href="/account"
                  className="block py-2 text-gray-700"
                  onClick={() => setIsMenuOpen(false)}
                >
                  My Account
                </Link>
                <Link
                  href="/contact"
                  className="block py-2 text-gray-700"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Contact Us
                </Link>
              </div>
            </nav>
          </div>
        )}
      </header>

      {/* Cart Slideout */}
      <CartSlideout />
    </>
  );
}
