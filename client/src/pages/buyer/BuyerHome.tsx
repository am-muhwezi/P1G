import { useState } from "react"
import { useSearchParams } from "react-router-dom"
import { FilterBar } from "../../components/features/FilterBar"
import { ProductCard } from "../../components/features/ProductCard"
import { Input } from "../../components/ui/Input"
import { MOCK_LISTINGS, marketplaceFilters } from "../../lib/data"
import { useCart } from "../../store/cart"
import { useAuth } from "../../store/auth"

export function BuyerHome() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [activeFilter, setActiveFilter] = useState(searchParams.get("category") || "all")
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "")
  const addItem = useCart((s) => s.addItem)
  const auth = useAuth()

  const filtered = MOCK_LISTINGS.filter((l) => {
    if (activeFilter !== "all") {
      if (activeFilter === "verified") return l.sellerVerified
      if (activeFilter === "price") return true
      if (activeFilter === "location") return l.district.toLowerCase().includes(searchQuery.toLowerCase())
    }
    if (searchQuery) return l.title.toLowerCase().includes(searchQuery.toLowerCase())
    return true
  })

  const handleAddToCart = (listing: typeof MOCK_LISTINGS[0]) => {
    addItem({ listingId: listing.id, title: listing.title, price: listing.price, quantity: 1, sellerName: listing.sellerName, unit: listing.unit })
  }

  const handleFilterChange = (id: string) => {
    setActiveFilter(id)
    if (id === "all") {
      setSearchParams({})
    } else {
      setSearchParams({ category: id })
    }
  }

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      setSearchParams({ q: searchQuery })
    }
  }

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

      {filtered.length === 0 ? (
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
            Every transaction on P1G Kataale is backed by verified sellers and secure payment processing. Quality guaranteed.
          </p>
        </div>
        <button className="px-8 py-4 bg-white border border-primary text-primary font-label-lg text-label-lg rounded-xl hover:bg-primary hover:text-white transition-all shadow-sm dark:bg-surface-dim dark:border-primary-fixed dark:text-primary-fixed dark:hover:bg-primary-fixed dark:hover:text-on-primary-fixed">
          Learn More
        </button>
      </section>
    </div>
  )
}
