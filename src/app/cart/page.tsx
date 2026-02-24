"use client";

import Link from "next/link";
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft } from "lucide-react";
import { useCartStore } from "@/lib/cart-store";
import { defaultStoreConfig } from "@/lib/store-config";

function formatPrice(price: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(price);
}

export default function CartPage() {
  const {
    items,
    removeItem,
    updateQuantity,
    clearCart,
    getSubtotal,
    getShipping,
    getTax,
    getTotal,
  } = useCartStore();

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <ShoppingBag className="w-20 h-20 text-gray-300 mx-auto mb-6" />
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Your Cart is Empty
        </h1>
        <p className="text-gray-600 mb-8">
          Looks like you haven&apos;t added any items to your cart yet.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors font-medium"
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
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div
                key={item.product.id}
                className="bg-white rounded-xl p-6 border flex flex-col sm:flex-row gap-6"
              >
                {/* Product Image */}
                <div className="w-32 h-32 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-5xl">🔥</span>
                </div>

                {/* Product Details */}
                <div className="flex-1">
                  <div className="flex justify-between">
                    <div>
                      <p className="text-sm text-gray-500">{item.product.brand}</p>
                      <Link
                        href={`/product/${item.product.slug}`}
                        className="font-medium text-gray-900 hover:text-orange-600 transition-colors"
                      >
                        {item.product.name}
                      </Link>
                      <p className="text-sm text-gray-500 mt-1">
                        SKU: {item.product.sku}
                      </p>
                    </div>
                    <button
                      onClick={() => removeItem(item.product.id)}
                      className="p-2 hover:bg-red-50 text-gray-400 hover:text-red-600 rounded-lg transition-colors h-fit"
                      aria-label="Remove item"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="flex items-end justify-between mt-4">
                    {/* Quantity */}
                    <div className="flex items-center border rounded-lg">
                      <button
                        onClick={() =>
                          updateQuantity(item.product.id, item.quantity - 1)
                        }
                        className="p-2 hover:bg-gray-100 transition-colors"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-10 text-center font-medium">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          updateQuantity(item.product.id, item.quantity + 1)
                        }
                        className="p-2 hover:bg-gray-100 transition-colors"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Price */}
                    <div className="text-right">
                      <div className="font-bold text-lg text-gray-900">
                        {formatPrice(
                          (item.product.salePrice ?? item.product.price) *
                            item.quantity
                        )}
                      </div>
                      {item.quantity > 1 && (
                        <div className="text-sm text-gray-500">
                          {formatPrice(
                            item.product.salePrice ?? item.product.price
                          )}{" "}
                          each
                        </div>
                      )}
                      {item.product.salePrice && (
                        <div className="text-sm text-red-600">
                          Save{" "}
                          {formatPrice(
                            (item.product.price - item.product.salePrice) *
                              item.quantity
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Cart Actions */}
            <div className="flex justify-between items-center">
              <Link
                href="/"
                className="flex items-center gap-2 text-gray-600 hover:text-orange-600 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Continue Shopping
              </Link>
              <button
                onClick={clearCart}
                className="text-sm text-red-600 hover:text-red-700 transition-colors"
              >
                Clear Cart
              </button>
            </div>
          </div>

          {/* Order Summary */}
          <div>
            <div className="bg-white rounded-xl p-6 border sticky top-24">
              <h2 className="text-lg font-bold text-gray-900 mb-6">
                Order Summary
              </h2>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">
                    Subtotal ({items.length} items)
                  </span>
                  <span className="font-medium">{formatPrice(getSubtotal())}</span>
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
                  <span className="text-gray-600">Estimated Tax</span>
                  <span className="font-medium">{formatPrice(getTax())}</span>
                </div>

                {/* Free Shipping Progress */}
                {getSubtotal() <
                  defaultStoreConfig.business.freeShipping.minimum && (
                  <div className="bg-orange-50 text-orange-800 text-sm p-3 rounded-lg mt-2">
                    Add{" "}
                    <span className="font-bold">
                      {formatPrice(
                        defaultStoreConfig.business.freeShipping.minimum -
                          getSubtotal()
                      )}
                    </span>{" "}
                    more for FREE shipping!
                  </div>
                )}

                <div className="border-t pt-3 mt-3">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span className="text-orange-600">
                      {formatPrice(getTotal())}
                    </span>
                  </div>
                </div>
              </div>

              <Link
                href="/checkout"
                className="block w-full mt-6 py-3 bg-orange-600 text-white text-center font-bold rounded-lg hover:bg-orange-700 transition-colors"
              >
                Proceed to Checkout
              </Link>

              {/* Payment Methods */}
              <div className="mt-6 text-center">
                <p className="text-xs text-gray-500 mb-2">Secure Payment</p>
                <div className="flex justify-center gap-2 text-gray-400 text-sm">
                  <span>💳 Visa</span>
                  <span>💳 MC</span>
                  <span>💳 Amex</span>
                  <span>🅿️ PayPal</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
