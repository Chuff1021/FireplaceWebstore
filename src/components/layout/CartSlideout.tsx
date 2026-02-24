"use client";

import Link from "next/link";
import { X, Plus, Minus, Trash2, ShoppingBag } from "lucide-react";
import { useCartStore } from "@/lib/cart-store";
import { defaultStoreConfig } from "@/lib/store-config";

export function CartSlideout() {
  const {
    items,
    isOpen,
    closeCart,
    removeItem,
    updateQuantity,
    getSubtotal,
    getShipping,
    getTax,
    getTotal,
  } = useCartStore();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-50 transition-opacity"
          onClick={closeCart}
        />
      )}

      {/* Slideout */}
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl z-50 transform transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <ShoppingBag className="w-5 h-5" />
              Your Cart ({items.length})
            </h2>
            <button
              onClick={closeCart}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-4">
            {items.length === 0 ? (
              <div className="text-center py-12">
                <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 mb-4">Your cart is empty</p>
                <Link
                  href="/shop"
                  className="inline-block px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
                  onClick={closeCart}
                >
                  Start Shopping
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {items.map((item) => (
                  <div
                    key={item.product.id}
                    className="flex gap-4 p-3 bg-gray-50 rounded-lg"
                  >
                    {/* Product Image Placeholder */}
                    <div className="w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="text-3xl">🔥</span>
                    </div>

                    <div className="flex-1 min-w-0">
                      <Link
                        href={`/product/${item.product.slug}`}
                        className="font-medium text-gray-900 hover:text-orange-600 line-clamp-2"
                        onClick={closeCart}
                      >
                        {item.product.name}
                      </Link>
                      <p className="text-sm text-gray-500">{item.product.brand}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="font-bold text-orange-600">
                          {formatPrice(item.product.salePrice ?? item.product.price)}
                        </span>
                        {item.product.salePrice && (
                          <span className="text-sm text-gray-400 line-through">
                            {formatPrice(item.product.price)}
                          </span>
                        )}
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-2 mt-2">
                        <button
                          onClick={() =>
                            updateQuantity(item.product.id, item.quantity - 1)
                          }
                          className="p-1 hover:bg-gray-200 rounded transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="w-8 text-center font-medium">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(item.product.id, item.quantity + 1)
                          }
                          className="p-1 hover:bg-gray-200 rounded transition-colors"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => removeItem(item.product.id)}
                          className="p-1 hover:bg-red-100 text-red-600 rounded transition-colors ml-auto"
                          aria-label="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {items.length > 0 && (
            <div className="border-t p-4 space-y-4 bg-gray-50">
              {/* Free Shipping Notice */}
              {getSubtotal() < defaultStoreConfig.business.freeShipping.minimum && (
                <div className="bg-orange-50 text-orange-800 text-sm p-3 rounded-lg">
                  Add{" "}
                  <span className="font-bold">
                    {formatPrice(
                      defaultStoreConfig.business.freeShipping.minimum - getSubtotal()
                    )}
                  </span>{" "}
                  more for FREE shipping!
                </div>
              )}

              {/* Totals */}
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
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
                <div className="flex justify-between text-lg font-bold pt-2 border-t">
                  <span>Total</span>
                  <span className="text-orange-600">{formatPrice(getTotal())}</span>
                </div>
              </div>

              {/* Checkout Button */}
              <Link
                href="/checkout"
                className="block w-full py-3 bg-orange-600 text-white text-center font-bold rounded-lg hover:bg-orange-700 transition-colors"
                onClick={closeCart}
              >
                Proceed to Checkout
              </Link>
              <Link
                href="/cart"
                className="block w-full py-2 text-center text-gray-600 hover:text-orange-600 transition-colors"
                onClick={closeCart}
              >
                View Full Cart
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
