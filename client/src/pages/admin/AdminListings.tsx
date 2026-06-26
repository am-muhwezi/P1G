import { useState, useEffect } from "react"
import { api } from "../../lib/api"
import { formatUGX, formatDate, CATEGORY_LABELS } from "../../lib/data"
import { Search, CheckCircle, XCircle, Eye, Package, TrendingUp, Clock } from "lucide-react"

interface ListingData {
  id: string
  title: string
  sellerName: string
  category: string
  price: number
  views: number
  status: string
  createdAt: string
  district: string
}

const statusColor: Record<string, string> = {
  active: "text-emerald-600 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-900/20",
  pending: "text-amber-600 bg-amber-50 dark:text-amber-400 dark:bg-amber-900/20",
  rejected: "text-red-600 bg-red-50 dark:text-red-400 dark:bg-red-900/20",
}

function StatusPill({ status }: { status: string }) {
  return (
    <span className={`inline-block px-3 py-1 rounded-full text-label-sm font-label-sm capitalize ${statusColor[status] || ""}`}>
      {status}
    </span>
  )
}

export function AdminListings() {
  const [listings, setListings] = useState<ListingData[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")

  useEffect(() => {
    api.get("/api/admin/listings").then(setListings).catch(() => setListings([])).finally(() => setLoading(false))
  }, [])

  const filtered = listings.filter(
    (l) =>
      l.title.toLowerCase().includes(search.toLowerCase()) ||
      l.sellerName.toLowerCase().includes(search.toLowerCase()),
  )

  const active = listings.filter(l => l.status === "active").length
  const pending = listings.filter(l => l.status === "pending").length
  const totalViews = listings.reduce((s, l) => s + l.views, 0)

  const approve = async (id: string) => {
    try {
      await api.patch(`/api/admin/listings/${id}/status`, { status: "active" })
      setListings((prev) => prev.map((l) => l.id === id ? { ...l, status: "active" } : l))
    } catch { /* ignore */ }
  }

  const reject = async (id: string) => {
    try {
      await api.patch(`/api/admin/listings/${id}/status`, { status: "rejected" })
      setListings((prev) => prev.map((l) => l.id === id ? { ...l, status: "rejected" } : l))
    } catch { /* ignore */ }
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-headline-lg text-headline-lg text-on-surface dark:text-primary-fixed">Listings</h1>
        <p className="text-on-surface-variant font-body-md text-body-md dark:text-outline-variant">
          Moderate all marketplace listings ({listings.length} total)
        </p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-surface-container-lowest rounded-xl p-5 shadow-sm border border-surface-container-high dark:bg-surface-dim dark:border-surface-container">
              <div className="w-10 h-10 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center mb-3 dark:bg-sky-900/20 dark:text-sky-400">
                <Package size={24} />
              </div>
              <p className="font-headline-md text-headline-md text-on-surface dark:text-primary-fixed">{listings.length}</p>
              <p className="text-label-sm text-on-surface-variant dark:text-outline-variant">Total Listings</p>
            </div>
            <div className="bg-surface-container-lowest rounded-xl p-5 shadow-sm border border-surface-container-high dark:bg-surface-dim dark:border-surface-container">
              <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3 dark:bg-emerald-900/20 dark:text-emerald-400">
                <TrendingUp size={24} />
              </div>
              <p className="font-headline-md text-headline-md text-on-surface dark:text-primary-fixed">{active}</p>
              <p className="text-label-sm text-on-surface-variant dark:text-outline-variant">Active</p>
            </div>
            <div className="bg-surface-container-lowest rounded-xl p-5 shadow-sm border border-surface-container-high dark:bg-surface-dim dark:border-surface-container">
              <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center mb-3 dark:bg-amber-900/20 dark:text-amber-400">
                <Clock size={24} />
              </div>
              <p className="font-headline-md text-headline-md text-on-surface dark:text-primary-fixed">{pending}</p>
              <p className="text-label-sm text-on-surface-variant dark:text-outline-variant">Pending Review</p>
            </div>
            <div className="bg-surface-container-lowest rounded-xl p-5 shadow-sm border border-surface-container-high dark:bg-surface-dim dark:border-surface-container">
              <div className="w-10 h-10 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center mb-3 dark:bg-purple-900/20 dark:text-purple-400">
                <Eye size={24} />
              </div>
              <p className="font-headline-md text-headline-md text-on-surface dark:text-primary-fixed">{totalViews.toLocaleString()}</p>
              <p className="text-label-sm text-on-surface-variant dark:text-outline-variant">Total Views</p>
            </div>
          </div>

          <div className="relative mb-6">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-outline dark:text-outline-variant" />
            <input
              className="w-full pl-11 pr-4 py-3 bg-warm-beige border-none rounded-xl focus:ring-2 focus:ring-primary text-body-md dark:bg-surface-dim dark:text-primary-fixed dark:placeholder:text-outline"
              placeholder="Search listings..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-surface-container-high overflow-x-auto dark:bg-surface-dim dark:border-surface-container">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-outline-variant/30 dark:border-surface-container">
                  <th className="px-4 py-4 font-label-sm text-label-sm text-on-surface-variant dark:text-outline-variant">Product</th>
                  <th className="px-4 py-4 font-label-sm text-label-sm text-on-surface-variant dark:text-outline-variant">Seller</th>
                  <th className="px-4 py-4 font-label-sm text-label-sm text-on-surface-variant dark:text-outline-variant">Category</th>
                  <th className="px-4 py-4 font-label-sm text-label-sm text-on-surface-variant dark:text-outline-variant">Price</th>
                  <th className="px-4 py-4 font-label-sm text-label-sm text-on-surface-variant dark:text-outline-variant">Views</th>
                  <th className="px-4 py-4 font-label-sm text-label-sm text-on-surface-variant dark:text-outline-variant">Status</th>
                  <th className="px-4 py-4 font-label-sm text-label-sm text-on-surface-variant dark:text-outline-variant">Posted</th>
                  <th className="px-4 py-4" />
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-4 py-12 text-center text-on-surface-variant font-body-md dark:text-outline-variant">
                      No listings found.
                    </td>
                  </tr>
                ) : (
                  filtered.map((listing) => (
                    <tr key={listing.id} className="border-b border-outline-variant/20 hover:bg-surface-container/50 transition-colors dark:border-surface-container dark:hover:bg-on-background/50">
                      <td className="px-4 py-4">
                        <p className="font-label-lg text-label-lg text-on-surface dark:text-primary-fixed">{listing.title}</p>
                      </td>
                      <td className="px-4 py-4 text-label-sm text-on-surface-variant dark:text-outline-variant">{listing.sellerName}</td>
                      <td className="px-4 py-4 text-label-sm text-on-surface-variant dark:text-outline-variant">{CATEGORY_LABELS[listing.category as keyof typeof CATEGORY_LABELS] || listing.category}</td>
                      <td className="px-4 py-4 font-label-lg text-label-lg text-primary dark:text-primary-fixed">{formatUGX(listing.price)}</td>
                      <td className="px-4 py-4 text-label-sm text-on-surface-variant dark:text-outline-variant">
                        <div className="flex items-center gap-1">
                          <Eye size={14} />
                          {listing.views}
                        </div>
                      </td>
                      <td className="px-4 py-4"><StatusPill status={listing.status} /></td>
                      <td className="px-4 py-4 text-label-sm text-on-surface-variant dark:text-outline-variant">{formatDate(listing.createdAt)}</td>
                      <td className="px-4 py-4">
                        {listing.status === "pending" && (
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => approve(listing.id)}
                              className="p-2 rounded-lg text-emerald-600 hover:bg-emerald-50 transition-colors dark:text-emerald-400 dark:hover:bg-emerald-900/20"
                              title="Approve"
                            >
                              <CheckCircle size={18} />
                            </button>
                            <button
                              onClick={() => reject(listing.id)}
                              className="p-2 rounded-lg text-red-600 hover:bg-red-50 transition-colors dark:text-red-400 dark:hover:bg-red-900/20"
                              title="Reject"
                            >
                              <XCircle size={18} />
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  )
}
