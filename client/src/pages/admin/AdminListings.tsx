import { useState, useEffect } from "react"
import { api } from "../../lib/api"
import { formatUGX, formatDate, CATEGORY_LABELS } from "../../lib/data"
import { Search, CheckCircle, XCircle, Eye, Package, TrendingUp, Clock, X, Trash2, AlertTriangle, UserX, UserCheck } from "lucide-react"
import { ConfirmModal } from "../../components/ui/ConfirmModal"

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

interface ListingDetail {
  id: string
  title: string
  sellerId: string
  sellerName: string
  sellerEmail: string
  sellerVerified: boolean
  sellerStatus: string
  description: string
  category: string
  price: number
  stock: number
  unit: string
  district: string
  status: string
  views: number
  rating: number
  reviewCount: number
  image: string
  createdAt: string
  updatedAt: string
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
  const [selectedListing, setSelectedListing] = useState<ListingDetail | null>(null)
  const [detailLoading, setDetailLoading] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; title: string } | null>(null)
  const [deleting, setDeleting] = useState(false)
  const [suspendLoading, setSuspendLoading] = useState(false)

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
      if (selectedListing?.id === id) setSelectedListing((prev) => prev ? { ...prev, status: "active" } : null)
    } catch { /* ignore */ }
  }

  const reject = async (id: string) => {
    try {
      await api.patch(`/api/admin/listings/${id}/status`, { status: "rejected" })
      setListings((prev) => prev.map((l) => l.id === id ? { ...l, status: "rejected" } : l))
      if (selectedListing?.id === id) setSelectedListing((prev) => prev ? { ...prev, status: "rejected" } : null)
    } catch { /* ignore */ }
  }

  const openDetail = async (listingId: string) => {
    setDetailLoading(true)
    setSelectedListing(null)
    try {
      const detail = await api.get(`/api/admin/listings/${listingId}`) as ListingDetail
      setSelectedListing(detail)
    } catch {
      setSelectedListing(null)
    } finally {
      setDetailLoading(false)
    }
  }

  const handleDeleteListing = async () => {
    if (!deleteTarget) return
    setDeleting(true)
    try {
      await api.del(`/api/admin/listings/${deleteTarget.id}`)
      setListings((prev) => prev.filter((l) => l.id !== deleteTarget.id))
      setSelectedListing(null)
      setDeleteTarget(null)
    } catch {
      setDeleteTarget(null)
    } finally {
      setDeleting(false)
    }
  }

  const toggleSellerSuspension = async () => {
    if (!selectedListing) return
    setSuspendLoading(true)
    const newStatus = selectedListing.sellerStatus === "suspended" ? "active" : "suspended"
    try {
      await api.patch(`/api/admin/users/${selectedListing.sellerId}/status`, { status: newStatus })
      setSelectedListing({ ...selectedListing, sellerStatus: newStatus })
    } catch {
      // ignore
    } finally {
      setSuspendLoading(false)
    }
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
                    <tr key={listing.id} onClick={() => openDetail(listing.id)} className="border-b border-outline-variant/20 hover:bg-surface-container/50 transition-colors cursor-pointer dark:border-surface-container dark:hover:bg-on-background/50">
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
                              onClick={(e) => { e.stopPropagation(); approve(listing.id) }}
                              className="p-2 rounded-lg text-emerald-600 hover:bg-emerald-50 transition-colors dark:text-emerald-400 dark:hover:bg-emerald-900/20"
                              title="Approve"
                            >
                              <CheckCircle size={18} />
                            </button>
                            <button
                              onClick={(e) => { e.stopPropagation(); reject(listing.id) }}
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

      {selectedListing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => setSelectedListing(null)}>
          <div
            className="bg-surface-container-lowest dark:bg-surface-dim rounded-2xl p-6 w-full max-w-lg mx-4 shadow-xl border border-surface-container-high dark:border-surface-container max-h-[85vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6 shrink-0">
              <h2 className="font-headline-sm text-headline-sm text-on-surface dark:text-primary-fixed">Listing Details</h2>
              <button onClick={() => setSelectedListing(null)} className="text-on-surface-variant hover:text-on-surface dark:text-outline-variant dark:hover:text-primary-fixed">
                <X size={20} />
              </button>
            </div>

            {detailLoading ? (
              <div className="flex items-center justify-center h-48">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
              </div>
            ) : (
              <>
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-12 h-12 rounded-full bg-primary-container/30 flex items-center justify-center text-primary text-lg font-bold dark:bg-primary-fixed/20 dark:text-primary-fixed">
                    <Package size={24} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-label-lg text-label-lg text-on-surface dark:text-primary-fixed truncate">{selectedListing.title}</p>
                    <StatusPill status={selectedListing.status} />
                  </div>
                </div>

                <div className="space-y-3 mb-5">
                  <div className="flex justify-between py-2 border-b border-outline-variant/20 dark:border-surface-container">
                    <span className="text-label-sm text-on-surface-variant dark:text-outline-variant">Description</span>
                    <span className="text-label-sm text-on-surface dark:text-primary-fixed text-right max-w-[60%]">{selectedListing.description || "--"}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-outline-variant/20 dark:border-surface-container">
                    <span className="text-label-sm text-on-surface-variant dark:text-outline-variant">Category</span>
                    <span className="text-label-sm text-on-surface dark:text-primary-fixed capitalize">{CATEGORY_LABELS[selectedListing.category as keyof typeof CATEGORY_LABELS] || selectedListing.category}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-outline-variant/20 dark:border-surface-container">
                    <span className="text-label-sm text-on-surface-variant dark:text-outline-variant">Price</span>
                    <span className="font-label-lg text-label-lg text-primary dark:text-primary-fixed">{formatUGX(selectedListing.price)}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-outline-variant/20 dark:border-surface-container">
                    <span className="text-label-sm text-on-surface-variant dark:text-outline-variant">Stock</span>
                    <span className="text-label-sm text-on-surface dark:text-primary-fixed">{selectedListing.stock} {selectedListing.unit}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-outline-variant/20 dark:border-surface-container">
                    <span className="text-label-sm text-on-surface-variant dark:text-outline-variant">District</span>
                    <span className="text-label-sm text-on-surface dark:text-primary-fixed">{selectedListing.district || "--"}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-outline-variant/20 dark:border-surface-container">
                    <span className="text-label-sm text-on-surface-variant dark:text-outline-variant">Views</span>
                    <span className="text-label-sm text-on-surface dark:text-primary-fixed">{selectedListing.views}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-outline-variant/20 dark:border-surface-container">
                    <span className="text-label-sm text-on-surface-variant dark:text-outline-variant">Rating</span>
                    <span className="text-label-sm text-on-surface dark:text-primary-fixed">{selectedListing.rating > 0 ? `${selectedListing.rating} / 5 (${selectedListing.reviewCount} reviews)` : "No ratings"}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-outline-variant/20 dark:border-surface-container">
                    <span className="text-label-sm text-on-surface-variant dark:text-outline-variant">Seller</span>
                    <span className="text-label-sm text-on-surface dark:text-primary-fixed text-right">{selectedListing.sellerName} ({selectedListing.sellerEmail})</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-outline-variant/20 dark:border-surface-container">
                    <span className="text-label-sm text-on-surface-variant dark:text-outline-variant">Seller Verified</span>
                    <span className={`text-label-sm ${selectedListing.sellerVerified ? "text-emerald-600" : "text-on-surface-variant"}`}>{selectedListing.sellerVerified ? "Yes" : "No"}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-outline-variant/20 dark:border-surface-container">
                    <span className="text-label-sm text-on-surface-variant dark:text-outline-variant">Posted</span>
                    <span className="text-label-sm text-on-surface dark:text-primary-fixed">{formatDate(selectedListing.createdAt)}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-outline-variant/20 dark:border-surface-container">
                    <span className="text-label-sm text-on-surface-variant dark:text-outline-variant">Last Updated</span>
                    <span className="text-label-sm text-on-surface dark:text-primary-fixed">{formatDate(selectedListing.updatedAt)}</span>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  {selectedListing.status === "pending" && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => approve(selectedListing.id)}
                        className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-label-lg text-label-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-400 transition-colors"
                      >
                        <CheckCircle size={18} />
                        Approve
                      </button>
                      <button
                        onClick={() => reject(selectedListing.id)}
                        className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-label-lg text-label-lg bg-red-50 text-red-700 hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400 transition-colors"
                      >
                        <XCircle size={18} />
                        Reject
                      </button>
                    </div>
                  )}
                  <button
                    onClick={toggleSellerSuspension}
                    disabled={suspendLoading}
                    className={`flex items-center justify-center gap-2 py-3 rounded-xl font-label-lg text-label-lg transition-colors ${
                      selectedListing.sellerStatus === "suspended"
                        ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-400"
                        : "bg-red-50 text-red-700 hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400"
                    }`}
                  >
                    {selectedListing.sellerStatus === "suspended" ? <UserCheck size={18} /> : <UserX size={18} />}
                    {suspendLoading ? "Processing..." : selectedListing.sellerStatus === "suspended" ? "Reactivate Seller" : "Suspend Seller"}
                  </button>
                  <button
                    onClick={() => setDeleteTarget({ id: selectedListing.id, title: selectedListing.title })}
                    className="flex items-center justify-center gap-2 py-3 rounded-xl font-label-lg text-label-lg bg-red-50 text-red-700 hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400 transition-colors"
                  >
                    <Trash2 size={18} />
                    Delete Listing
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      <ConfirmModal
        open={!!deleteTarget}
        title="Delete Listing"
        message={`Are you sure you want to permanently delete "${deleteTarget?.title}"? This action cannot be undone.`}
        confirmLabel="Delete"
        onConfirm={handleDeleteListing}
        onCancel={() => setDeleteTarget(null)}
        loading={deleting}
      />
    </div>
  )
}
