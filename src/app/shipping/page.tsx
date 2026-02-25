import { defaultStoreConfig } from "@/lib/store-config";
import { Truck, Package, Clock, Phone } from "lucide-react";

export const metadata = {
  title: `Shipping Policy | ${defaultStoreConfig.storeName}`,
  description: `Shipping and delivery information for ${defaultStoreConfig.storeName}`,
};

export default function ShippingPage() {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-red-900 to-red-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Shipping & Delivery</h1>
            <p className="text-xl text-red-100 max-w-3xl mx-auto">
              Information about delivery options and shipping policies.
            </p>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Quick Info Cards */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <div className="bg-gray-50 rounded-xl p-6 text-center">
              <Truck className="h-10 w-10 text-red-700 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 mb-1">Local Delivery</h3>
              <p className="text-sm text-gray-600">Free within 30 miles</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-6 text-center">
              <Package className="h-10 w-10 text-red-700 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 mb-1">Professional Setup</h3>
              <p className="text-sm text-gray-600">Installation available</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-6 text-center">
              <Clock className="h-10 w-10 text-red-700 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 mb-1">Quick Turnaround</h3>
              <p className="text-sm text-gray-600">Most orders in 1-2 weeks</p>
            </div>
          </div>

          {/* Detailed Policy */}
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Delivery Options</h2>

              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Local Delivery</h3>
              <p className="text-gray-600 mb-4">
                We provide local delivery and installation services within a 50-mile radius of our showroom in Republic, Missouri.
                This includes Springfield, Nixa, Ozark, Battlefield, and surrounding communities.
              </p>
              <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-6">
                <li>Free delivery within 30 miles for orders over $1,000</li>
                <li>Delivery fee of $50-$100 for orders under $1,000 or beyond 30 miles</li>
                <li>Professional installation available for all delivered products</li>
                <li>Scheduled delivery times to fit your schedule</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Shipping</h3>
              <p className="text-gray-600 mb-4">
                For customers outside our local delivery area, we offer shipping on select products:
              </p>
              <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-6">
                <li>Parts and accessories can be shipped nationwide via UPS or FedEx</li>
                <li>Shipping costs calculated at checkout based on weight and destination</li>
                <li>Larger items (fireplaces, stoves) require freight shipping — contact us for a quote</li>
                <li>Some oversized items are available for local pickup only</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Order Processing Time</h3>
              <p className="text-gray-600 mb-4">Processing times vary by product:</p>
              <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-6">
                <li><strong>In-stock items:</strong> Ready for pickup or delivery within 2-3 business days</li>
                <li><strong>Special orders:</strong> Typically 2-6 weeks depending on manufacturer</li>
                <li><strong>Custom items:</strong> Timeline provided at time of order</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Pickup Option</h3>
              <p className="text-gray-600 mb-4">
                All orders are available for pickup at our showroom during business hours:
              </p>
              <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-6">
                <li>Monday - Friday: {defaultStoreConfig.business.hours.weekdays}</li>
                <li>Saturday: {defaultStoreConfig.business.hours.saturday}</li>
                <li>Please bring your order confirmation and a valid ID</li>
              </ul>
            </div>
          </div>

          {/* Contact CTA */}
          <div className="bg-gray-50 rounded-xl p-8 mt-12">
            <div className="flex items-start gap-4">
              <Phone className="h-6 w-6 text-red-700 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Questions About Shipping?</h3>
                <p className="text-gray-600 mb-4">
                  Contact us for shipping quotes, delivery scheduling, or any questions about your order.
                </p>
                <p className="text-gray-900 font-medium">
                  Call us at {defaultStoreConfig.phone} or{" "}
                  <a href="/contact" className="text-red-700 hover:underline">
                    send us a message
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
