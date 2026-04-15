import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { CartItem } from "@/lib/data"

interface CartState {
  items: CartItem[]
  addItem: (item: CartItem) => void
  removeItem: (listingId: string) => void
  updateQty: (listingId: string, qty: number) => void
  clearCart: () => void
  total: () => number
}

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item) => {
        const existing = get().items.find(i => i.listingId === item.listingId)
        if (existing) {
          set({ items: get().items.map(i => i.listingId === item.listingId ? { ...i, quantity: i.quantity + 1 } : i) })
        } else {
          set({ items: [...get().items, item] })
        }
      },
      removeItem: (listingId) => set({ items: get().items.filter(i => i.listingId !== listingId) }),
      updateQty: (listingId, qty) => {
        if (qty <= 0) { get().removeItem(listingId); return }
        set({ items: get().items.map(i => i.listingId === listingId ? { ...i, quantity: qty } : i) })
      },
      clearCart: () => set({ items: [] }),
      total: () => get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),
    }),
    { name: "p1g-cart" }
  )
)
