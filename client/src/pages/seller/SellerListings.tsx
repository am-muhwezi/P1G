import { useState, useEffect, useRef } from "react"
import { api } from "../../lib/api"
import { formatUGX, formatDate, type Listing, type Category, CATEGORY_LABELS } from "../../lib/data"
import { Plus, Search, Pencil, Trash2, X, Package, Eye, ImagePlus, Loader2 } from "lucide-react"
import { useToast } from "../../store/toast"
import { ConfirmModal } from "../../components/ui/ConfirmModal"
import { uploadListingImages, removeListingImage, imagesConfigured } from "../../lib/storage"

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
  const [listings, setListings] = useState<Listing[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<Listing | null>(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")

  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "live_pigs" as Category,
    price: 0,
    stock: 1,
    unit: "pig",
    district: "",
    images: [] as string[],
  })

  const [uploading, setUploading] = useState(false)
  const [imageInputKey, setImageInputKey] = useState(0)
  const sessionUploads = useRef<string[]>([])

  const [deleteTarget, setDeleteTarget] = useState<{ id: string; title: string } | null>(null)
  const [deleting, setDeleting] = useState(false)
  const toast = useToast((s) => s.toast)

  const fetchListings = () => {
    setLoading(true)
    api.get("/api/seller/listings")
      .then(setListings)
      .catch(() => setError("Failed to load listings"))
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchListings() }, [])

  const filtered = listings.filter((l) => l.title.toLowerCase().includes(search.toLowerCase()))

  const openCreate = () => {
    setEditing(null)
    setForm({ title: "", description: "", category: "live_pigs", price: 0, stock: 1, unit: "pig", district: "", images: [] })
    sessionUploads.current = []
    setError("")
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
      images: listing.images?.length ? listing.images : listing.image ? [listing.image] : [],
    })
    sessionUploads.current = []
    setError("")
    setShowForm(true)
  }

  const handleImageFiles = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (!files.length) return
    setUploading(true)
    try {
      const urls = await uploadListingImages(files)
      sessionUploads.current.push(...urls)
      setForm((f) => ({ ...f, images: [...f.images, ...urls] }))
      toast(`${urls.length} image${urls.length === 1 ? "" : "s"} uploaded`)
    } catch (err) {
      const message = err instanceof Error ? err.message : "Upload failed"
      toast(message, "error")
    } finally {
      setUploading(false)
      setImageInputKey((k) => k + 1)
    }
  }

  const handleRemoveImage = async (url: string) => {
    setForm((f) => ({ ...f, images: f.images.filter((u) => u !== url) }))
    if (sessionUploads.current.includes(url)) {
      sessionUploads.current = sessionUploads.current.filter((u) => u !== url)
      try { await removeListingImage(url) } catch { /* orphan file is acceptable */ }
    }
  }
  const handleSave = async () => {
    setSaving(true)
    setError("")
    try {
      const payload = { ...form, image: form.images[0] || "" }
      if (editing) {
        const updated = await api.put(`/api/seller/listings/${editing.id}`, payload)
        setListings((prev) => prev.map((l) => (l.id === editing.id ? updated : l)))
        toast("Listing updated")
      } else {
        const created = await api.post("/api/seller/listings", payload)
        setListings((prev) => [created, ...prev])
        toast("Listing created")
      }
      if (editing) {
        const removed = (editing.images || []).filter((u) => !form.images.includes(u))
        for (const url of removed) {
          try { await removeListingImage(url) } catch { /* orphan file is acceptable */ }
        }
      }
      setShowForm(false)
      setEditing(null)
    } catch (err) {
      const message = err instanceof Error ? err.message : "Save failed"
      setError(message)
      toast(message, "error")
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return
    setDeleting(true)
    try {
      await api.del(`/api/seller/listings/${deleteTarget.id}`)
      setListings((prev) => prev.filter((l) => l.id !== deleteTarget.id))
      toast("Listing deleted")
      setDeleteTarget(null)
    } catch (err: any) {
      toast(err.message, "error")
      setDeleteTarget(null)
    } finally {
      setDeleting(false)
    }
  }

  const activeCount = listings.filter((l) => l.status === "active").length
  const pendingCount = listings.filter((l) => l.status === "pending").length
  const totalViews = listings.reduce((s, l) => s + l.views, 0)

  if (loading) {
    return <div className="flex items-center justify-center h-64 text-on-surface-variant font-body-md dark:text-outline-variant">Loading listings...</div>
  }

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

      {error && <div className="mb-4 p-3 rounded-xl bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400 font-label-sm text-label-sm">{error}</div>}

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
                      <button onClick={() => setDeleteTarget({ id: listing.id, title: listing.title })} className="p-2 rounded-lg text-outline hover:text-error hover:bg-error-container/20 transition-colors dark:text-outline-variant">
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
              <button onClick={() => { setShowForm(false); setEditing(null); setError("") }} className="text-on-surface-variant hover:text-on-surface dark:text-outline-variant dark:hover:text-primary-fixed">
                <X size={24} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <Field label="Title">
                <input className="w-full px-4 py-3 bg-warm-beige rounded-xl focus:ring-2 focus:ring-primary text-body-md dark:bg-surface-container dark:text-primary-fixed" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
              </Field>
              <Field label="Description">
                <textarea className="w-full px-4 py-3 bg-warm-beige rounded-xl focus:ring-2 focus:ring-primary text-body-md resize-none h-24 dark:bg-surface-container dark:text-primary-fixed" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
              </Field>
              <Field label="Photos">
                {!imagesConfigured ? (
                  <p className="p-3 rounded-xl bg-amber-50 text-amber-700 font-label-sm text-label-sm dark:bg-amber-900/20 dark:text-amber-400">
                    Image upload is not configured yet. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to enable photos.
                  </p>
                ) : (
                  <div className="space-y-3">
                    <div className="grid grid-cols-3 gap-3">
                      {form.images.map((url) => (
                        <div key={url} className="relative group rounded-xl overflow-hidden border border-outline-variant/40 dark:border-surface-container">
                          <img src={url} alt="Listing preview" className="w-full h-24 object-cover" />
                          <button
                            type="button"
                            onClick={() => handleRemoveImage(url)}
                            className="absolute top-1 right-1 p-1 rounded-full bg-black/60 text-white hover:bg-error transition-colors"
                            aria-label="Remove image"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      ))}
                      <label className="relative flex flex-col items-center justify-center h-24 rounded-xl border-2 border-dashed border-outline-variant text-outline hover:border-primary hover:text-primary cursor-pointer transition-colors dark:border-surface-container dark:hover:border-primary-fixed">
                        {uploading ? (
                          <>
                            <Loader2 size={20} className="animate-spin" />
                            <span className="text-xs mt-1">Uploading...</span>
                          </>
                        ) : (
                          <>
                            <ImagePlus size={20} />
                            <span className="text-label-sm font-label-sm mt-1">Add photo</span>
                          </>
                        )}
                        <input
                          key={imageInputKey}
                          type="file"
                          accept="image/*"
                          multiple
                          className="hidden"
                          disabled={uploading}
                          onChange={handleImageFiles}
                        />
                      </label>
                    </div>
                    <p className="text-label-sm text-on-surface-variant dark:text-outline-variant">
                      First photo becomes the cover. Images are compressed and stored in Supabase.
                    </p>
                  </div>
                )}
              </Field>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Category">
                  <select className="w-full px-4 py-3 bg-warm-beige rounded-xl focus:ring-2 focus:ring-primary text-body-md dark:bg-surface-container dark:text-primary-fixed" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value as Category })}>
                    {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
                      <option key={key} value={key}>{label}</option>
                    ))}
                  </select>
                </Field>
                <Field label="District">
                  <input className="w-full px-4 py-3 bg-warm-beige rounded-xl focus:ring-2 focus:ring-primary text-body-md dark:bg-surface-container dark:text-primary-fixed" value={form.district} onChange={(e) => setForm({ ...form, district: e.target.value })} />
                </Field>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <Field label="Price (UGX)">
                  <input type="number" className="w-full px-4 py-3 bg-warm-beige rounded-xl focus:ring-2 focus:ring-primary text-body-md dark:bg-surface-container dark:text-primary-fixed" value={form.price || ""} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} />
                </Field>
                <Field label="Stock">
                  <input type="number" className="w-full px-4 py-3 bg-warm-beige rounded-xl focus:ring-2 focus:ring-primary text-body-md dark:bg-surface-container dark:text-primary-fixed" value={form.stock} onChange={(e) => setForm({ ...form, stock: Number(e.target.value) })} />
                </Field>
                <Field label="Unit">
                  <input className="w-full px-4 py-3 bg-warm-beige rounded-xl focus:ring-2 focus:ring-primary text-body-md dark:bg-surface-container dark:text-primary-fixed" value={form.unit} onChange={(e) => setForm({ ...form, unit: e.target.value })} />
                </Field>
              </div>
              {error && <p className="font-label-sm text-label-sm text-error">{error}</p>}
            </div>
            <div className="flex justify-end gap-3 p-6 border-t border-outline-variant/30 dark:border-surface-container">
              <button onClick={() => { setShowForm(false); setEditing(null); setError("") }} className="px-6 py-3 rounded-xl font-label-lg text-label-lg border border-outline-variant text-on-surface-variant hover:bg-surface-container transition-colors dark:border-outline dark:text-outline-variant dark:hover:bg-surface-container">Cancel</button>
              <button
                onClick={handleSave}
                disabled={!form.title || !form.price || saving}
                className="px-6 py-3 rounded-xl font-label-lg text-label-lg bg-primary text-on-primary hover:bg-primary/90 transition-colors disabled:opacity-50 dark:bg-primary-fixed dark:text-on-primary-fixed"
              >
                {saving ? "Saving..." : editing ? "Save Changes" : "Create Listing"}
              </button>
            </div>
          </div>
        </div>
      )}

      <ConfirmModal
        open={!!deleteTarget}
        title="Delete Listing"
        message={`Are you sure you want to delete "${deleteTarget?.title}"? This action cannot be undone.`}
        confirmLabel="Delete"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTarget(null)}
        loading={deleting}
      />
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
