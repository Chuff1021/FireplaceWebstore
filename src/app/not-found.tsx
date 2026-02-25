import Link from "next/link";
import { Home, Search } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center bg-gray-50 px-4">
      <div className="text-center">
        <div className="mb-8">
          <span className="text-9xl font-bold text-red-700">404</span>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Page Not Found</h1>
        <p className="text-gray-600 mb-8 max-w-md mx-auto">
          {"Sorry, we couldn't find the page you're looking for. It may have been moved or doesn't exist."}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 bg-red-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-800 transition-colors"
          >
            <Home className="h-5 w-5" />
            Go Home
          </Link>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center gap-2 bg-white text-gray-900 px-6 py-3 rounded-lg font-semibold border border-gray-300 hover:bg-gray-50 transition-colors"
          >
            <Search className="h-5 w-5" />
            Contact Us
          </Link>
        </div>
        <div className="mt-12">
          <p className="text-gray-500 mb-4">Looking for something specific?</p>
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <Link href="/category/fireplaces" className="text-red-700 hover:underline">
              Fireplaces
            </Link>
            <Link href="/category/stoves" className="text-red-700 hover:underline">
              Stoves
            </Link>
            <Link href="/category/inserts" className="text-red-700 hover:underline">
              Inserts
            </Link>
            <Link href="/category/outdoor" className="text-red-700 hover:underline">
              Outdoor
            </Link>
            <Link href="/about" className="text-red-700 hover:underline">
              About Us
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
