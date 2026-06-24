import { useState } from "react"
import { MOCK_LISTINGS, formatUGX, formatDate, type Listing, CATEGORY_LABELS } from "../../lib/data"
import { Search, CheckCircle, XCircle, Eye } from "lucide-react"

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
  const [search, setSearch] = useState("")
  const [listings, setListings] = useState<Listing[]>(MOCK_LISTINGS)

  const filtered = listings.filter(
    (l) =>
      l.title.toLowerCase().includes(search.toLowerCase()) ||
      l.sellerName.toLowerCase().includes(search.toLowerCase()),
  )

  const approve = (id: string) => {
    setListings((prev) => prev.map((l) => l.id === id ? { ...l, status: "active" as const } : l))
  }

  const reject = (id: string) => {
    setListings((prev) => prev.map((l) => l.id === id ? { ...l, status: "rejected" as const } : l))
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-headline-lg text-headline-lg text-on-surface dark:text-primary-fixed">Listings</h1>
        <p className="text-on-surface-variant font-body-md text-body-md dark:text-outline-variant">
          Moderate all marketplace listings ({listings.length} total)
        </p>
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
                  <td className="px-4 py-4 text-label-sm text-on-surface-variant dark:text-outline-variant">{CATEGORY_LABELS[listing.category]}</td>
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
    </div>
  )
}
