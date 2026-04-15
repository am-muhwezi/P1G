import { useState } from "react"
import { AppShell, AdminPageHeader, StatusBadge, RoleBadge, StatCard } from "@/components/layout/AppShell"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { MOCK_USERS, type User } from "@/lib/data"
import { Users, UserCheck, UserX, AlertCircle, CheckCircle, XCircle, Eye, UserPlus, Download } from "lucide-react"
import { toast } from "sonner"

type Tab = "all" | "buyers" | "sellers" | "pending" | "suspended"

export default function AdminUsers() {
  const [users, setUsers] = useState<User[]>(MOCK_USERS)
  const [tab, setTab] = useState<Tab>("all")
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selected, setSelected] = useState<User | null>(null)

  const tabFilters: Record<Tab, (u: User) => boolean> = {
    all:       () => true,
    buyers:    u => u.role === "buyer",
    sellers:   u => u.role === "seller",
    pending:   u => u.status === "pending",
    suspended: u => u.status === "suspended",
  }

  const filtered = users.filter(u => {
    const matchTab = tabFilters[tab](u)
    const matchSearch = search === "" || u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase())
    const matchStatus = statusFilter === "all" || u.status === statusFilter
    return matchTab && matchSearch && matchStatus
  })

  const updateStatus = (id: string, status: User["status"]) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, status } : u))
    const action = status === "active" ? "approved" : status === "suspended" ? "suspended" : "updated"
    toast.success(`User ${action} successfully`)
    if (selected?.id === id) setSelected(prev => prev ? { ...prev, status } : null)
  }

  const removeUser = (id: string) => {
    setUsers(prev => prev.filter(u => u.id !== id))
    toast.success("User removed from platform")
    setSelected(null)
  }

  const TABS: { key: Tab; label: string; count: number }[] = [
    { key: "all",       label: "All Users", count: users.length },
    { key: "buyers",    label: "Buyers",    count: users.filter(u => u.role === "buyer").length },
    { key: "sellers",   label: "Sellers",   count: users.filter(u => u.role === "seller").length },
    { key: "pending",   label: "Pending",   count: users.filter(u => u.status === "pending").length },
    { key: "suspended", label: "Suspended", count: users.filter(u => u.status === "suspended").length },
  ]

  return (
    <AppShell>
      <div className="p-4 lg:p-6">
        <AdminPageHeader
          title="User Management"
          subtitle="Onboard, approve, and manage platform users"
          action={
            <div className="flex gap-2">
              <Button variant="outline" className="rounded-xl h-9 text-sm gap-1.5 hidden sm:flex border-gray-200">
                <Download size={14} /> Export
              </Button>
              <Button className="bg-amber-500 hover:bg-amber-600 text-white rounded-xl h-9 text-sm gap-1.5">
                <UserPlus size={14} /> Onboard Seller
              </Button>
            </div>
          }
        />

        {/* Stats row */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 mb-5">
          <StatCard label="Total Users" value={users.length.toLocaleString()} icon={Users} color="blue" />
          <StatCard label="Buyers" value={users.filter(u => u.role === "buyer").length} icon={UserCheck} color="blue" />
          <StatCard label="Sellers" value={users.filter(u => u.role === "seller").length} icon={UserCheck} color="green" />
          <StatCard label="Pending" value={users.filter(u => u.status === "pending").length} icon={AlertCircle} color="amber" />
          <StatCard label="Suspended" value={users.filter(u => u.status === "suspended").length} icon={UserX} color="red" />
        </div>

        {/* Tabs */}
        <div className="flex gap-1 overflow-x-auto mb-4 bg-gray-100 p-1 rounded-xl w-fit">
          {TABS.map(t => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                tab === t.key ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {t.label}
              <span className={`text-xs px-1.5 py-0.5 rounded-full ${tab === t.key ? "bg-green-100 text-green-700" : "bg-gray-200 text-gray-500"}`}>
                {t.count}
              </span>
            </button>
          ))}
        </div>

        {/* Filters */}
        <div className="flex gap-3 mb-4">
          <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name or email..." className="rounded-xl border-gray-200 flex-1 max-w-sm" />
          <Select value={statusFilter} onValueChange={(v: string | null) => v && setStatusFilter(v)}>
            <SelectTrigger className="w-36 rounded-xl border-gray-200"><SelectValue placeholder="Status" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="suspended">Suspended</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
          {/* Desktop */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  {["User", "Email", "Phone", "Role", "District", "Status", "Joined", "Actions"].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map(u => (
                  <tr key={u.id} className={`hover:bg-gray-50/50 transition-colors ${u.status === "pending" ? "border-l-2 border-l-amber-400" : ""}`}>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-sm font-bold text-green-700 shrink-0">
                          {u.name[0]}
                        </div>
                        <span className="font-medium text-gray-900">{u.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-500">{u.email}</td>
                    <td className="px-4 py-3 text-gray-500">{u.phone}</td>
                    <td className="px-4 py-3"><RoleBadge role={u.role} /></td>
                    <td className="px-4 py-3 text-gray-500">{u.district}</td>
                    <td className="px-4 py-3"><StatusBadge status={u.status} /></td>
                    <td className="px-4 py-3 text-gray-400 text-xs">{u.joinedAt}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        <button onClick={() => setSelected(u)} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors" title="View"><Eye size={14} /></button>
                        {u.status === "pending" && (
                          <button onClick={() => updateStatus(u.id, "active")} className="p-1.5 rounded-lg hover:bg-green-50 text-green-600 transition-colors" title="Approve"><CheckCircle size={14} /></button>
                        )}
                        {u.status !== "suspended" && (
                          <button onClick={() => updateStatus(u.id, "suspended")} className="p-1.5 rounded-lg hover:bg-amber-50 text-amber-600 transition-colors" title="Suspend"><AlertCircle size={14} /></button>
                        )}
                        {u.status === "suspended" && (
                          <button onClick={() => updateStatus(u.id, "active")} className="p-1.5 rounded-lg hover:bg-green-50 text-green-600 transition-colors" title="Reinstate"><CheckCircle size={14} /></button>
                        )}
                        <button onClick={() => removeUser(u.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-red-500 transition-colors" title="Remove"><XCircle size={14} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filtered.length === 0 && <div className="text-center py-12 text-gray-400 text-sm">No users match your filters</div>}
          </div>

          {/* Mobile */}
          <div className="lg:hidden divide-y divide-gray-50">
            {filtered.map(u => (
              <div key={u.id} className={`p-4 flex items-center gap-3 ${u.status === "pending" ? "border-l-4 border-l-amber-400" : ""}`}>
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-sm font-bold text-green-700 shrink-0">{u.name[0]}</div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 text-sm">{u.name}</p>
                  <p className="text-xs text-gray-400 truncate">{u.email}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <RoleBadge role={u.role} />
                    <StatusBadge status={u.status} />
                  </div>
                </div>
                <div className="flex flex-col gap-1.5 shrink-0">
                  {u.status === "pending" && (
                    <button onClick={() => updateStatus(u.id, "active")} className="p-1.5 rounded-lg bg-green-50 text-green-600"><CheckCircle size={14} /></button>
                  )}
                  <button onClick={() => setSelected(u)} className="p-1.5 rounded-lg bg-gray-50 text-gray-500"><Eye size={14} /></button>
                  <button onClick={() => removeUser(u.id)} className="p-1.5 rounded-lg bg-red-50 text-red-500"><XCircle size={14} /></button>
                </div>
              </div>
            ))}
            {filtered.length === 0 && <div className="text-center py-12 text-gray-400 text-sm">No users match your filters</div>}
          </div>
        </div>
      </div>

      {/* User detail dialog */}
      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        <DialogContent className="rounded-2xl max-w-sm">
          <DialogHeader>
            <DialogTitle>User Details</DialogTitle>
          </DialogHeader>
          {selected && (
            <div className="space-y-4 mt-2">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-lg font-bold text-green-700">{selected.name[0]}</div>
                <div>
                  <p className="font-bold text-gray-900">{selected.name}</p>
                  <div className="flex items-center gap-2 mt-1"><RoleBadge role={selected.role} /><StatusBadge status={selected.status} /></div>
                </div>
              </div>
              <div className="bg-gray-50 rounded-xl p-3 space-y-2 text-sm">
                {[
                  { label: "Email", value: selected.email },
                  { label: "Phone", value: selected.phone },
                  { label: "District", value: selected.district },
                  { label: "Joined", value: selected.joinedAt },
                  { label: "Last Active", value: selected.lastActive },
                ].map(r => (
                  <div key={r.label} className="flex justify-between">
                    <span className="text-gray-500">{r.label}</span>
                    <span className="font-medium text-gray-900">{r.value}</span>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                {selected.status === "pending" && (
                  <Button onClick={() => updateStatus(selected.id, "active")} className="flex-1 bg-green-700 hover:bg-green-800 text-white rounded-xl h-9 text-sm">
                    Approve
                  </Button>
                )}
                {selected.status !== "suspended" ? (
                  <Button onClick={() => updateStatus(selected.id, "suspended")} variant="outline" className="flex-1 rounded-xl h-9 text-sm text-amber-600 border-amber-200 hover:bg-amber-50">
                    Suspend
                  </Button>
                ) : (
                  <Button onClick={() => updateStatus(selected.id, "active")} className="flex-1 bg-green-700 hover:bg-green-800 text-white rounded-xl h-9 text-sm">
                    Reinstate
                  </Button>
                )}
                <Button onClick={() => removeUser(selected.id)} variant="outline" className="flex-1 rounded-xl h-9 text-sm text-red-600 border-red-200 hover:bg-red-50">
                  Remove
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </AppShell>
  )
}
