import { defaultStoreConfig } from "@/lib/store-config";
import { ChevronDown } from "lucide-react";

export const metadata = {
  title: `FAQ | ${defaultStoreConfig.storeName}`,
  description: `Frequently asked questions about fireplaces, stoves, and our services at ${defaultStoreConfig.storeName}`,
};

const faqs = [
  {
    category: "General Questions",
    questions: [
      {
        q: "What areas do you serve?",
        a: "We serve Republic, Missouri and the surrounding areas including Springfield, Nixa, Ozark, Battlefield, and communities within a 50-mile radius of our showroom.",
      },
      {
        q: "Do you offer financing?",
        a: "Yes! We offer flexible financing options to help make your fireplace purchase more affordable. Contact us for current rates and terms.",
      },
      {
        q: "Can I see the fireplaces in action before buying?",
        a: "Absolutely! Our showroom has many working displays so you can see how different models look and operate. Visit us during business hours to explore our selection.",
      },
    ],
  },
  {
    category: "Installation",
    questions: [
      {
        q: "Do you provide installation services?",
        a: "Yes, we have certified technicians who handle all installations. Professional installation is included with most fireplace purchases to ensure safety and proper operation.",
      },
      {
        q: "How long does installation typically take?",
        a: "Installation time varies by project. A simple insert installation may take 4-6 hours, while a new fireplace with venting could take 1-2 days. We'll provide a timeline during your consultation.",
      },
      {
        q: "Do I need a chimney for a gas fireplace?",
        a: "Not necessarily. Many gas fireplaces can be vented directly through an exterior wall using direct vent technology. We can evaluate your home and recommend the best options.",
      },
      {
        q: "Can you install a fireplace in a home without an existing chimney?",
        a: "Yes! We offer vent-free and direct vent options that don't require a traditional chimney. Electric fireplaces are another great option that require no venting at all.",
      },
    ],
  },
  {
    category: "Maintenance & Service",
    questions: [
      {
        q: "How often should I have my fireplace serviced?",
        a: "We recommend annual service for all fireplaces. Gas fireplaces should be inspected and cleaned yearly, while wood-burning fireplaces and stoves may need more frequent chimney cleaning depending on use.",
      },
      {
        q: "Do you offer maintenance plans?",
        a: "Yes, we offer annual maintenance plans that include inspection, cleaning, and priority service scheduling. Ask about our service agreements for peace of mind.",
      },
      {
        q: "What are signs my fireplace needs service?",
        a: "Look for: unusual odors, difficulty starting, pilot light issues, soot buildup, strange sounds, or reduced heat output. If you notice any of these, contact us for an inspection.",
      },
    ],
  },
  {
    category: "Products",
    questions: [
      {
        q: "What's the difference between a fireplace and an insert?",
        a: "A fireplace is a complete unit that can be installed in new construction or added to a home. An insert is designed to fit inside an existing masonry fireplace opening to improve efficiency and update the look.",
      },
      {
        q: "Which is more efficient: gas, wood, or pellet?",
        a: "Gas fireplaces are typically the most efficient (70-85% efficiency) with the convenience of instant on/off. Pellet stoves offer excellent efficiency (70-83%) with automated feeding. Wood provides the classic ambiance but lower efficiency (50-70%). The best choice depends on your needs and preferences.",
      },
      {
        q: "Can I convert my wood fireplace to gas?",
        a: "In most cases, yes! Gas inserts are specifically designed for this purpose. We can assess your existing fireplace and recommend the best conversion options.",
      },
      {
        q: "Do electric fireplaces provide real heat?",
        a: "Yes, electric fireplaces can produce 4,000-5,000 BTUs of heat, enough to warm a 400-500 sq ft room. They're an excellent option for zones without gas lines or where venting isn't possible.",
      },
    ],
  },
  {
    category: "Orders & Shipping",
    questions: [
      {
        q: "Do you ship products?",
        a: "We offer local delivery within our service area. For customers outside our region, contact us to discuss shipping options for smaller items like parts and accessories.",
      },
      {
        q: "What is your return policy?",
        a: "Unused, uninstalled products may be returned within 30 days with original packaging and receipt. A restocking fee may apply. Custom orders and installed items are non-returnable. See our full policy for details.",
      },
      {
        q: "How do I track my order?",
        a: "Contact our store directly for order status updates. We'll provide tracking information for shipped items and delivery scheduling for local deliveries.",
      },
    ],
  },
];

function FAQItem({ question, answer }: { question: string; answer: string }) {
  return (
    <details className="group border-b border-gray-200 py-4">
      <summary className="flex items-center justify-between cursor-pointer list-none">
        <span className="font-medium text-gray-900 pr-4">{question}</span>
        <ChevronDown className="h-5 w-5 text-gray-500 flex-shrink-0 transition-transform group-open:rotate-180" />
      </summary>
      <p className="mt-3 text-gray-600 leading-relaxed">{answer}</p>
    </details>
  );
}

export default function FAQPage() {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-red-900 to-red-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Frequently Asked Questions</h1>
            <p className="text-xl text-red-100 max-w-3xl mx-auto">
              Find answers to common questions about our products and services.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {faqs.map((category) => (
            <div key={category.category} className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">{category.category}</h2>
              <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-200">
                {category.questions.map((faq, index) => (
                  <div key={index} className="px-6">
                    <FAQItem question={faq.q} answer={faq.a} />
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* Contact CTA */}
          <div className="bg-gray-50 rounded-xl p-8 text-center mt-12">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Still have questions?</h3>
            <p className="text-gray-600 mb-4">
              {"Our team is here to help. Contact us and we'll get back to you promptly."}
            </p>
            <a
              href="/contact"
              className="inline-block bg-red-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-800 transition-colors"
            >
              Contact Us
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
