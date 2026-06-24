import { useState } from "react"
import { useAuth } from "../../store/auth"
import { MOCK_LISTINGS, formatUGX, formatDate, type Listing, type Category, CATEGORY_LABELS } from "../../lib/data"
import { Plus, Search, Pencil, Trash2, X, Package, Eye } from "lucide-react"

const DEFAULT_SELLER_ID = "seller-1"

const statusColor: Record<string, string> = {
  active: "text-emerald-600 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-900/20",
  pending: "text-amber-600 bg-amber-50 dark:text-amber-400 dark:bg-amber-900/20",
  rejected: "text-red-600 bg-red-50 dark:text-red-400 dark:bg-red-900/20",
}

function StatusPill({ status }: { status: string }) {
  return (
    <span className={`inline-block px-3 py-1 rounded-full text-label-sm font-label-sm capitalize ${statusColor[status] || "text-gray-500 bg-gray-50"}`}>
      {status}
    </span>
  )
}

export function SellerListings() {
  const auth = useAuth()
  const sellerId = (auth.userId && auth.userId.startsWith("seller-")) ? auth.userId : DEFAULT_SELLER_ID
  const rawListings = MOCK_LISTINGS.filter((l) => l.sellerId === sellerId)
  const [listings, setListings] = useState(() => rawListings.length > 0 ? rawListings : MOCK_LISTINGS.filter((l) => l.sellerId === DEFAULT_SELLER_ID))
  const [search, setSearch] = useState("")
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<Listing | null>(null)

  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "live_pigs" as Category,
    price: 0,
    stock: 1,
    unit: "pig",
    district: "",
  })

  const filtered = listings.filter((l) => l.title.toLowerCase().includes(search.toLowerCase()))

  const openCreate = () => {
    setEditing(null)
    setForm({ title: "", description: "", category: "live_pigs", price: 0, stock: 1, unit: "pig", district: "" })
    setShowForm(true)
  }

  const openEdit = (listing: Listing) => {
    setEditing(listing)
    setForm({
      title: listing.title,
      description: listing.description,
      category: listing.category,
      price: listing.price,
      stock: listing.stock,
      unit: listing.unit,
      district: listing.district,
    })
    setShowForm(true)
  }

  const handleSave = () => {
    if (editing) {
      setListings((prev) =>
        prev.map((l) =>
          l.id === editing.id ? { ...l, ...form, price: form.price } : l,
        ),
      )
    } else {
      const newListing: Listing = {
        id: `lst-${Date.now()}`,
        sellerId,
        sellerName: auth.name || "Seller",
        sellerVerified: false,
        title: form.title,
        description: form.description,
        category: form.category,
        price: form.price,
        stock: form.stock,
        unit: form.unit,
        district: form.district,
        status: "pending",
        views: 0,
        rating: 0,
        reviewCount: 0,
        createdAt: new Date().toISOString().slice(0, 10),
      }
      setListings((prev) => [newListing, ...prev])
    }
    setShowForm(false)
    setEditing(null)
  }

  const handleDelete = (id: string) => {
    setListings((prev) => prev.filter((l) => l.id !== id))
  }

  const activeCount = listings.filter((l) => l.status === "active").length
  const pendingCount = listings.filter((l) => l.status === "pending").length
  const totalViews = listings.reduce((s, l) => s + l.views, 0)

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="font-headline-lg text-headline-lg text-on-surface dark:text-primary-fixed">My Listings</h1>
          <p className="text-on-surface-variant font-body-md text-body-md dark:text-outline-variant">
            Manage your products and livestock listings
          </p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-5 py-3 bg-primary text-on-primary rounded-xl font-label-lg text-label-lg hover:bg-primary/90 transition-colors shadow-sm dark:bg-primary-fixed dark:text-on-primary-fixed"
        >
          <Plus size={18} />
          Add Listing
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <div className="bg-surface-container-lowest rounded-xl p-4 shadow-sm border border-surface-container-high dark:bg-surface-dim dark:border-surface-container">
          <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center mb-2 dark:bg-emerald-900/20 dark:text-emerald-400">
            <Package size={18} />
          </div>
          <p className="font-headline-md text-headline-md text-on-surface dark:text-primary-fixed">{listings.length}</p>
          <p className="text-label-sm text-on-surface-variant dark:text-outline-variant">Total Listings</p>
        </div>
        <div className="bg-surface-container-lowest rounded-xl p-4 shadow-sm border border-surface-container-high dark:bg-surface-dim dark:border-surface-container">
          <div className="w-8 h-8 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center mb-2 dark:bg-sky-900/20 dark:text-sky-400">
            <Package size={18} />
          </div>
          <p className="font-headline-md text-headline-md text-on-surface dark:text-primary-fixed">{activeCount}</p>
          <p className="text-label-sm text-on-surface-variant dark:text-outline-variant">Active</p>
        </div>
        <div className="bg-surface-container-lowest rounded-xl p-4 shadow-sm border border-surface-container-high dark:bg-surface-dim dark:border-surface-container">
          <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center mb-2 dark:bg-amber-900/20 dark:text-amber-400">
            <Package size={18} />
          </div>
          <p className="font-headline-md text-headline-md text-on-surface dark:text-primary-fixed">{pendingCount}</p>
          <p className="text-label-sm text-on-surface-variant dark:text-outline-variant">Pending Review</p>
        </div>
        <div className="bg-surface-container-lowest rounded-xl p-4 shadow-sm border border-surface-container-high dark:bg-surface-dim dark:border-surface-container">
          <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center mb-2 dark:bg-purple-900/20 dark:text-purple-400">
            <Eye size={18} />
          </div>
          <p className="font-headline-md text-headline-md text-on-surface dark:text-primary-fixed">{totalViews}</p>
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
              <th className="px-4 py-4 font-label-sm text-label-sm text-on-surface-variant dark:text-outline-variant">Category</th>
              <th className="px-4 py-4 font-label-sm text-label-sm text-on-surface-variant dark:text-outline-variant">Price</th>
              <th className="px-4 py-4 font-label-sm text-label-sm text-on-surface-variant dark:text-outline-variant">Stock</th>
              <th className="px-4 py-4 font-label-sm text-label-sm text-on-surface-variant dark:text-outline-variant">Status</th>
              <th className="px-4 py-4 font-label-sm text-label-sm text-on-surface-variant dark:text-outline-variant">Posted</th>
              <th className="px-4 py-4" />
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-12 text-center text-on-surface-variant font-body-md dark:text-outline-variant">
                  No listings found.
                </td>
              </tr>
            ) : (
              filtered.map((listing) => (
                <tr key={listing.id} className="border-b border-outline-variant/20 hover:bg-surface-container/50 transition-colors dark:border-surface-container dark:hover:bg-on-background/50">
                  <td className="px-4 py-4">
                    <p className="font-label-lg text-label-lg text-on-surface dark:text-primary-fixed">{listing.title}</p>
                  </td>
                  <td className="px-4 py-4 text-label-sm text-on-surface-variant dark:text-outline-variant">{CATEGORY_LABELS[listing.category]}</td>
                  <td className="px-4 py-4 font-label-lg text-label-lg text-primary dark:text-primary-fixed">{formatUGX(listing.price)}</td>
                  <td className="px-4 py-4 text-label-sm text-on-surface-variant dark:text-outline-variant">{listing.stock} {listing.unit}</td>
                  <td className="px-4 py-4"><StatusPill status={listing.status} /></td>
                  <td className="px-4 py-4 text-label-sm text-on-surface-variant dark:text-outline-variant">{formatDate(listing.createdAt)}</td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      <button onClick={() => openEdit(listing)} className="p-2 rounded-lg text-outline hover:text-primary hover:bg-surface-container transition-colors dark:text-outline-variant dark:hover:text-primary-fixed dark:hover:bg-surface-container">
                        <Pencil size={16} />
                      </button>
                      <button onClick={() => handleDelete(listing.id)} className="p-2 rounded-lg text-outline hover:text-error hover:bg-error-container/20 transition-colors dark:text-outline-variant">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-surface-container-lowest rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto dark:bg-surface-dim">
            <div className="flex items-center justify-between p-6 border-b border-outline-variant/30 dark:border-surface-container">
              <h2 className="font-headline-md text-headline-md text-on-surface dark:text-primary-fixed">
                {editing ? "Edit Listing" : "Add Listing"}
              </h2>
              <button onClick={() => { setShowForm(false); setEditing(null) }} className="text-on-surface-variant hover:text-on-surface dark:text-outline-variant dark:hover:text-primary-fixed">
                <X size={24} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <Field label="Title">
                <input className="w-full px-4 py-3 bg-warm-beige rounded-xl focus:ring-2 focus:ring-primary text-body-md dark:bg-surface-dim dark:text-primary-fixed" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
              </Field>
              <Field label="Description">
                <textarea className="w-full px-4 py-3 bg-warm-beige rounded-xl focus:ring-2 focus:ring-primary text-body-md resize-none h-24 dark:bg-surface-dim dark:text-primary-fixed" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
              </Field>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Category">
                  <select className="w-full px-4 py-3 bg-warm-beige rounded-xl focus:ring-2 focus:ring-primary text-body-md dark:bg-surface-dim dark:text-primary-fixed" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value as Category })}>
                    {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
                      <option key={key} value={key}>{label}</option>
                    ))}
                  </select>
                </Field>
                <Field label="District">
                  <input className="w-full px-4 py-3 bg-warm-beige rounded-xl focus:ring-2 focus:ring-primary text-body-md dark:bg-surface-dim dark:text-primary-fixed" value={form.district} onChange={(e) => setForm({ ...form, district: e.target.value })} />
                </Field>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <Field label="Price (UGX)">
                  <input type="number" className="w-full px-4 py-3 bg-warm-beige rounded-xl focus:ring-2 focus:ring-primary text-body-md dark:bg-surface-dim dark:text-primary-fixed" value={form.price || ""} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} />
                </Field>
                <Field label="Stock">
                  <input type="number" className="w-full px-4 py-3 bg-warm-beige rounded-xl focus:ring-2 focus:ring-primary text-body-md dark:bg-surface-dim dark:text-primary-fixed" value={form.stock} onChange={(e) => setForm({ ...form, stock: Number(e.target.value) })} />
                </Field>
                <Field label="Unit">
                  <input className="w-full px-4 py-3 bg-warm-beige rounded-xl focus:ring-2 focus:ring-primary text-body-md dark:bg-surface-dim dark:text-primary-fixed" value={form.unit} onChange={(e) => setForm({ ...form, unit: e.target.value })} />
                </Field>
              </div>
            </div>
            <div className="flex justify-end gap-3 p-6 border-t border-outline-variant/30 dark:border-surface-container">
              <button onClick={() => { setShowForm(false); setEditing(null) }} className="px-6 py-3 rounded-xl font-label-lg text-label-lg border border-outline-variant text-on-surface-variant hover:bg-surface-container transition-colors dark:border-outline dark:text-outline-variant dark:hover:bg-surface-container">Cancel</button>
              <button
                onClick={handleSave}
                disabled={!form.title || !form.price}
                className="px-6 py-3 rounded-xl font-label-lg text-label-lg bg-primary text-on-primary hover:bg-primary/90 transition-colors disabled:opacity-50 dark:bg-primary-fixed dark:text-on-primary-fixed"
              >
                {editing ? "Save Changes" : "Create Listing"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="font-label-sm text-label-sm text-on-surface dark:text-primary-fixed block mb-1">{label}</label>
      {children}
    </div>
  )
}
