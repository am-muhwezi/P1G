import { useState } from "react"
import { Link } from "react-router-dom"
import { AppShell, BuyerTopBar } from "@/components/layout/AppShell"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/store/auth"
import { useCart } from "@/store/cart"
import { MOCK_LISTINGS, CATEGORY_ICONS, CATEGORY_LABELS, formatUGX, type Category } from "@/lib/data"
import { MapPin, Star, ShoppingCart } from "lucide-react"
import { toast } from "sonner"

const CATEGORIES: { key: Category | "all"; label: string; icon: string }[] = [
  { key: "all", label: "All", icon: "🏪" },
  { key: "live_pigs", label: "Live Pigs", icon: "🐷" },
  { key: "semen", label: "Semen", icon: "🧬" },
  { key: "feed", label: "Feed", icon: "🌾" },
  { key: "medicines", label: "Medicines", icon: "💊" },
  { key: "vets", label: "Vets", icon: "🩺" },
  { key: "pork", label: "Pork", icon: "🥩" },
]

export default function BuyerHome() {
  const { name } = useAuth()
  const addItem = useCart(s => s.addItem)
  const [activeCategory, setActiveCategory] = useState<Category | "all">("all")
  const [search, setSearch] = useState("")

  const active = MOCK_LISTINGS.filter(l => l.status === "active")
  const filtered = active.filter(l => {
    const matchCat = activeCategory === "all" || l.category === activeCategory
    const matchSearch = search === "" || l.title.toLowerCase().includes(search.toLowerCase()) || l.district.toLowerCase().includes(search.toLowerCase())
    return matchCat && matchSearch
  })

  const handleAddToCart = (listing: typeof MOCK_LISTINGS[0]) => {
    addItem({ listingId: listing.id, title: listing.title, price: listing.price, quantity: 1, sellerName: listing.sellerName, unit: listing.unit })
    toast.success(`Added "${listing.title}" to cart`)
  }

  return (
    <AppShell>
      <BuyerTopBar />
      <div className="p-4 lg:p-6">
        {/* Greeting */}
        <div className="mb-5">
          <h1 className="text-xl font-bold text-gray-900">Hello, {name?.split(" ")[0]} 👋</h1>
          <p className="text-sm text-gray-500 mt-0.5">Find what your farm needs today</p>
        </div>

        {/* Mobile search */}
        <div className="lg:hidden mb-4">
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search pigs, feed, medicines..."
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-500/30 bg-gray-50"
          />
        </div>

        {/* Banner */}
        <div className="bg-gradient-to-r from-green-700 to-green-600 rounded-2xl p-5 mb-5 flex items-center justify-between overflow-hidden relative">
          <div className="relative z-10">
            <p className="text-white/70 text-xs font-medium mb-0.5">Limited time offer</p>
            <p className="text-white font-bold text-base">10% off your first order</p>
            <p className="text-white/80 text-xs mt-0.5">Use code: <span className="font-bold">P1GFIRST</span></p>
          </div>
          <div className="text-5xl opacity-30 absolute right-4">🐷</div>
        </div>

        {/* Category pills */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-5 scrollbar-hide">
          {CATEGORIES.map(cat => (
            <button
              key={cat.key}
              onClick={() => setActiveCategory(cat.key)}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all shrink-0 ${
                activeCategory === cat.key
                  ? "bg-green-700 text-white shadow-sm"
                  : "bg-white border border-gray-200 text-gray-600 hover:border-green-300"
              }`}
            >
              <span>{cat.icon}</span>{cat.label}
            </button>
          ))}
        </div>

        {/* Desktop search bar (synced) */}
        <div className="hidden lg:block mb-5">
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search listings..."
            className="w-full max-w-sm px-4 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-500/30 bg-gray-50"
          />
        </div>

        {/* Listings grid */}
        <h2 className="font-bold text-gray-900 mb-4">
          {activeCategory === "all" ? "All Listings" : CATEGORY_LABELS[activeCategory as Category]}
          <span className="text-gray-400 text-sm font-normal ml-2">({filtered.length})</span>
        </h2>

        {filtered.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <div className="text-4xl mb-2">🔍</div>
            <p className="text-sm">No listings found</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filtered.map(listing => (
              <div key={listing.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-md transition-all group">
                <Link to={`/buyer/listing/${listing.id}`}>
                  <div className="h-28 sm:h-32 bg-gradient-to-br from-green-100 to-green-50 flex items-center justify-center relative">
                    <span className="text-4xl">{CATEGORY_ICONS[listing.category]}</span>
                    {listing.sellerVerified && (
                      <div className="absolute top-2 right-2">
                        <Badge className="bg-green-600 text-white border-0 text-[10px] px-1.5 py-0">✓ Verified</Badge>
                      </div>
                    )}
                  </div>
                  <div className="p-3">
                    <p className="text-xs text-gray-400 mb-0.5">{CATEGORY_LABELS[listing.category]}</p>
                    <h3 className="font-semibold text-gray-900 text-sm leading-snug mb-1 line-clamp-2 group-hover:text-green-700 transition-colors">{listing.title}</h3>
                    <div className="flex items-center gap-1 text-xs text-gray-400 mb-2">
                      <MapPin size={10} />{listing.district}
                    </div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-green-700 text-sm">{formatUGX(listing.price)}</span>
                      {listing.reviewCount > 0 && (
                        <span className="flex items-center gap-0.5 text-[10px] text-gray-500">
                          <Star size={10} className="fill-amber-400 text-amber-400" />{listing.rating}
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
                <div className="px-3 pb-3">
                  <Button
                    size="sm"
                    onClick={() => handleAddToCart(listing)}
                    className="w-full h-8 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs gap-1"
                  >
                    <ShoppingCart size={12} /> Add to Cart
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AppShell>
  )
}
