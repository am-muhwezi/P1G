import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { CartItem } from "../lib/data"

export interface ReconcileChange {
  listingId: string
  title: string
  type: "removed" | "clamped"
  from?: number
  to?: number
}

interface LiveListing {
  id: string
  status: string
  stock: number
  price: number
}

interface CartState {
  items: CartItem[]
  addItem: (item: CartItem) => void
  removeItem: (listingId: string) => void
  updateQty: (listingId: string, qty: number) => void
  clearCart: () => void
  total: () => number
  reconcile: (liveListings: LiveListing[]) => ReconcileChange[]
}

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item) => {
        const existing = get().items.find((i) => i.listingId === item.listingId)
        if (existing) {
          const nextQty = Math.min(existing.quantity + 1, item.stock)
          set({ items: get().items.map((i) => i.listingId === item.listingId ? { ...i, quantity: nextQty, stock: item.stock, price: item.price } : i) })
        } else {
          set({ items: [...get().items, { ...item, quantity: Math.min(item.quantity, item.stock) }] })
        }
      },
      removeItem: (listingId) => set({ items: get().items.filter((i) => i.listingId !== listingId) }),
      updateQty: (listingId, qty) => {
        if (qty <= 0) { get().removeItem(listingId); return }
        set({ items: get().items.map((i) => i.listingId === listingId ? { ...i, quantity: Math.min(qty, i.stock) } : i) })
      },
      clearCart: () => set({ items: [] }),
      total: () => get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),
      reconcile: (liveListings) => {
        const liveMap = new Map(liveListings.map((l) => [l.id, l]))
        const changes: ReconcileChange[] = []
        const nextItems: CartItem[] = []
        for (const item of get().items) {
          const live = liveMap.get(item.listingId)
          if (!live || live.status !== "active" || live.stock <= 0) {
            changes.push({ listingId: item.listingId, title: item.title, type: "removed" })
            continue
          }
          const clampedQty = Math.min(item.quantity, live.stock)
          if (clampedQty !== item.quantity) {
            changes.push({ listingId: item.listingId, title: item.title, type: "clamped", from: item.quantity, to: clampedQty })
          }
          nextItems.push({ ...item, stock: live.stock, price: live.price, quantity: clampedQty })
        }
        if (changes.length) set({ items: nextItems })
        return changes
      },
    }),
    { name: "p1g-cart" },
  ),
)
