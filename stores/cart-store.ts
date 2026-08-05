"use client"

import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"
import type { IProduct } from "@/interfaces"

export interface CartItem {
  productId: string
  name: string
  slug: string
  price: number
  imageUrl: string | null
  weight?: string
  quantity: number
}

interface CartState {
  items: CartItem[]
  _hasHydrated: boolean

  add: (product: IProduct, quantity?: number) => void
  setQuantity: (productId: string, quantity: number) => void
  remove: (productId: string) => void
  clear: () => void
  setHasHydrated: (v: boolean) => void
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      _hasHydrated: false,

      add: (product, quantity = 1) =>
        set((state) => {
          const existing = state.items.find((i) => i.productId === product._id)
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.productId === product._id ? { ...i, quantity: i.quantity + quantity } : i
              ),
            }
          }
          return {
            items: [
              ...state.items,
              {
                productId: product._id,
                name: product.name,
                slug: product.slug,
                price: product.price,
                imageUrl: product.imageUrls[0] ?? null,
                weight: product.weight,
                quantity,
              },
            ],
          }
        }),

      setQuantity: (productId, quantity) =>
        set((state) => ({
          items:
            quantity <= 0
              ? state.items.filter((i) => i.productId !== productId)
              : state.items.map((i) => (i.productId === productId ? { ...i, quantity } : i)),
        })),

      remove: (productId) =>
        set((state) => ({ items: state.items.filter((i) => i.productId !== productId) })),

      clear: () => set({ items: [] }),

      setHasHydrated: (v) => set({ _hasHydrated: v }),
    }),
    {
      name: "samaaceholdings-cart",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ items: state.items }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true)
      },
    }
  )
)

export const selectCartCount = (state: CartState) =>
  state.items.reduce((sum, i) => sum + i.quantity, 0)

export const selectCartSubtotal = (state: CartState) =>
  state.items.reduce((sum, i) => sum + i.price * i.quantity, 0)
