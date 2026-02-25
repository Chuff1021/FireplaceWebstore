import Link from "next/link";
import Image from "next/image";
import {
  Facebook,
  Instagram,
  Youtube,
  Phone,
  Mail,
  MapPin,
  Clock,
} from "lucide-react";
import { defaultStoreConfig, productCategories } from "@/lib/store-config";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300">
      {/* Newsletter Section */}
      <div className="bg-orange-600">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-white text-center md:text-left">
              <h3 className="text-xl font-bold">Get Expert Advice & Exclusive Deals</h3>
              <p className="text-orange-100">Subscribe to our newsletter for tips, trends, and savings.</p>
            </div>
            <form className="flex w-full md:w-auto gap-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 md:w-64 px-4 py-2 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-white"
              />
              <button
                type="submit"
                className="px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors font-medium"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="mb-4">
              <Image
                src="/logo-light.svg"
                alt={defaultStoreConfig.storeName}
                width={220}
                height={54}
                className="h-12 w-auto"
              />
            </div>
            <p className="text-gray-400 mb-4">{defaultStoreConfig.tagline}</p>
            
            {/* Contact Info */}
            <div className="space-y-2 text-sm">
              <a
                href={`tel:${defaultStoreConfig.phone}`}
                className="flex items-center gap-2 hover:text-orange-400 transition-colors"
              >
                <Phone className="w-4 h-4" />
                {defaultStoreConfig.phone}
              </a>
              <a
                href={`mailto:${defaultStoreConfig.email}`}
                className="flex items-center gap-2 hover:text-orange-400 transition-colors"
              >
                <Mail className="w-4 h-4" />
                {defaultStoreConfig.email}
              </a>
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-0.5" />
                <span>
                  {defaultStoreConfig.address.street}
                  <br />
                  {defaultStoreConfig.address.city}, {defaultStoreConfig.address.state}{" "}
                  {defaultStoreConfig.address.zip}
                </span>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex gap-3 mt-4">
              {defaultStoreConfig.social.facebook && (
                <a
                  href={defaultStoreConfig.social.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-gray-800 rounded-lg hover:bg-orange-600 transition-colors"
                  aria-label="Facebook"
                >
                  <Facebook className="w-5 h-5" />
                </a>
              )}
              {defaultStoreConfig.social.instagram && (
                <a
                  href={defaultStoreConfig.social.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-gray-800 rounded-lg hover:bg-orange-600 transition-colors"
                  aria-label="Instagram"
                >
                  <Instagram className="w-5 h-5" />
                </a>
              )}
              {defaultStoreConfig.social.youtube && (
                <a
                  href={defaultStoreConfig.social.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-gray-800 rounded-lg hover:bg-orange-600 transition-colors"
                  aria-label="YouTube"
                >
                  <Youtube className="w-5 h-5" />
                </a>
              )}
            </div>
          </div>

          {/* Shop Categories */}
          <div>
            <h4 className="font-bold text-white mb-4">Shop By Category</h4>
            <ul className="space-y-2">
              {productCategories.map((category) => (
                <li key={category.id}>
                  <Link
                    href={`/category/${category.slug}`}
                    className="hover:text-orange-400 transition-colors"
                  >
                    {category.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/sale"
                  className="text-orange-400 font-medium hover:text-orange-300 transition-colors"
                >
                  🔥 Sale Items
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="font-bold text-white mb-4">Customer Service</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="hover:text-orange-400 transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-orange-400 transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/shipping" className="hover:text-orange-400 transition-colors">
                  Shipping Information
                </Link>
              </li>
              <li>
                <Link href="/returns" className="hover:text-orange-400 transition-colors">
                  Returns & Exchanges
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-orange-400 transition-colors">
                  Frequently Asked Questions
                </Link>
              </li>
              <li>
                <Link href="/warranty" className="hover:text-orange-400 transition-colors">
                  Warranty Information
                </Link>
              </li>
              <li>
                <Link href="/installation" className="hover:text-orange-400 transition-colors">
                  Professional Installation
                </Link>
              </li>
            </ul>
          </div>

          {/* Business Hours & Services */}
          <div>
            <h4 className="font-bold text-white mb-4">Store Hours</h4>
            <div className="space-y-2 text-sm mb-6">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>Mon-Fri: {defaultStoreConfig.business.hours.weekdays}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>Saturday: {defaultStoreConfig.business.hours.saturday}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>Sunday: {defaultStoreConfig.business.hours.sunday}</span>
              </div>
            </div>

            <h4 className="font-bold text-white mb-4">Services</h4>
            <ul className="space-y-2">
              {defaultStoreConfig.business.showrooms && (
                <li>
                  <Link
                    href="/showrooms"
                    className="hover:text-orange-400 transition-colors"
                  >
                    Visit Our Showrooms
                  </Link>
                </li>
              )}
              {defaultStoreConfig.business.installationServices && (
                <li>
                  <Link
                    href="/installation"
                    className="hover:text-orange-400 transition-colors"
                  >
                    Professional Installation
                  </Link>
                </li>
              )}
              <li>
                <Link href="/financing" className="hover:text-orange-400 transition-colors">
                  Financing Options
                </Link>
              </li>
              <li>
                <Link href="/trade-program" className="hover:text-orange-400 transition-colors">
                  Trade Program
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Trust Badges */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-8 mt-8 border-t border-gray-800">
          <div className="text-center">
            <div className="text-3xl mb-2">🚚</div>
            <div className="font-medium text-white">Free Shipping</div>
            <div className="text-sm text-gray-400">Orders over $499</div>
          </div>
          <div className="text-center">
            <div className="text-3xl mb-2">🔒</div>
            <div className="font-medium text-white">Secure Checkout</div>
            <div className="text-sm text-gray-400">SSL Encrypted</div>
          </div>
          <div className="text-center">
            <div className="text-3xl mb-2">✅</div>
            <div className="font-medium text-white">Price Match</div>
            <div className="text-sm text-gray-400">Best price guarantee</div>
          </div>
          <div className="text-center">
            <div className="text-3xl mb-2">🛠️</div>
            <div className="font-medium text-white">Expert Support</div>
            <div className="text-sm text-gray-400">Certified technicians</div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm">
            <div className="text-gray-400">
              © {currentYear} {defaultStoreConfig.storeName}. All rights reserved.
            </div>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/privacy" className="hover:text-orange-400 transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="hover:text-orange-400 transition-colors">
                Terms of Service
              </Link>
              <Link href="/accessibility" className="hover:text-orange-400 transition-colors">
                Accessibility
              </Link>
            </div>
            <div className="flex items-center gap-2">
              <Image
                src="https://cdn.jsdelivr.net/gh/lipis/flag-icons@6.6.6/flags/4x3/us.svg"
                alt="USA"
                width={24}
                height={16}
                className="w-6 h-4"
              />
              <span className="text-gray-400">Made in USA</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
