"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowLeft, Lock, Check } from "lucide-react";
import { useCartStore } from "@/lib/cart-store";

function formatPrice(price: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(price);
}

export default function CheckoutPage() {
  const { items, getSubtotal, getShipping, getTax, getTotal } = useCartStore();
  const [step, setStep] = useState<1 | 2 | 3>(1);

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Your Cart is Empty
        </h1>
        <p className="text-gray-600 mb-8">
          Add some items to your cart before checking out.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Progress Steps */}
        <div className="flex items-center justify-center gap-4 mb-12">
          {[
            { num: 1, label: "Shipping" },
            { num: 2, label: "Payment" },
            { num: 3, label: "Review" },
          ].map((s, i) => (
            <div key={s.num} className="flex items-center gap-4">
              <button
                onClick={() => setStep(s.num as 1 | 2 | 3)}
                className={`flex items-center gap-2 ${
                  step >= s.num ? "text-orange-600" : "text-gray-400"
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                    step > s.num
                      ? "bg-green-600 text-white"
                      : step === s.num
                      ? "bg-orange-600 text-white"
                      : "bg-gray-200 text-gray-500"
                  }`}
                >
                  {step > s.num ? <Check className="w-4 h-4" /> : s.num}
                </div>
                <span className="hidden sm:inline font-medium">{s.label}</span>
              </button>
              {i < 2 && (
                <div
                  className={`w-12 sm:w-24 h-0.5 ${
                    step > s.num ? "bg-green-600" : "bg-gray-200"
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Form Section */}
          <div className="lg:col-span-2">
            {/* Step 1: Shipping */}
            {step === 1 && (
              <div className="bg-white rounded-xl p-6 border">
                <h2 className="text-xl font-bold text-gray-900 mb-6">
                  Shipping Information
                </h2>
                <form
                  className="space-y-4"
                  onSubmit={(e) => {
                    e.preventDefault();
                    setStep(2);
                  }}
                >
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        First Name
                      </label>
                      <input
                        type="text"
                        required
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                        placeholder="John"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Last Name
                      </label>
                      <input
                        type="text"
                        required
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                        placeholder="Doe"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      required
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                      placeholder="john@example.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      required
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                      placeholder="(555) 123-4567"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Street Address
                    </label>
                    <input
                      type="text"
                      required
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                      placeholder="123 Main Street"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Apartment, Suite, etc. (optional)
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                      placeholder="Apt 4B"
                    />
                  </div>

                  <div className="grid sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        City
                      </label>
                      <input
                        type="text"
                        required
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                        placeholder="Anytown"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        State
                      </label>
                      <select
                        required
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                      >
                        <option value="">Select</option>
                        <option value="AL">Alabama</option>
                        <option value="AK">Alaska</option>
                        <option value="AZ">Arizona</option>
                        <option value="CA">California</option>
                        <option value="CO">Colorado</option>
                        <option value="CT">Connecticut</option>
                        <option value="FL">Florida</option>
                        <option value="GA">Georgia</option>
                        <option value="IL">Illinois</option>
                        <option value="NY">New York</option>
                        <option value="TX">Texas</option>
                        {/* Add more states as needed */}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        ZIP Code
                      </label>
                      <input
                        type="text"
                        required
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                        placeholder="12345"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-orange-600 text-white font-bold rounded-lg hover:bg-orange-700 transition-colors mt-6"
                  >
                    Continue to Payment
                  </button>
                </form>
              </div>
            )}

            {/* Step 2: Payment */}
            {step === 2 && (
              <div className="bg-white rounded-xl p-6 border">
                <h2 className="text-xl font-bold text-gray-900 mb-6">
                  Payment Information
                </h2>
                <form
                  className="space-y-4"
                  onSubmit={(e) => {
                    e.preventDefault();
                    setStep(3);
                  }}
                >
                  <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                    <Lock className="w-4 h-4" />
                    Your payment information is encrypted and secure
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Card Number
                    </label>
                    <input
                      type="text"
                      required
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                      placeholder="1234 5678 9012 3456"
                    />
                  </div>

                  <div className="grid sm:grid-cols-3 gap-4">
                    <div className="sm:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Expiration Date
                      </label>
                      <input
                        type="text"
                        required
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                        placeholder="MM / YY"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        CVV
                      </label>
                      <input
                        type="text"
                        required
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                        placeholder="123"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Name on Card
                    </label>
                    <input
                      type="text"
                      required
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                      placeholder="John Doe"
                    />
                  </div>

                  <div className="flex gap-4 mt-6">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="px-6 py-3 border rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      className="flex-1 py-3 bg-orange-600 text-white font-bold rounded-lg hover:bg-orange-700 transition-colors"
                    >
                      Review Order
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Step 3: Review */}
            {step === 3 && (
              <div className="space-y-6">
                <div className="bg-white rounded-xl p-6 border">
                  <h2 className="text-xl font-bold text-gray-900 mb-6">
                    Review Your Order
                  </h2>

                  {/* Shipping Address */}
                  <div className="mb-6">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-medium text-gray-900">
                        Shipping Address
                      </h3>
                      <button
                        onClick={() => setStep(1)}
                        className="text-sm text-orange-600 hover:text-orange-700"
                      >
                        Edit
                      </button>
                    </div>
                    <p className="text-gray-600 text-sm">
                      John Doe
                      <br />
                      123 Main Street
                      <br />
                      Anytown, ST 12345
                    </p>
                  </div>

                  {/* Payment Method */}
                  <div className="mb-6">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-medium text-gray-900">
                        Payment Method
                      </h3>
                      <button
                        onClick={() => setStep(2)}
                        className="text-sm text-orange-600 hover:text-orange-700"
                      >
                        Edit
                      </button>
                    </div>
                    <p className="text-gray-600 text-sm">
                      💳 Visa ending in 3456
                    </p>
                  </div>

                  {/* Order Items */}
                  <div>
                    <h3 className="font-medium text-gray-900 mb-4">
                      Order Items
                    </h3>
                    <div className="space-y-4">
                      {items.map((item) => (
                        <div
                          key={item.product.id}
                          className="flex items-center gap-4 py-3 border-b last:border-0"
                        >
                          <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                            <span className="text-2xl">🔥</span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-gray-900 line-clamp-1">
                              {item.product.name}
                            </p>
                            <p className="text-sm text-gray-500">
                              Qty: {item.quantity}
                            </p>
                          </div>
                          <div className="font-medium text-gray-900">
                            {formatPrice(
                              (item.product.salePrice ?? item.product.price) *
                                item.quantity
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={() => setStep(2)}
                    className="px-6 py-3 border rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Back
                  </button>
                  <button className="flex-1 py-3 bg-orange-600 text-white font-bold rounded-lg hover:bg-orange-700 transition-colors flex items-center justify-center gap-2">
                    <Lock className="w-4 h-4" />
                    Place Order — {formatPrice(getTotal())}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Order Summary Sidebar */}
          <div>
            <div className="bg-white rounded-xl p-6 border sticky top-24">
              <h3 className="font-bold text-gray-900 mb-4">Order Summary</h3>

              <div className="space-y-3 text-sm">
                {items.map((item) => (
                  <div
                    key={item.product.id}
                    className="flex justify-between"
                  >
                    <span className="text-gray-600 line-clamp-1 flex-1 mr-2">
                      {item.product.name} × {item.quantity}
                    </span>
                    <span className="font-medium flex-shrink-0">
                      {formatPrice(
                        (item.product.salePrice ?? item.product.price) *
                          item.quantity
                      )}
                    </span>
                  </div>
                ))}

                <div className="border-t pt-3 mt-3 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium">
                      {formatPrice(getSubtotal())}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping</span>
                    <span className="font-medium">
                      {getShipping() === 0 ? (
                        <span className="text-green-600">FREE</span>
                      ) : (
                        formatPrice(getShipping())
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tax</span>
                    <span className="font-medium">
                      {formatPrice(getTax())}
                    </span>
                  </div>
                </div>

                <div className="border-t pt-3 mt-3">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span className="text-orange-600">
                      {formatPrice(getTotal())}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
