import { useState } from "react"
import { AppShell, StatusBadge, StatCard } from "@/components/layout/AppShell"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { MOCK_LISTINGS, CATEGORY_LABELS, CATEGORY_ICONS, formatUGX, type Category, type Listing } from "@/lib/data"
import { useAuth } from "@/store/auth"
import { ListChecks, Package, TrendingUp, DollarSign, Pencil, Trash2, Eye, Plus } from "lucide-react"
import { toast } from "sonner"

const CATEGORIES_OPTIONS: Category[] = ["live_pigs", "semen", "feed", "medicines", "vets", "pork"]

export default function SellerListings() {
  const { userId } = useAuth()
  const [listings, setListings] = useState(MOCK_LISTINGS.filter(l => l.sellerId === userId))
  const [search, setSearch] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<Listing | null>(null)
  const [form, setForm] = useState({ title: "", category: "live_pigs" as Category, price: "", stock: "", unit: "", description: "" })

  const stats = {
    total: listings.length,
    active: listings.filter(l => l.status === "active").length,
    pending: listings.filter(l => l.status === "pending").length,
    revenue: listings.filter(l => l.status === "active").reduce((s, l) => s + l.price * Math.max(1, l.views / 50), 0),
  }

  const filtered = listings.filter(l => {
    const matchSearch = l.title.toLowerCase().includes(search.toLowerCase())
    const matchCat = categoryFilter === "all" || l.category === categoryFilter
    const matchStatus = statusFilter === "all" || l.status === statusFilter
    return matchSearch && matchCat && matchStatus
  })

  const handleSave = () => {
    if (editing) {
      setListings(prev => prev.map(l => l.id === editing.id ? { ...l, ...form, price: Number(form.price), stock: Number(form.stock) } : l))
      toast.success("Listing updated")
    } else {
      const newListing: Listing = {
        id: `l-${Date.now()}`, sellerId: userId!, sellerName: "John Mukasa", sellerVerified: true,
        title: form.title, description: form.description, category: form.category,
        price: Number(form.price), stock: Number(form.stock), unit: form.unit || "unit",
        district: "Kampala", status: "pending", views: 0, rating: 0, reviewCount: 0,
        createdAt: new Date().toISOString().split("T")[0],
      }
      setListings(prev => [newListing, ...prev])
      toast.success("Listing submitted for approval")
    }
    setShowForm(false)
    setEditing(null)
    setForm({ title: "", category: "live_pigs", price: "", stock: "", unit: "", description: "" })
  }

  const handleEdit = (listing: Listing) => {
    setEditing(listing)
    setForm({ title: listing.title, category: listing.category, price: String(listing.price), stock: String(listing.stock), unit: listing.unit, description: listing.description })
    setShowForm(true)
  }

  const handleDelete = (id: string) => {
    setListings(prev => prev.filter(l => l.id !== id))
    toast.success("Listing deleted")
  }

  return (
    <AppShell>
      <div className="p-4 lg:p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">My Listings</h1>
            <p className="text-sm text-gray-500 mt-0.5">Manage your products and services</p>
          </div>
          <Button
            onClick={() => { setEditing(null); setForm({ title: "", category: "live_pigs", price: "", stock: "", unit: "", description: "" }); setShowForm(true) }}
            className="bg-amber-500 hover:bg-amber-600 text-white rounded-xl gap-2"
          >
            <Plus size={16} /> Add Listing
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatCard label="Total Listings" value={stats.total} icon={ListChecks} color="green" />
          <StatCard label="Active" value={stats.active} icon={Package} color="blue" />
          <StatCard label="Pending Approval" value={stats.pending} icon={TrendingUp} color="amber" sub="Awaiting review" />
          <StatCard label="Est. Revenue" value={formatUGX(Math.round(stats.revenue))} icon={DollarSign} color="green" sub="Based on views" />
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-5">
          <Input
            value={search}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
            placeholder="Search listings..."
            className="rounded-xl border-gray-200 flex-1"
          />
          <Select value={categoryFilter} onValueChange={(v: string | null) => v && setCategoryFilter(v)}>
            <SelectTrigger className="w-full sm:w-40 rounded-xl border-gray-200"><SelectValue placeholder="Category" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {CATEGORIES_OPTIONS.map(c => <SelectItem key={c} value={c}>{CATEGORY_LABELS[c]}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={(v: string | null) => v && setStatusFilter(v)}>
            <SelectTrigger className="w-full sm:w-36 rounded-xl border-gray-200"><SelectValue placeholder="Status" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Table / Cards */}
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
          {/* Desktop table */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  {["Listing", "Category", "Price", "Stock", "Status", "Views", "Date", "Actions"].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map(l => (
                  <tr key={l.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-green-50 flex items-center justify-center text-lg shrink-0">{CATEGORY_ICONS[l.category]}</div>
                        <span className="font-medium text-gray-900 line-clamp-1 max-w-[200px]">{l.title}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">{CATEGORY_LABELS[l.category]}</span>
                    </td>
                    <td className="px-4 py-3 font-semibold text-green-700">{formatUGX(l.price)}</td>
                    <td className="px-4 py-3 text-gray-600">{l.stock} {l.unit}</td>
                    <td className="px-4 py-3"><StatusBadge status={l.status} /></td>
                    <td className="px-4 py-3 text-gray-500">
                      <span className="flex items-center gap-1"><Eye size={13} />{l.views}</span>
                    </td>
                    <td className="px-4 py-3 text-gray-400 text-xs">{l.createdAt}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button onClick={() => handleEdit(l)} className="p-1.5 rounded-lg hover:bg-blue-50 text-blue-500 transition-colors"><Pencil size={14} /></button>
                        <button onClick={() => handleDelete(l.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-red-500 transition-colors"><Trash2 size={14} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filtered.length === 0 && (
              <div className="text-center py-12 text-gray-400 text-sm">No listings match your filters</div>
            )}
          </div>

          {/* Mobile cards */}
          <div className="lg:hidden divide-y divide-gray-50">
            {filtered.map(l => (
              <div key={l.id} className="p-4 flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center text-xl shrink-0">{CATEGORY_ICONS[l.category]}</div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 text-sm line-clamp-1">{l.title}</p>
                  <p className="text-green-700 font-bold text-sm">{formatUGX(l.price)}</p>
                  <div className="flex items-center gap-2 mt-1"><StatusBadge status={l.status} /></div>
                </div>
                <div className="flex flex-col gap-1.5 shrink-0">
                  <button onClick={() => handleEdit(l)} className="p-1.5 rounded-lg hover:bg-blue-50 text-blue-500"><Pencil size={14} /></button>
                  <button onClick={() => handleDelete(l.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-red-500"><Trash2 size={14} /></button>
                </div>
              </div>
            ))}
            {filtered.length === 0 && <div className="text-center py-12 text-gray-400 text-sm">No listings match your filters</div>}
          </div>
        </div>
      </div>

      {/* Add/Edit Dialog */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="rounded-2xl max-w-md">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Listing" : "Add New Listing"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-2">
            <div className="space-y-1.5">
              <Label className="text-sm">Title</Label>
              <Input
                value={form.title}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setForm(p => ({ ...p, title: e.target.value }))}
                placeholder="e.g. Large White Boar — 8 months"
                className="rounded-xl"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-sm">Category</Label>
              <Select value={form.category} onValueChange={(v: string | null) => v && setForm(p => ({ ...p, category: v as Category }))}>
                <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {CATEGORIES_OPTIONS.map(c => <SelectItem key={c} value={c}>{CATEGORY_ICONS[c]} {CATEGORY_LABELS[c]}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-sm">Price (UGX)</Label>
                <Input
                  type="number"
                  value={form.price}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setForm(p => ({ ...p, price: e.target.value }))}
                  placeholder="950000"
                  className="rounded-xl"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-sm">Stock</Label>
                <Input
                  type="number"
                  value={form.stock}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setForm(p => ({ ...p, stock: e.target.value }))}
                  placeholder="5"
                  className="rounded-xl"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label className="text-sm">Unit (e.g. pig, bag, bottle)</Label>
              <Input
                value={form.unit}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setForm(p => ({ ...p, unit: e.target.value }))}
                placeholder="pig"
                className="rounded-xl"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-sm">Description</Label>
              <Textarea
                value={form.description}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setForm(p => ({ ...p, description: e.target.value }))}
                placeholder="Describe your product..."
                className="rounded-xl resize-none"
                rows={3}
              />
            </div>
            <div className="flex gap-3 pt-2">
              <Button variant="outline" onClick={() => setShowForm(false)} className="flex-1 rounded-xl">Cancel</Button>
              <Button onClick={handleSave} className="flex-1 bg-green-700 hover:bg-green-800 text-white rounded-xl">
                {editing ? "Save Changes" : "Submit Listing"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </AppShell>
  )
}
