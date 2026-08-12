export type Role = "buyer" | "seller" | "admin"
export type UserStatus = "active" | "pending" | "suspended"
export type ListingStatus = "active" | "pending" | "rejected" | "sold_out"
export type OrderStatus = "pending" | "confirmed" | "in_transit" | "delivered" | "cancelled"
export type Category = "live_pigs" | "semen" | "feed" | "medicines" | "vets" | "pork"

export const CATEGORY_LABELS: Record<Category, string> = {
  live_pigs: "Live Pigs",
  semen: "Breeding Semen",
  feed: "Pig Feed",
  medicines: "Medicines",
  vets: "Vet Services",
  pork: "Pork Products",
}

export const CATEGORY_EMOJI: Record<Category, string> = {
  live_pigs: "\u{1F437}",
  semen: "\u{1F9EC}",
  feed: "\u{1F33E}",
  medicines: "\u{1F48A}",
  vets: "\u{1FA7A}",
  pork: "\u{1F969}",
}

export function formatUGX(amount: number | undefined | null): string {
  if (amount == null) return "UGX 0"
  return `UGX ${amount.toLocaleString("en-UG")}`
}

export interface User {
  id: string
  name: string
  email: string
  phone: string
  role: Role
  status: UserStatus
  district: string
  joinedAt: string
  lastActive: string
  avatar?: string
}

export interface Listing {
  id: string
  sellerId: string
  sellerName: string
  sellerVerified: boolean
  title: string
  description: string
  category: Category
  price: number
  stock: number
  unit: string
  district: string
  sex?: string
  breed?: string
  ageMonths?: number
  ageWeeks?: number
  status: ListingStatus
  views: number
  rating: number
  reviewCount: number
  createdAt: string
  image?: string
  images?: string[]
}

export interface CartItem {
  listingId: string
  title: string
  price: number
  quantity: number
  sellerName: string
  unit: string
  stock: number
}

export interface Order {
  id: string
  buyerId: string
  buyerName: string
  items: CartItem[]
  total: number
  deliveryFee: number
  status: OrderStatus
  paymentMethod: string
  address: string
  district: string
  notes?: string
  createdAt: string
  updatedAt: string
}

export interface Message {
  id: string
  senderId: string
  senderRole: Role
  body: string
  createdAt: string
}

export interface Conversation {
  id: string
  buyerId: string
  buyerName: string
  sellerId: string
  sellerName: string
  listingId?: string
  listingTitle?: string
  lastMessage: string
  lastMessageAt: string
  unreadCount: number
  createdAt: string
}

export interface ConversationDetail extends Conversation {
  messages: Message[]
}

export interface CategoryDisplay {
  id: string
  name: string
  emoji: string
  count: number
}

export function formatDate(iso: string): string {
  if (!iso) return "--"
  const d = new Date(iso)
  if (isNaN(d.getTime())) return "--"
  return d.toLocaleDateString("en-UG", { year: "numeric", month: "short", day: "numeric" })
}

export function formatOrderId(id: string): string {
  if (!id) return "--"
  return `#${id.slice(0, 8).toUpperCase()}`
}

export const UGANDAN_DISTRICTS = [
  "Kampala",
  "Masaka",
  "Mukono",
  "Mbarara",
  "Luweero",
  "Mpigi",
  "Wakiso",
  "Jinja",
  "Mbale",
  "Gulu",
  "Lira",
  "Fort Portal",
  "Kabale",
  "Busia",
  "Tororo",
  "Arua",
  "Soroti",
  "Mityana",
  "Kayunga",
  "Rakai",
] as const

export const marketplaceFilters = [
  { id: "all", label: "All Categories" },
  { id: "price", label: "Price", icon: "payments" },
  { id: "location", label: "Location", icon: "location_on" },
  { id: "breed", label: "Breed", icon: "pets" },
  { id: "verified", label: "Verified Only", icon: "verified" },
]
