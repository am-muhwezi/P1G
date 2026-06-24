import { create } from "zustand"
import { persist } from "zustand/middleware"

export interface WishlistItem {
  listingId: string
  title: string
  price: number
  sellerName: string
  unit: string
  district: string
  image?: string
}

interface WishlistState {
  items: WishlistItem[]
  addItem: (item: WishlistItem) => void
  removeItem: (listingId: string) => void
  isWishlisted: (listingId: string) => boolean
  clearWishlist: () => void
}

export const useWishlist = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item) => {
        if (get().items.find((i) => i.listingId === item.listingId)) return
        set({ items: [...get().items, item] })
      },
      removeItem: (listingId) => set({ items: get().items.filter((i) => i.listingId !== listingId) }),
      isWishlisted: (listingId) => get().items.some((i) => i.listingId === listingId),
      clearWishlist: () => set({ items: [] }),
    }),
    { name: "p1g-wishlist" },
  ),
)
