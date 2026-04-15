// ─── Types ────────────────────────────────────────────────────────────────────

export type Role = "buyer" | "seller" | "admin"
export type UserStatus = "active" | "pending" | "suspended"
export type ListingStatus = "active" | "pending" | "rejected"
export type OrderStatus = "pending" | "confirmed" | "in_transit" | "delivered" | "cancelled"
export type Category = "live_pigs" | "semen" | "feed" | "medicines" | "vets" | "pork"

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
  status: ListingStatus
  views: number
  rating: number
  reviewCount: number
  createdAt: string
  image?: string
}

export interface CartItem {
  listingId: string
  title: string
  price: number
  quantity: number
  sellerName: string
  unit: string
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

// ─── Formatters ───────────────────────────────────────────────────────────────

export const formatUGX = (amount: number) =>
  `UGX ${amount.toLocaleString("en-UG")}`

export const CATEGORY_LABELS: Record<Category, string> = {
  live_pigs: "Live Pigs",
  semen: "Breeding Semen",
  feed: "Pig Feed",
  medicines: "Medicines",
  vets: "Vet Services",
  pork: "Pork Products",
}

export const CATEGORY_ICONS: Record<Category, string> = {
  live_pigs: "🐷",
  semen: "🧬",
  feed: "🌾",
  medicines: "💊",
  vets: "🩺",
  pork: "🥩",
}

// ─── Mock Users ───────────────────────────────────────────────────────────────

export const MOCK_USERS: User[] = [
  { id: "u1", name: "Sarah Namukasa", email: "sarah@gmail.com", phone: "0772 345 678", role: "buyer", status: "active", district: "Wakiso", joinedAt: "2024-11-10", lastActive: "2025-04-14" },
  { id: "u2", name: "John Mukasa", email: "john@farmug.com", phone: "0753 123 456", role: "seller", status: "active", district: "Kampala", joinedAt: "2024-09-03", lastActive: "2025-04-13" },
  { id: "u3", name: "Grace Akello", email: "grace@vet.ug", phone: "0701 987 654", role: "seller", status: "pending", district: "Gulu", joinedAt: "2025-04-12", lastActive: "2025-04-12" },
  { id: "u4", name: "Robert Opio", email: "ropio@gmail.com", phone: "0782 654 321", role: "buyer", status: "active", district: "Lira", joinedAt: "2025-01-20", lastActive: "2025-04-10" },
  { id: "u5", name: "Agnes Tendo", email: "agnes@piggery.ug", phone: "0759 111 222", role: "seller", status: "pending", district: "Mbarara", joinedAt: "2025-04-11", lastActive: "2025-04-11" },
  { id: "u6", name: "David Ssali", email: "david@feed.ug", phone: "0712 333 444", role: "seller", status: "active", district: "Jinja", joinedAt: "2024-08-15", lastActive: "2025-04-09" },
  { id: "u7", name: "Prossy Nabuuma", email: "prossy@gmail.com", phone: "0793 555 666", role: "buyer", status: "suspended", district: "Entebbe", joinedAt: "2024-12-01", lastActive: "2025-03-20" },
  { id: "u8", name: "Moses Kato", email: "mkato@farms.ug", phone: "0765 777 888", role: "seller", status: "pending", district: "Masaka", joinedAt: "2025-04-10", lastActive: "2025-04-10" },
]

// ─── Mock Listings ─────────────────────────────────────────────────────────────

export const MOCK_LISTINGS: Listing[] = [
  { id: "l1", sellerId: "u2", sellerName: "John Mukasa", sellerVerified: true, title: "Large White Boar — 8 months", description: "Healthy, well-fed Large White boar ready for breeding. Vaccinated and dewormed. Weight approx. 120kg.", category: "live_pigs", price: 950000, stock: 3, unit: "pig", district: "Kampala", status: "active", views: 284, rating: 4.8, reviewCount: 23, createdAt: "2025-03-15" },
  { id: "l2", sellerId: "u2", sellerName: "John Mukasa", sellerVerified: true, title: "Quality Pig Feed — 50kg Bag", description: "Nutritionally balanced pig grower feed. Contains soybean, maize, and mineral premix. Suitable for weaners to finishers.", category: "feed", price: 85000, stock: 80, unit: "bag", district: "Kampala", status: "active", views: 512, rating: 4.6, reviewCount: 41, createdAt: "2025-02-20" },
  { id: "l3", sellerId: "u2", sellerName: "John Mukasa", sellerVerified: true, title: "Landrace Breeding Semen Dose", description: "Certified Landrace boar semen, fresh or chilled. AI quality, 3 billion sperm per dose. 90%+ conception rate.", category: "semen", price: 120000, stock: 15, unit: "dose", district: "Kampala", status: "pending", views: 98, rating: 0, reviewCount: 0, createdAt: "2025-04-10" },
  { id: "l4", sellerId: "u6", sellerName: "David Ssali", sellerVerified: true, title: "Deworming Medicine Pack", description: "Albendazole-based dewormer for pigs. 100ml bottle treats up to 20 pigs. Effective against roundworms and tapeworms.", category: "medicines", price: 45000, stock: 200, unit: "bottle", district: "Jinja", status: "active", views: 330, rating: 4.9, reviewCount: 67, createdAt: "2025-01-08" },
  { id: "l5", sellerId: "u2", sellerName: "John Mukasa", sellerVerified: true, title: "Duroc Gilt — 5 months", description: "Pure Duroc gilt, excellent growth rate and feed conversion. Ready for breeding at 7 months. Weight 85kg.", category: "live_pigs", price: 780000, stock: 2, unit: "pig", district: "Kampala", status: "rejected", views: 156, rating: 0, reviewCount: 0, createdAt: "2025-04-01" },
  { id: "l6", sellerId: "u6", sellerName: "David Ssali", sellerVerified: true, title: "Pig Starter Crumbles — 25kg", description: "High-protein starter feed for piglets 2–8 weeks. Contains essential amino acids and vitamins for rapid growth.", category: "feed", price: 62000, stock: 120, unit: "bag", district: "Jinja", status: "active", views: 199, rating: 4.7, reviewCount: 28, createdAt: "2025-03-05" },
  { id: "l7", sellerId: "u3", sellerName: "Grace Akello", sellerVerified: false, title: "Mobile Veterinary Services", description: "Qualified vet offering farm visits in Gulu and Acholi sub-region. Services: vaccination, health checks, AI, treatment.", category: "vets", price: 150000, stock: 999, unit: "visit", district: "Gulu", status: "pending", views: 44, rating: 0, reviewCount: 0, createdAt: "2025-04-12" },
  { id: "l8", sellerId: "u6", sellerName: "David Ssali", sellerVerified: true, title: "Pork Sausages — 1kg Pack", description: "Fresh pork sausages from certified abattoir. Available in bulk for hotels and restaurants. No preservatives.", category: "pork", price: 28000, stock: 500, unit: "pack", district: "Jinja", status: "active", views: 87, rating: 4.5, reviewCount: 12, createdAt: "2025-04-05" },
  { id: "l9", sellerId: "u5", sellerName: "Agnes Tendo", sellerVerified: false, title: "Yorkshire × Landrace Weaners", description: "F1 crossbred weaners, 6 weeks old. Fast-growing hybrid with good meat quality. Vaccinated against swine fever.", category: "live_pigs", price: 320000, stock: 10, unit: "pig", district: "Mbarara", status: "pending", views: 61, rating: 0, reviewCount: 0, createdAt: "2025-04-11" },
  { id: "l10", sellerId: "u8", sellerName: "Moses Kato", sellerVerified: false, title: "Ivermectin Injection 50ml", description: "Broad-spectrum antiparasitic for pigs. Effective against internal and external parasites including mange mites.", category: "medicines", price: 38000, stock: 300, unit: "bottle", district: "Masaka", status: "pending", views: 29, rating: 0, reviewCount: 0, createdAt: "2025-04-10" },
]

// ─── Mock Orders ──────────────────────────────────────────────────────────────

export const MOCK_ORDERS: Order[] = [
  {
    id: "ORD-001", buyerId: "u1", buyerName: "Sarah Namukasa",
    items: [{ listingId: "l1", title: "Large White Boar — 8 months", price: 950000, quantity: 1, sellerName: "John Mukasa", unit: "pig" }],
    total: 975000, deliveryFee: 25000, status: "in_transit",
    paymentMethod: "MTN Mobile Money", address: "Plot 14, Kampala Road", district: "Wakiso",
    createdAt: "2025-04-13", updatedAt: "2025-04-14",
  },
  {
    id: "ORD-002", buyerId: "u1", buyerName: "Sarah Namukasa",
    items: [
      { listingId: "l2", title: "Quality Pig Feed — 50kg Bag", price: 85000, quantity: 2, sellerName: "John Mukasa", unit: "bag" },
      { listingId: "l4", title: "Deworming Medicine Pack", price: 45000, quantity: 1, sellerName: "David Ssali", unit: "bottle" },
    ],
    total: 240000, deliveryFee: 15000, status: "delivered",
    paymentMethod: "Airtel Money", address: "Plot 14, Kampala Road", district: "Wakiso",
    createdAt: "2025-04-05", updatedAt: "2025-04-08",
  },
  {
    id: "ORD-003", buyerId: "u4", buyerName: "Robert Opio",
    items: [{ listingId: "l6", title: "Pig Starter Crumbles — 25kg", price: 62000, quantity: 4, sellerName: "David Ssali", unit: "bag" }],
    total: 263000, deliveryFee: 15000, status: "confirmed",
    paymentMethod: "Cash on Delivery", address: "Lira Town, Erute County", district: "Lira",
    createdAt: "2025-04-14", updatedAt: "2025-04-14",
  },
]

// ─── Platform Stats ────────────────────────────────────────────────────────────

export const PLATFORM_STATS = {
  totalUsers: 3240,
  buyers: 3151,
  sellers: 89,
  pendingSellerApprovals: MOCK_USERS.filter(u => u.role === "seller" && u.status === "pending").length,
  pendingListings: MOCK_LISTINGS.filter(l => l.status === "pending").length,
  ordersThisMonth: 428,
  gmv: 284000000,
  activeListings: MOCK_LISTINGS.filter(l => l.status === "active").length,
}

// ─── Auth Store (simple in-memory) ────────────────────────────────────────────

export const DEMO_ACCOUNTS = {
  admin:  { email: "admin@p1gmarket.ug",  password: "admin123",  role: "admin"  as Role, userId: "admin-1", name: "Super Admin" },
  seller: { email: "seller@p1gmarket.ug", password: "seller123", role: "seller" as Role, userId: "u2",      name: "John Mukasa" },
  buyer:  { email: "buyer@p1gmarket.ug",  password: "buyer123",  role: "buyer"  as Role, userId: "u1",      name: "Sarah Namukasa" },
}
