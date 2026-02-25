import { defaultStoreConfig } from "@/lib/store-config";

export const metadata = {
  title: `Terms of Service | ${defaultStoreConfig.storeName}`,
  description: `Terms and conditions for using ${defaultStoreConfig.storeName} website and services`,
};

export default function TermsPage() {
  const { address } = defaultStoreConfig;
  const fullAddress = `${address.street}, ${address.city}, ${address.state} ${address.zip}`;
  const name = defaultStoreConfig.storeName;

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-red-900 to-red-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Terms of Service</h1>
            <p className="text-xl text-red-100 max-w-3xl mx-auto">
              Please read these terms carefully before using our website or making a purchase.
            </p>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <p className="text-gray-500 text-sm">Last updated: February 2024</p>

          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Agreement to Terms</h2>
            <p className="text-gray-600">
              By accessing or using the {name} website, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this site.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Use License</h2>
            <p className="text-gray-600 mb-4">
              {`Permission is granted to temporarily view the materials on ${name}'s website for personal, non-commercial use only. Under this license you may not:`}
            </p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li>Modify or copy the materials</li>
              <li>Use the materials for any commercial purpose</li>
              <li>Attempt to decompile or reverse engineer any software contained on the website</li>
              <li>Remove any copyright or other proprietary notations</li>
              <li>{'Transfer the materials to another person or "mirror" the materials on any other server'}</li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Products and Services</h2>
            <p className="text-gray-600 mb-4">
              All product descriptions, images, and specifications are provided for informational purposes only. We strive for accuracy but do not warrant that product descriptions or other content is accurate, complete, reliable, current, or error-free.
            </p>
            <p className="text-gray-600">
              Prices and availability are subject to change without notice. We reserve the right to limit quantities and refuse service to anyone.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Orders and Payment</h2>
            <p className="text-gray-600 mb-4">By placing an order, you represent that:</p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li>You are authorized to use the payment method provided</li>
              <li>The billing information you provide is accurate</li>
              <li>You will pay all charges incurred, including applicable taxes and shipping</li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Returns and Refunds</h2>
            <p className="text-gray-600 mb-4">Our return policy is as follows:</p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li>Unused, uninstalled products may be returned within 30 days of purchase with original packaging and receipt</li>
              <li>A restocking fee of 15-25% may apply to returned items</li>
              <li>Custom orders, special orders, and installed items are non-returnable</li>
              <li>Defective items may be returned for exchange or refund per manufacturer warranty</li>
              <li>Shipping costs for returns are the responsibility of the customer unless the item is defective</li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Disclaimer</h2>
            <p className="text-gray-600">
              {`The materials on ${name}'s website are provided on an 'as is' basis. ${name} makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.`}
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Governing Law</h2>
            <p className="text-gray-600">
              These terms and conditions are governed by and construed in accordance with the laws of the State of Missouri, and you irrevocably submit to the exclusive jurisdiction of the courts in that State or location.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Contact Information</h2>
            <p className="text-gray-600 mb-4">
              Questions about the Terms of Service should be sent to us at:
            </p>
            <div className="bg-gray-50 rounded-xl p-6">
              <p className="font-semibold text-gray-900">{name}</p>
              <p className="text-gray-600">{fullAddress}</p>
              <p className="text-gray-600">Phone: {defaultStoreConfig.phone}</p>
              <p className="text-gray-600">Email: {defaultStoreConfig.email}</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
