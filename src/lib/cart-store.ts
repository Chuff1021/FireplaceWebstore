import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Product } from "./store-config";

export interface CartItem {
  product: Product;
  quantity: number;
}

interface CartStore {
  items: CartItem[];
  isOpen: boolean;
  
  // Actions
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  toggleCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  
  // Computed
  getItemCount: () => number;
  getSubtotal: () => number;
  getShipping: () => number;
  getTax: () => number;
  getTotal: () => number;
}

// Shipping and tax are quoted by the server after the destination is supplied.
export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      
      addItem: (product, quantity = 1) => {
        set((state) => {
          const existingItem = state.items.find(
            (item) => (item.product.sourceKey && product.sourceKey ? item.product.sourceKey === product.sourceKey : item.product.sku === product.sku && item.product.categoryId === product.categoryId)
          );
          
          if (existingItem) {
            return {
              items: state.items.map((item) =>
                (item.product.sourceKey && product.sourceKey ? item.product.sourceKey === product.sourceKey : item.product.sku === product.sku && item.product.categoryId === product.categoryId)
                  ? { ...item, quantity: item.quantity + quantity }
                  : item
              ),
            };
          }
          
          return {
            items: [...state.items, { product, quantity }],
          };
        });
      },
      
      removeItem: (productId) => {
        set((state) => ({
          items: state.items.filter((item) => item.product.id !== productId),
        }));
      },
      
      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId);
          return;
        }
        
        set((state) => ({
          items: state.items.map((item) =>
            item.product.id === productId ? { ...item, quantity } : item
          ),
        }));
      },
      
      clearCart: () => set({ items: [] }),
      
      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      
      getItemCount: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },
      
      getSubtotal: () => {
        return get().items.reduce((total, item) => {
          const price = item.product.salePrice ?? item.product.price;
          return total + price * item.quantity;
        }, 0);
      },
      
      getShipping: () => 0,
      getTax: () => 0,

      getTotal: () => {
        return get().getSubtotal() + get().getShipping() + get().getTax();
      },
    }),
    {
      name: "fireplace-cart",
      version: 1,
      migrate: (persisted: unknown) => {
        const state = persisted as { items?: CartItem[] };
        return { items: (state.items || []).filter(item => Number.isInteger(item.quantity) && item.quantity > 0 && item.quantity <= 100) };
      },
    }
  )
);
