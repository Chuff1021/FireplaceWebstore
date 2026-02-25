import { defaultStoreConfig } from "@/lib/store-config";
import { MapPin, Phone, Mail, Clock, Award, Users, Shield, Heart } from "lucide-react";

export const metadata = {
  title: `About Us | ${defaultStoreConfig.storeName}`,
  description: `Learn about ${defaultStoreConfig.storeName} - ${defaultStoreConfig.tagline}`,
};

export default function AboutPage() {
  const { address } = defaultStoreConfig;
  const fullAddress = `${address.street}, ${address.city}, ${address.state} ${address.zip}`;

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-red-900 to-red-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">About {defaultStoreConfig.storeName}</h1>
            <p className="text-xl text-red-100 max-w-3xl mx-auto">
              Serving Republic, Missouri and the surrounding areas with quality fireplace solutions since 2010.
            </p>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Story</h2>
              <div className="space-y-4 text-gray-600">
                <p>
                  {defaultStoreConfig.storeName} was founded with a simple mission: to help families in Republic, Missouri
                  and the surrounding areas create warm, inviting homes with quality fireplace solutions.
                </p>
                <p>
                  {"What started as a small family business has grown into the region's most trusted source for fireplaces, stoves, inserts, and outdoor heating solutions. We take pride in offering personalized service and expert advice to every customer who walks through our doors."}
                </p>
                <p>
                  Our team of certified technicians has decades of combined experience in the fireplace industry.
                  We stay up-to-date with the latest technologies and products to ensure you get the best
                  solutions for your home and budget.
                </p>
              </div>
            </div>
            <div className="bg-gray-100 rounded-2xl p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Why Choose Us?</h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <Award className="h-6 w-6 text-red-700 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-medium text-gray-900">Authorized Dealer</span>
                    <p className="text-sm text-gray-600">{"We're an authorized dealer for top brands"}</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <Users className="h-6 w-6 text-red-700 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-medium text-gray-900">Expert Team</span>
                    <p className="text-sm text-gray-600">Certified technicians with years of experience</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <Shield className="h-6 w-6 text-red-700 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-medium text-gray-900">Quality Guaranteed</span>
                    <p className="text-sm text-gray-600">We stand behind every product we sell</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <Heart className="h-6 w-6 text-red-700 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-medium text-gray-900">Customer Focused</span>
                    <p className="text-sm text-gray-600">Your satisfaction is our top priority</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Services</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We offer a complete range of fireplace services to meet all your heating needs.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Sales & Consultation</h3>
              <p className="text-gray-600">
                {"Expert guidance to help you choose the perfect fireplace, stove, or insert for your home. We'll help you find the right fit for your space, style, and budget."}
              </p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Professional Installation</h3>
              <p className="text-gray-600">
                Our certified technicians ensure your new fireplace is installed safely and correctly.
                We handle everything from gas lines to venting.
              </p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Service & Maintenance</h3>
              <p className="text-gray-600">
                Keep your fireplace running efficiently with our maintenance services.
                Annual inspections, cleaning, and repairs for all makes and models.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Info */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Visit Our Showroom</h2>
            <p className="text-gray-600">Come see our wide selection of fireplaces and stoves in person.</p>
          </div>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center p-6 bg-gray-50 rounded-xl">
              <MapPin className="h-8 w-8 text-red-700 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 mb-1">Address</h3>
              <p className="text-gray-600 text-sm">{fullAddress}</p>
            </div>
            <div className="text-center p-6 bg-gray-50 rounded-xl">
              <Phone className="h-8 w-8 text-red-700 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 mb-1">Phone</h3>
              <p className="text-gray-600 text-sm">{defaultStoreConfig.phone}</p>
            </div>
            <div className="text-center p-6 bg-gray-50 rounded-xl">
              <Mail className="h-8 w-8 text-red-700 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 mb-1">Email</h3>
              <p className="text-gray-600 text-sm">{defaultStoreConfig.email}</p>
            </div>
            <div className="text-center p-6 bg-gray-50 rounded-xl">
              <Clock className="h-8 w-8 text-red-700 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 mb-1">Hours</h3>
              <p className="text-gray-600 text-sm">
                Mon-Fri: {defaultStoreConfig.business.hours.weekdays}<br />
                Sat: {defaultStoreConfig.business.hours.saturday}
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
