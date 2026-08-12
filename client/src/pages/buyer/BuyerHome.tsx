import { useState, useEffect } from "react"
import { useSearchParams } from "react-router-dom"
import { FilterBar } from "../../components/features/FilterBar"
import { ProductCard } from "../../components/features/ProductCard"
import { Input } from "../../components/ui/Input"
import { api } from "../../lib/api"
import { marketplaceFilters, type Listing } from "../../lib/data"
import { useCart } from "../../store/cart"
import { useAuth } from "../../store/auth"
import { useToast } from "../../store/toast"
import { AlertCircle } from "lucide-react"

export function BuyerHome() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [activeFilter, setActiveFilter] = useState(searchParams.get("category") || "all")
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "")
  const [listings, setListings] = useState<Listing[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const addItem = useCart((s) => s.addItem)
  const auth = useAuth()
  const toast = useToast((s) => s.toast)

  useEffect(() => {
    setLoading(true)
    setError("")
    const params: Record<string, string> = {}
    const cat = searchParams.get("category")
    const q = searchParams.get("q")
    const loc = searchParams.get("location")
    if (cat && cat !== "all" && cat !== "verified" && cat !== "price" && cat !== "location" && cat !== "breed") params.category = cat
    if (q) params.search = q
    if (loc) params.district = loc
    api.get(`/api/listings?${new URLSearchParams(params)}`).then(setListings).catch(() => setError("Failed to load listings.")).finally(() => setLoading(false))
  }, [searchParams])

  const handleAddToCart = (listing: Listing) => {
    if (listing.stock <= 0) { toast("This item is out of stock", "error"); return }
    addItem({ listingId: listing.id, title: listing.title, price: listing.price, quantity: 1, sellerName: listing.sellerName, unit: listing.unit, stock: listing.stock })
  }

  const handleFilterChange = (id: string) => {
    setActiveFilter(id)
    const next: Record<string, string> = {}
    if (id !== "all") next.category = id
    if (searchQuery) next.q = searchQuery
    setSearchParams(next)
  }

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      setSearchParams({ q: searchQuery })
    }
  }

  const filtered = activeFilter === "verified" ? listings.filter((l) => l.sellerVerified) : activeFilter === "location" && searchQuery ? listings.filter((l) => l.district.toLowerCase().includes(searchQuery.toLowerCase())) : listings

  const firstName = auth.name?.split(" ")[0] || "Buyer"

  return (
    <div className="pb-24">
      <div className="mb-5">
        <h1 className="font-headline-lg text-headline-lg text-on-surface dark:text-primary-fixed">Hello, {firstName} 👋</h1>
        <p className="text-on-surface-variant font-body-md text-body-md dark:text-outline-variant">Find what your farm needs today</p>
      </div>
      <section className="mb-6 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <Input
            icon="search"
            placeholder="Search for quality livestock or produce..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleSearch}
          />
          <button className="hidden md:flex items-center gap-2 px-6 py-4 bg-primary text-white rounded-xl font-label-lg text-label-lg shadow-lg hover:opacity-90 transition-all active:scale-95 dark:bg-primary-fixed dark:text-on-primary-fixed">
            <span className="material-symbols-outlined">tune</span>
            Advanced Filters
          </button>
        </div>
        <FilterBar
          filters={marketplaceFilters}
          activeFilter={activeFilter}
          onFilterChange={handleFilterChange}
        />
      </section>

      {error && (
        <div className="flex items-center gap-3 p-4 mb-6 rounded-xl bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400 border border-red-200 dark:border-red-900/30">
          <AlertCircle size={20} />
          <span className="font-label-sm text-label-sm">{error}</span>
        </div>
      )}

      {!error && loading ? (
        <div className="text-center py-20 text-on-surface-variant font-body-md dark:text-outline-variant">Loading listings...</div>
      ) : !error && filtered.length === 0 ? (
        <div className="text-center py-20">
          <span className="material-symbols-outlined text-6xl text-outline-variant dark:text-outline">search_off</span>
          <p className="text-on-surface-variant font-body-lg text-body-lg mt-4 dark:text-outline-variant">No listings match your criteria.</p>
        </div>
      ) : (
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((listing) => (
            <ProductCard key={listing.id} listing={listing} onAddToCart={handleAddToCart} />
          ))}
        </section>
      )}

      <section className="mt-6 p-6 bg-surface-container rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4 border border-surface-container-high dark:bg-surface-dim dark:border-surface-container">
        <div className="space-y-2 max-w-2xl">
          <h2 className="font-headline-lg text-headline-lg text-primary flex items-center gap-2 dark:text-primary-fixed">
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>verified_user</span>
            Trade with Confidence
          </h2>
          <p className="text-body-md font-body-md text-on-surface-variant dark:text-outline-variant">
            Every transaction on P1G katale is backed by verified sellers and secure payment processing. Quality guaranteed.
          </p>
        </div>
        <button className="px-8 py-4 bg-white border border-primary text-primary font-label-lg text-label-lg rounded-xl hover:bg-primary hover:text-white transition-all shadow-sm dark:bg-surface-dim dark:border-primary-fixed dark:text-primary-fixed dark:hover:bg-primary-fixed dark:hover:text-on-primary-fixed">
          Learn More
        </button>
      </section>
    </div>
  )
}
