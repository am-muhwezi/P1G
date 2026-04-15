import { useState } from "react"
import { AppShell, AdminPageHeader, StatusBadge, StatCard } from "@/components/layout/AppShell"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { MOCK_LISTINGS, CATEGORY_LABELS, CATEGORY_ICONS, formatUGX, type Listing } from "@/lib/data"
import { ListChecks, CheckCircle, XCircle, Eye, AlertCircle, Clock } from "lucide-react"
import { toast } from "sonner"

export default function AdminListingApprovals() {
  const [listings, setListings] = useState<Listing[]>(MOCK_LISTINGS)
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("pending")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [selected, setSelected] = useState<Listing | null>(null)
  const [rejectReason, setRejectReason] = useState("")
  const [showRejectDialog, setShowRejectDialog] = useState(false)
  const [rejectTarget, setRejectTarget] = useState<string | null>(null)

  const approveListing = (id: string) => {
    setListings(prev => prev.map(l => l.id === id ? { ...l, status: "active" } : l))
    toast.success("Listing approved and is now live")
    if (selected?.id === id) setSelected(prev => prev ? { ...prev, status: "active" } : null)
  }

  const rejectListing = (id: string) => {
    setListings(prev => prev.map(l => l.id === id ? { ...l, status: "rejected" } : l))
    toast.success("Listing rejected")
    setShowRejectDialog(false)
    setRejectReason("")
    setRejectTarget(null)
    if (selected?.id === id) setSelected(prev => prev ? { ...prev, status: "rejected" } : null)
  }

  const openReject = (id: string) => { setRejectTarget(id); setShowRejectDialog(true) }

  const stats = {
    pending:  listings.filter(l => l.status === "pending").length,
    active:   listings.filter(l => l.status === "active").length,
    rejected: listings.filter(l => l.status === "rejected").length,
    total:    listings.length,
  }

  const filtered = listings.filter(l => {
    const matchSearch = l.title.toLowerCase().includes(search.toLowerCase()) || l.sellerName.toLowerCase().includes(search.toLowerCase())
    const matchStatus = statusFilter === "all" || l.status === statusFilter
    const matchCat = categoryFilter === "all" || l.category === categoryFilter
    return matchSearch && matchStatus && matchCat
  })

  return (
    <AppShell>
      <div className="p-4 lg:p-6">
        <AdminPageHeader
          title="Listing Approvals"
          subtitle="Review and approve or reject seller listings"
        />

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
          <StatCard label="Pending Review" value={stats.pending} icon={Clock} color="amber" sub="Needs action" />
          <StatCard label="Active Listings" value={stats.active} icon={CheckCircle} color="green" />
          <StatCard label="Rejected" value={stats.rejected} icon={XCircle} color="red" />
          <StatCard label="Total" value={stats.total} icon={ListChecks} color="blue" />
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search listing or seller..." className="rounded-xl border-gray-200 flex-1" />
          <Select value={statusFilter} onValueChange={(v: string | null) => v && setStatusFilter(v)}>
            <SelectTrigger className="w-full sm:w-36 rounded-xl border-gray-200"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
          <Select value={categoryFilter} onValueChange={(v: string | null) => v && setCategoryFilter(v)}>
            <SelectTrigger className="w-full sm:w-40 rounded-xl border-gray-200"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {(Object.keys(CATEGORY_LABELS) as Array<keyof typeof CATEGORY_LABELS>).map(c => (
                <SelectItem key={c} value={c}>{CATEGORY_ICONS[c]} {CATEGORY_LABELS[c]}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  {["Listing", "Seller", "Category", "Price", "Stock", "Status", "Submitted", "Actions"].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map(l => (
                  <tr key={l.id} className={`hover:bg-gray-50/50 transition-colors ${l.status === "pending" ? "border-l-2 border-l-amber-400" : ""}`}>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-green-50 flex items-center justify-center text-lg shrink-0">{CATEGORY_ICONS[l.category]}</div>
                        <span className="font-medium text-gray-900 max-w-[180px] line-clamp-1">{l.title}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        <span className="text-gray-700">{l.sellerName}</span>
                        {l.sellerVerified && <span className="text-green-600 text-xs">✓</span>}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">{CATEGORY_LABELS[l.category]}</span>
                    </td>
                    <td className="px-4 py-3 font-semibold text-green-700">{formatUGX(l.price)}</td>
                    <td className="px-4 py-3 text-gray-600">{l.stock} {l.unit}</td>
                    <td className="px-4 py-3"><StatusBadge status={l.status} /></td>
                    <td className="px-4 py-3 text-gray-400 text-xs">{l.createdAt}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        <button onClick={() => setSelected(l)} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500"><Eye size={14} /></button>
                        {l.status === "pending" && (
                          <>
                            <button onClick={() => approveListing(l.id)} className="p-1.5 rounded-lg hover:bg-green-50 text-green-600" title="Approve"><CheckCircle size={14} /></button>
                            <button onClick={() => openReject(l.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-red-500" title="Reject"><XCircle size={14} /></button>
                          </>
                        )}
                        {l.status === "rejected" && (
                          <button onClick={() => approveListing(l.id)} className="p-1.5 rounded-lg hover:bg-green-50 text-green-600" title="Re-approve"><CheckCircle size={14} /></button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filtered.length === 0 && <div className="text-center py-12 text-gray-400 text-sm">No listings match your filters</div>}
          </div>

          {/* Mobile */}
          <div className="lg:hidden divide-y divide-gray-50">
            {filtered.map(l => (
              <div key={l.id} className={`p-4 flex items-start gap-3 ${l.status === "pending" ? "border-l-4 border-l-amber-400" : ""}`}>
                <div className="w-11 h-11 rounded-xl bg-green-50 flex items-center justify-center text-xl shrink-0">{CATEGORY_ICONS[l.category]}</div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 text-sm line-clamp-1">{l.title}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{l.sellerName} • {formatUGX(l.price)}</p>
                  <div className="flex items-center gap-2 mt-1.5"><StatusBadge status={l.status} /></div>
                </div>
                <div className="flex flex-col gap-1.5 shrink-0">
                  {l.status === "pending" && (
                    <>
                      <button onClick={() => approveListing(l.id)} className="p-1.5 rounded-lg bg-green-50 text-green-600"><CheckCircle size={14} /></button>
                      <button onClick={() => openReject(l.id)} className="p-1.5 rounded-lg bg-red-50 text-red-500"><XCircle size={14} /></button>
                    </>
                  )}
                  <button onClick={() => setSelected(l)} className="p-1.5 rounded-lg bg-gray-50 text-gray-500"><Eye size={14} /></button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Listing detail dialog */}
      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        <DialogContent className="rounded-2xl max-w-md">
          <DialogHeader>
            <DialogTitle>Listing Review</DialogTitle>
          </DialogHeader>
          {selected && (
            <div className="space-y-4 mt-2">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-2xl bg-green-50 flex items-center justify-center text-3xl">{CATEGORY_ICONS[selected.category]}</div>
                <div>
                  <p className="font-bold text-gray-900 text-sm leading-snug">{selected.title}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{selected.sellerName} {selected.sellerVerified ? "✓" : ""}</p>
                  <StatusBadge status={selected.status} />
                </div>
              </div>
              <div className="bg-gray-50 rounded-xl p-3 space-y-2 text-sm">
                {[
                  { label: "Category", value: CATEGORY_LABELS[selected.category] },
                  { label: "Price", value: formatUGX(selected.price) },
                  { label: "Stock", value: `${selected.stock} ${selected.unit}` },
                  { label: "District", value: selected.district },
                  { label: "Submitted", value: selected.createdAt },
                ].map(r => (
                  <div key={r.label} className="flex justify-between">
                    <span className="text-gray-500">{r.label}</span>
                    <span className="font-medium text-gray-900">{r.value}</span>
                  </div>
                ))}
              </div>
              <div className="bg-gray-50 rounded-xl p-3">
                <p className="text-xs font-semibold text-gray-600 mb-1">Description</p>
                <p className="text-sm text-gray-700 leading-relaxed">{selected.description}</p>
              </div>
              {selected.status === "pending" && (
                <div className="flex gap-2">
                  <Button onClick={() => approveListing(selected.id)} className="flex-1 bg-green-700 hover:bg-green-800 text-white rounded-xl h-10 text-sm gap-1.5">
                    <CheckCircle size={14} /> Approve
                  </Button>
                  <Button onClick={() => { openReject(selected.id); setSelected(null) }} variant="outline" className="flex-1 rounded-xl h-10 text-sm text-red-600 border-red-200 hover:bg-red-50 gap-1.5">
                    <XCircle size={14} /> Reject
                  </Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Reject reason dialog */}
      <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <DialogContent className="rounded-2xl max-w-sm">
          <DialogHeader>
            <DialogTitle>Reject Listing</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 mt-2">
            <div className="flex items-start gap-2 bg-amber-50 text-amber-800 text-xs px-3 py-2.5 rounded-xl border border-amber-100">
              <AlertCircle size={14} className="mt-0.5 shrink-0" />
              The seller will be notified of the rejection reason.
            </div>
            <div className="space-y-1.5">
              <Label className="text-sm">Reason for Rejection</Label>
              <Textarea
                value={rejectReason}
                onChange={e => setRejectReason(e.target.value)}
                placeholder="e.g. Images don't meet quality standards, price appears incorrect..."
                className="rounded-xl resize-none"
                rows={3}
              />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setShowRejectDialog(false)} className="flex-1 rounded-xl">Cancel</Button>
              <Button onClick={() => rejectTarget && rejectListing(rejectTarget)} className="flex-1 bg-red-600 hover:bg-red-700 text-white rounded-xl">Confirm Reject</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </AppShell>
  )
}
