export type Role = "buyer" | "seller" | "admin"
export type UserStatus = "active" | "pending" | "suspended"
export type ListingStatus = "active" | "pending" | "rejected"
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

export function categoryCount(): Record<Category, number> {
  const counts: Record<string, number> = {}
  for (const c of Object.keys(CATEGORY_LABELS) as Category[]) counts[c] = 0
  for (const l of MOCK_LISTINGS) if (l.status === "active") counts[l.category] = (counts[l.category] || 0) + 1
  return counts as Record<Category, number>
}

export function formatUGX(amount: number): string {
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

export interface CategoryDisplay {
  id: string
  name: string
  emoji: string
  count: number
}

export interface DemoAccount {
  email: string
  password: string
  role: Role
  name: string
}

export const DEMO_ACCOUNTS: DemoAccount[] = [
  { email: "buyer@p1gmarket.ug", password: "buyer123", role: "buyer", name: "John Buyer" },
  { email: "seller@p1gmarket.ug", password: "seller123", role: "seller", name: "Mukasa Farms" },
  { email: "admin@p1gmarket.ug", password: "admin123", role: "admin", name: "Admin User" },
]

const baseImages = {
  logo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDirzDVqzKEaXQGNCPVax5QGy4AFoBUwWeDtgBps9Vjgi6bi_pPJCsOQ-YXfCZNyhbUhDL1XGWrY8J-sU8Kp6lVhomjsWjF1mT-pT7Mmmy4704NDUhJ2WkG6t3XSWTlxY3W9yIvFBYGFcqfHpoC2kx4hQdz45OrKcb4cfugxV0qUy2D_fvMxmv9hW0nVQH6dGbAZEiOzd15hZ5Jv5TKxIpSa4tm3-OKsQXY2CmeICNxuzZxxYvkcFikyDvvC4rf88tkczCra2jIYuA_',
  hero: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCMdyV7O60I_AL3t1HDhq1ew7Cbq9DrV9wqYTHOFtBeoOAUKIWvrUOLOzJU0HZpMHzvq9hisuEF3Qpf7LkuFj15gXomZMEi9bANAnbClDQ1vqtoN5F6FrcGHnLxR0B_hudjAGpE_ObTviXYsulgdTlts-IrM4fxuSdhB1v8v6FF9DLfRkqLCsLhhWPeiCdtX6w0AglqLb8fsMgm396YPmLl2Agu0DwwCIDv_gxpVAiH7DT2GWPLXzVK5SHQbETbRqCB3CCxy4du7F4v',
  boar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCbLOsNPkgdetfPXp6QkiE8jvTHo-OPW3xjdwKKgEVP-_aAgX7n4CXEHQd65SzBr-Fd_V4v6OX1m7OYqeLshBd2KXEkcb2FXKlRhRPT6UqzqAjhJ2Yg2DzPJdDuFHI_pGV3XmMs01_L_NhpU8zicIaA0s73jUuQumzooOjTBUzsTt1xjHzbWjtqnfLTbitbfzh-Q1NtNnHykmFuDukVviR3VDUClyA-QC4tL9sHFRTgqGycFZPOBxiqhoI_jD_G5IKo9IiBUQzROCRE',
  porkBelly: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCv6-wrnYFX08cpQuYIw7WKn1k7B-ca44n6hoSaOiZsb5rnqM8JDJDqVtZA1V5NmkC0RJUoOEMdriJoyG16sz-YlR9SdPjFZCelh42RtZKIuKsNk03DYReYQHO_N5RrsbC3Czf9O_KrQ0XAMfS9xyjNpFKKPHIzK3rH4NDNteBYGCXfJwjRX1TRdfuijITS8JszodfAYoHloziWtOeeBnZb1m41E0U0TYTrtijd33DodhL-_zNLmBupUvSAJ8XS4lTdtOIOgf9FAcX2',
  durocPiglets: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDE9LKdfSxIdD_hNvDF9VaWeY2V78nETarJPqskrqtn1VnuAkrQdNejgc78aYrZyHvRzX4bYhSRq_CweFmn4ydXpride1veE0raUNl__RE6ULbYwQlBoC2JCq2VulUQJMFnGfG3NLRN90ahn-6BLLOZYl_Snqr4dOGv_GRp9FJwLLS_kkaAJP_Plh-n2X-QQ9ePP9Tlm-0h0n7LUVk8DbWYkro-wX9fPCwmI_Kqblc9dB-2biYLv-Dr_b_Xngdl0mDXm6jmV3yfjde7',
  landrace: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC0XtElA0MPYrUsMBQtQ8glMg9qnEqQ1fGpo9ttzb-oFgax4fs3RJtFILYavzJMEPFgXanjhTXJXkeZxG_lb9z7JC1LH0KxhtIECGu2ZrdsvEMtVWSeI03awGEs9D5fyvIzqbJ70dBtg-kw3sNoI8l6-xNYlzkgCpRQBLYQOWdCx27dg1GFLLWiE5koqWV1NxlvO3ZNK7CkaAGjWge-z1skdIadSFKQCU3yZtUopRGtqONi4CGcbl1UVYM91XlQBfqWnb5m7IbT1y6-',
  landraceProfile: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAnvv9W83Vc25-BsDAdWRqN_pkzN1sqw9hzUvQhNJT-VcEh8TM00AJHzGjUSecZPF4tKdz7-1KYxN8RYw992ER4uAUi_Q33OO9_ptE4YLsv1djkgd-h2I3hweVP7i7FxldXqTAZ-sKQdyHjCko0AmDHL7JtdEDgqXpPbPSdZb6y-WVjXmADLvRyFAPpKQvCedVFkIgKrT4kNVliEUZ0gNw5Xa_CzLPpdyAzH9pFmtIANhnubBYydwyL0s20V39UbD72HAsLW7nrap5G',
  landraceFarm: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCoaRMBUHDa6sdEmPvm4pxjHyq_bgL8JP8Fw7U0bQZLUTYaXq_mDTCpT89hMq00B_OzLv5y05dAyqgam0WMMlGc9pa4CJyRwKfNZ9jfSln6NZcf0ce02iiiopIHd8MAttOyVFiVbOy7IRwtsS1Gt7eMNKS6Njb0Erk_8KEr8My78iFHo3D9-rti1D7iwWAsypMLtp0UVv7OpPQNR7jReqVsCT_HVDE8Y9NNvei2DNYOw5K2e5IPUDUnvW2Q2W5du6avMKiGFJGiaHwp',
  durocBreed: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDVCDscL5T-TGkAYO5z2tG1PNf5_9oE4wccPiviQ9aU-sLccZWKacTS__mj1Ze_qazPY6uB30EOdXlDPGs0ry69wH9wUmzFiOURsGrVPzEApMPB5h6eenStI2FC6VdG83qh1f-emUeD5Px3oLbjpx785hzDxZHV9TKhrE65UZ-b5_4HubnxFiEfI50OLEcvEZt-PupkmqIguD-mYtsWw2kDsTi4BHlvf0lNYu55z-eMlvKus10tL-aLLQMx46zG45dXlpsmACk2UBiP',
  largeWhiteSow: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB7UcqIjZ_U58EzZzmu0ihSHrWi7gMrw9ptUpN14XEbBp6qQLT8rL-xe9MB7N041v2HCYOfW4j2tFfhxUrkNwR7tliGOwQIs8D_Frm25m3Ou4dngwQUQ6jfbZZjm12M-Y_IXDgaYD971h6ELrf6FW7pvkv0sg0lkMyMnbV_LCNNULWgU2TtNZb9t07bFGMJsUm1ttAjhvqOYd0Vi4q8Ijdnwt9W_wF7neVwBGCfyj9rK7OJBhOKww8Q9_33sJeBByeog2Jw6-7EtV3H',
  camborough: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAc6L4onvhZXCPYKol75YQrTWVRvLzJifPtZ1wzBxyuHIOITA3n369kgOPh2-RbJsbRMIXaBPzCzLZlyZmXW75FHcrmKVvgtjv-_lxFXj5R9iqlYKUjDfAuras1eD3Fpd7bYLftuRqnx43YdQ2w_x2I8uDEO4YUOYFUur4UIt-26pkyceoBhUl1bjI8oVCp2SJsH8AUTt2qvgdJAh5wi4Y-O8N5w2cle5FHzbIGsaGrSa2iwIQZmlfAq8lsGZfEJ2LsY-AuANkSZhwU',
  categoryLivePigs: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCJ437yw08JePO45AwGN2EsGTr5qXXrXwRtKc3IANTOU4vYcGmeYUt1F8trSdGi_xrKl8h2NEWLNolvvLDDv9x6WEYobpl9AAJ91JQGfxKFHv59K8HxRKlIiHMzFFjKRrCV3b7CifhDQwR_WmU4iP-LRX-pUAH5gWsfvOAHjKI-nWIgOpaItMFCvGtmEhBYFjiB3mCfuJbQ6qmTFO67r1gzFTYnLqtTXAorD8aJ-skbSvff5MFIn22Jt74CfuOEp_0VschWxPHCa2XC',
  categoryPrimeCuts: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC0WwNdHem0lVlLPPjpL0gcIfAZvaCAASG2XNSVC895e2c1j5EbrKt4KwVOgF7tKqgY5bvA28_jDTMLOFgpXk8i9L24nCnnlxFHlI5TvC49v6578VPUklNbo3dFHth1CLGyERnvVbUD4ZTFFx5QFgp4dM3qTPLTxEFRxRE0SqdU2-7Qxx6hOgHOv1sl_W5GqP_Nopkh-mVZbypJcrXBQxHZ5b8vAgr1_VDrj-hOpnx6leB4TewSslJfPHDVNP6M9GyBv8HgWysYg2b4',
  farmerAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDOq0CWLll9koU5IhjUHNNrWBs5Zl9wju3BcI8VPERfztGYPYTRXwV01TG7uUkxTCv_sJYy3JyOBtRSS8arkyVRYlZrFqNTZ7FI01Sd0So3HMESNW4ouCwMKK2LhROhZmvi3zmFq4hmDR8_4ok76fG10EigwAM-i9A_0pdXC3C784h7NzWSYQ_IeGlLwylf_OYXZclqouRO7m2AO71WeY2l3juuoiAO9cFklR-VVi_ueBXrTHMHqsKC2jv1CmAZN40SwyurDOUVj5LH',
}

export const MOCK_USERS: User[] = [
  { id: "buyer-1", name: "John Buyer", email: "buyer@p1gmarket.ug", phone: "0772 345 678", role: "buyer", status: "active", district: "Kampala", joinedAt: "2024-01-15", lastActive: "2025-06-22", avatar: baseImages.farmerAvatar },
  { id: "seller-1", name: "Mukasa Farms", email: "seller@p1gmarket.ug", phone: "0755 123 456", role: "seller", status: "active", district: "Masaka", joinedAt: "2022-01-10", lastActive: "2025-06-23", avatar: baseImages.farmerAvatar },
  { id: "admin-1", name: "Admin User", email: "admin@p1gmarket.ug", phone: "0700 000 000", role: "admin", status: "active", district: "Kampala", joinedAt: "2023-06-01", lastActive: "2025-06-23" },
  { id: "seller-2", name: "Mukono Quality Meats", email: "mukono@example.com", phone: "0778 901 234", role: "seller", status: "active", district: "Mukono", joinedAt: "2023-03-20", lastActive: "2025-06-21", avatar: baseImages.farmerAvatar },
  { id: "seller-3", name: "Mbarara Estates", email: "mbarara@example.com", phone: "0789 012 345", role: "seller", status: "pending", district: "Mbarara", joinedAt: "2025-01-05", lastActive: "2025-06-20" },
  { id: "seller-4", name: "Luweero Tech Farm", email: "luweero@example.com", phone: "0765 432 109", role: "seller", status: "active", district: "Luweero", joinedAt: "2023-11-12", lastActive: "2025-06-19", avatar: baseImages.farmerAvatar },
]

export const MOCK_LISTINGS: Listing[] = [
  { id: "lst-1", sellerId: "seller-1", sellerName: "Mukasa Farms", sellerVerified: true, title: "Large White Boar - 80kg", description: "A massive, healthy Large White Boar. Perfect for breeding or slaughter.", category: "live_pigs", price: 1200000, stock: 2, unit: "pig", district: "Masaka", status: "active", views: 342, rating: 4.5, reviewCount: 28, createdAt: "2025-06-21", image: baseImages.boar },
  { id: "lst-2", sellerId: "seller-2", sellerName: "Mukono Quality Meats", sellerVerified: true, title: "Premium Pork Belly - 5kg", description: "Premium thick-cut pork belly with exquisite marbling.", category: "pork", price: 85000, stock: 15, unit: "kg", district: "Mukono", status: "active", views: 521, rating: 4.8, reviewCount: 42, createdAt: "2025-06-22", image: baseImages.porkBelly },
  { id: "lst-3", sellerId: "seller-1", sellerName: "Mukasa Farms", sellerVerified: true, title: "Duroc Piglets - Set of 5", description: "Healthy reddish-brown Duroc piglets from a modern nursery.", category: "live_pigs", price: 600000, stock: 3, unit: "set", district: "Mpigi", status: "active", views: 189, rating: 4.3, reviewCount: 15, createdAt: "2025-06-18", image: baseImages.durocPiglets },
  { id: "lst-4", sellerId: "seller-1", sellerName: "Mukasa Farms", sellerVerified: true, title: "Purebred Duroc Gilt", description: "Pedigree Duroc gilt with deep mahogany coat. Strong and well-bred.", category: "live_pigs", price: 1200000, stock: 1, unit: "pig", district: "Masaka", status: "active", views: 276, rating: 4.6, reviewCount: 22, createdAt: "2025-06-16", image: baseImages.durocBreed },
  { id: "lst-5", sellerId: "seller-4", sellerName: "Luweero Tech Farm", sellerVerified: true, title: "Large White Sow - Proven Breeder", description: "Proven breeder with excellent mothering ability and calm temperament.", category: "live_pigs", price: 950000, stock: 2, unit: "pig", district: "Mbarara", status: "active", views: 198, rating: 4.2, reviewCount: 19, createdAt: "2025-06-20", image: baseImages.largeWhiteSow },
  { id: "lst-6", sellerId: "seller-4", sellerName: "Luweero Tech Farm", sellerVerified: true, title: "Camborough Line 24", description: "Athletic and well-proportioned Camborough breed. High FCR.", category: "live_pigs", price: 1100000, stock: 1, unit: "pig", district: "Luweero", status: "active", views: 156, rating: 4.1, reviewCount: 11, createdAt: "2025-06-19", image: baseImages.camborough },
  { id: "lst-7", sellerId: "seller-1", sellerName: "Mukasa Farms", sellerVerified: true, title: "Premium Landrace Sow", description: "Superior breeding stock with exceptional genetic lineage. Peak health.", category: "live_pigs", price: 1450000, stock: 1, unit: "pig", district: "Luweero", status: "active", views: 412, rating: 4.9, reviewCount: 35, createdAt: "2025-06-21", image: baseImages.landrace },
  { id: "lst-8", sellerId: "seller-2", sellerName: "Mukono Quality Meats", sellerVerified: true, title: "Organic Feed - Maize Blend 50kg", description: "High-energy organic maize feed blend. Perfect for finishing pigs.", category: "feed", price: 95000, stock: 40, unit: "bag", district: "Mukono", status: "active", views: 87, rating: 4.0, reviewCount: 8, createdAt: "2025-06-15", image: "" },
  { id: "lst-9", sellerId: "seller-1", sellerName: "Mukasa Farms", sellerVerified: true, title: "Weaner Piglets - Large White Cross", description: "Ready-to-feed weaners, 8 weeks old. Vaccinated and dewormed.", category: "live_pigs", price: 350000, stock: 10, unit: "pig", district: "Masaka", status: "pending", views: 45, rating: 0, reviewCount: 0, createdAt: "2025-06-23", image: "" },
]

export const MOCK_ORDERS: Order[] = [
  {
    id: "ORD-001", buyerId: "buyer-1", buyerName: "John Buyer",
    items: [{ listingId: "lst-1", title: "Large White Boar - 80kg", price: 1200000, quantity: 1, sellerName: "Mukasa Farms", unit: "pig" }],
    total: 1200000, deliveryFee: 50000, status: "confirmed", paymentMethod: "MTN Mobile Money",
    address: "Plot 15, Kampala Road", district: "Kampala", createdAt: "2025-06-22T10:30:00Z", updatedAt: "2025-06-22T11:00:00Z",
  },
  {
    id: "ORD-002", buyerId: "buyer-1", buyerName: "John Buyer",
    items: [{ listingId: "lst-3", title: "Duroc Piglets - Set of 5", price: 600000, quantity: 1, sellerName: "Mukasa Farms", unit: "set" }],
    total: 600000, deliveryFee: 30000, status: "in_transit", paymentMethod: "Airtel Money",
    address: "Plot 15, Kampala Road", district: "Kampala", createdAt: "2025-06-20T14:00:00Z", updatedAt: "2025-06-21T09:00:00Z",
  },
  {
    id: "ORD-003", buyerId: "buyer-1", buyerName: "John Buyer",
    items: [{ listingId: "lst-2", title: "Premium Pork Belly - 5kg", price: 85000, quantity: 2, sellerName: "Mukono Quality Meats", unit: "kg" }],
    total: 170000, deliveryFee: 15000, status: "delivered", paymentMethod: "Cash on Delivery",
    address: "Plot 15, Kampala Road", district: "Kampala", createdAt: "2025-06-18T08:00:00Z", updatedAt: "2025-06-19T12:00:00Z",
  },
  {
    id: "ORD-004", buyerId: "buyer-1", buyerName: "John Buyer",
    items: [{ listingId: "lst-7", title: "Premium Landrace Sow", price: 1450000, quantity: 1, sellerName: "Mukasa Farms", unit: "pig" }],
    total: 1450000, deliveryFee: 60000, status: "pending", paymentMethod: "Bank Transfer",
    address: "Plot 15, Kampala Road", district: "Kampala", createdAt: "2025-06-23T06:00:00Z", updatedAt: "2025-06-23T06:00:00Z",
  },
  {
    id: "ORD-005", buyerId: "buyer-1", buyerName: "John Buyer",
    items: [{ listingId: "lst-8", title: "Organic Feed - Maize Blend 50kg", price: 95000, quantity: 5, sellerName: "Mukono Quality Meats", unit: "bag" }],
    total: 475000, deliveryFee: 25000, status: "cancelled", paymentMethod: "MTN Mobile Money",
    address: "Plot 15, Kampala Road", district: "Kampala", notes: "Buyer requested cancellation", createdAt: "2025-06-17T16:00:00Z", updatedAt: "2025-06-18T10:00:00Z",
  },
]

export function listingFromId(id: string): Listing | undefined {
  return MOCK_LISTINGS.find(l => l.id === id)
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-UG", { year: "numeric", month: "short", day: "numeric" })
}

export function getCategoryDisplays(): CategoryDisplay[] {
  const counts = categoryCount()
  return (Object.keys(CATEGORY_LABELS) as Category[]).map((id) => ({
    id,
    name: CATEGORY_LABELS[id],
    emoji: CATEGORY_EMOJI[id],
    count: counts[id],
  }))
}

export const marketplaceFilters = [
  { id: "all", label: "All Categories" },
  { id: "price", label: "Price", icon: "payments" },
  { id: "location", label: "Location", icon: "location_on" },
  { id: "breed", label: "Breed", icon: "pets" },
  { id: "verified", label: "Verified Only", icon: "verified" },
]

export function getSellerStats(sellerId: string) {
  const sellerListings = MOCK_LISTINGS.filter(l => l.sellerId === sellerId)
  const activeListings = sellerListings.filter(l => l.status === "active")
  const totalListings = sellerListings.length
  const totalViews = sellerListings.reduce((sum, l) => sum + l.views, 0)
  const sellerOrders = MOCK_ORDERS.filter(o => o.items.some(i => i.sellerName === sellerListings[0]?.sellerName))
  const totalOrders = sellerOrders.length
  const revenue = sellerOrders.filter(o => o.status === "delivered" || o.status === "confirmed").reduce((sum, o) => sum + o.total, 0)
  return { activeCount: activeListings.length, totalListings, totalViews, totalOrders, revenue }
}
