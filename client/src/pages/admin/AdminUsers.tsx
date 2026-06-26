import { useState, useEffect } from "react"
import { api } from "../../lib/api"
import { formatDate } from "../../lib/data"
import { Search, Shield, ShieldCheck, ShieldX, Users, UserPlus, Store, UserCog, X, AlertTriangle } from "lucide-react"

interface UserData {
  id: string
  name: string
  email: string
  phone?: string
  role: string
  district?: string
  farmName?: string
  status: string
  suspendedAt?: string
  createdAt: string
}

interface UserDetail {
  id: string
  email: string
  name: string
  phone?: string
  role: string
  district?: string
  farmName?: string
  status: string
  suspendedAt?: string
  createdAt: string
  listingsCount: number
  ordersCount: number
  revenue: number
}

const roleIcon: Record<string, React.ReactNode> = {
  admin: <ShieldCheck size={16} />,
  seller: <Shield size={16} />,
  buyer: <ShieldX size={16} />,
}

export function AdminUsers() {
  const [users, setUsers] = useState<UserData[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [selectedUser, setSelectedUser] = useState<UserDetail | null>(null)
  const [actionLoading, setActionLoading] = useState(false)

  useEffect(() => {
    api.get("/api/admin/users").then(setUsers).catch(() => setUsers([])).finally(() => setLoading(false))
  }, [])

  const filtered = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.role.toLowerCase().includes(search.toLowerCase()),
  )

  const buyers = users.filter(u => u.role === "buyer").length
  const sellers = users.filter(u => u.role === "seller").length
  const admins = users.filter(u => u.role === "admin").length

  const openDetail = async (userId: string) => {
    setSelectedUser(null)
    try {
      const detail = await api.get(`/api/admin/users/${userId}`) as UserDetail
      setSelectedUser(detail)
    } catch {
      setSelectedUser(null)
    }
  }

  const toggleSuspension = async () => {
    if (!selectedUser) return
    setActionLoading(true)
    const newStatus = selectedUser.status === "suspended" ? "active" : "suspended"
    try {
      await api.patch(`/api/admin/users/${selectedUser.id}/status`, { status: newStatus })
      setSelectedUser({ ...selectedUser, status: newStatus, suspendedAt: newStatus === "suspended" ? new Date().toISOString() : undefined })
      setUsers((prev) => prev.map((u) => (u.id === selectedUser.id ? { ...u, status: newStatus } : u)))
    } catch {
      // ignore
    } finally {
      setActionLoading(false)
    }
  }

  const statusPill = (status: string) => (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-label-sm text-label-sm ${
        status === "active"
          ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400"
          : status === "suspended"
            ? "bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400"
            : "bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400"
      }`}
    >
      {status === "active" && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />}
      {status === "suspended" && <span className="w-1.5 h-1.5 rounded-full bg-red-500" />}
      {status}
    </span>
  )

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-headline-lg text-headline-lg text-on-surface dark:text-primary-fixed">Users</h1>
        <p className="text-on-surface-variant font-body-md text-body-md dark:text-outline-variant">
          Manage platform users ({users.length} total)
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
                <Users size={24} />
              </div>
              <p className="font-headline-md text-headline-md text-on-surface dark:text-primary-fixed">{users.length}</p>
              <p className="text-label-sm text-on-surface-variant dark:text-outline-variant">Total Users</p>
            </div>
            <div className="bg-surface-container-lowest rounded-xl p-5 shadow-sm border border-surface-container-high dark:bg-surface-dim dark:border-surface-container">
              <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3 dark:bg-emerald-900/20 dark:text-emerald-400">
                <UserPlus size={24} />
              </div>
              <p className="font-headline-md text-headline-md text-on-surface dark:text-primary-fixed">{buyers}</p>
              <p className="text-label-sm text-on-surface-variant dark:text-outline-variant">Buyers</p>
            </div>
            <div className="bg-surface-container-lowest rounded-xl p-5 shadow-sm border border-surface-container-high dark:bg-surface-dim dark:border-surface-container">
              <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center mb-3 dark:bg-amber-900/20 dark:text-amber-400">
                <Store size={24} />
              </div>
              <p className="font-headline-md text-headline-md text-on-surface dark:text-primary-fixed">{sellers}</p>
              <p className="text-label-sm text-on-surface-variant dark:text-outline-variant">Sellers</p>
            </div>
            <div className="bg-surface-container-lowest rounded-xl p-5 shadow-sm border border-surface-container-high dark:bg-surface-dim dark:border-surface-container">
              <div className="w-10 h-10 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center mb-3 dark:bg-purple-900/20 dark:text-purple-400">
                <UserCog size={24} />
              </div>
              <p className="font-headline-md text-headline-md text-on-surface dark:text-primary-fixed">{admins}</p>
              <p className="text-label-sm text-on-surface-variant dark:text-outline-variant">Admins</p>
            </div>
          </div>

          <div className="relative mb-6">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-outline dark:text-outline-variant" />
            <input
              className="w-full pl-11 pr-4 py-3 bg-warm-beige border-none rounded-xl focus:ring-2 focus:ring-primary text-body-md dark:bg-surface-dim dark:text-primary-fixed dark:placeholder:text-outline"
              placeholder="Search users..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-surface-container-high overflow-x-auto dark:bg-surface-dim dark:border-surface-container">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-outline-variant/30 dark:border-surface-container">
                  <th className="px-4 py-4 font-label-sm text-label-sm text-on-surface-variant dark:text-outline-variant">Name</th>
                  <th className="px-4 py-4 font-label-sm text-label-sm text-on-surface-variant dark:text-outline-variant">Email</th>
                  <th className="px-4 py-4 font-label-sm text-label-sm text-on-surface-variant dark:text-outline-variant">Role</th>
                  <th className="px-4 py-4 font-label-sm text-label-sm text-on-surface-variant dark:text-outline-variant">Status</th>
                  <th className="px-4 py-4 font-label-sm text-label-sm text-on-surface-variant dark:text-outline-variant">District</th>
                  <th className="px-4 py-4 font-label-sm text-label-sm text-on-surface-variant dark:text-outline-variant">Joined</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-12 text-center text-on-surface-variant font-body-md dark:text-outline-variant">
                      No users found.
                    </td>
                  </tr>
                ) : (
                  filtered.map((user) => (
                    <tr
                      key={user.id}
                      onClick={() => openDetail(user.id)}
                      className="border-b border-outline-variant/20 hover:bg-surface-container/50 transition-colors cursor-pointer dark:border-surface-container dark:hover:bg-on-background/50"
                    >
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-primary-container/30 flex items-center justify-center text-primary text-sm font-bold dark:bg-primary-fixed/20 dark:text-primary-fixed">
                            {user.name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-label-lg text-label-lg text-on-surface dark:text-primary-fixed">{user.name}</p>
                            {user.phone && (
                              <p className="text-label-sm text-on-surface-variant dark:text-outline-variant">{user.phone}</p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-label-sm text-on-surface-variant dark:text-outline-variant">{user.email}</td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-1.5 text-label-sm capitalize">
                          <span className="text-outline dark:text-outline-variant">{roleIcon[user.role]}</span>
                          <span className="text-on-surface dark:text-primary-fixed">{user.role}</span>
                        </div>
                      </td>
                      <td className="px-4 py-4">{statusPill(user.status)}</td>
                      <td className="px-4 py-4 text-label-sm text-on-surface-variant dark:text-outline-variant">{user.district || "--"}</td>
                      <td className="px-4 py-4 text-label-sm text-on-surface-variant dark:text-outline-variant">
                        {formatDate(user.createdAt)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </>
      )}

      {selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => setSelectedUser(null)}>
          <div
            className="bg-surface-container-lowest dark:bg-surface-dim rounded-2xl p-6 w-full max-w-md mx-4 shadow-xl border border-surface-container-high dark:border-surface-container"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-headline-sm text-headline-sm text-on-surface dark:text-primary-fixed">User Details</h2>
              <button onClick={() => setSelectedUser(null)} className="text-on-surface-variant hover:text-on-surface dark:text-outline-variant dark:hover:text-primary-fixed">
                <X size={20} />
              </button>
            </div>

            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-full bg-primary-container/30 flex items-center justify-center text-primary text-lg font-bold dark:bg-primary-fixed/20 dark:text-primary-fixed">
                {selectedUser.name.charAt(0)}
              </div>
              <div>
                <p className="font-label-lg text-label-lg text-on-surface dark:text-primary-fixed">{selectedUser.name}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-label-sm text-on-surface-variant dark:text-outline-variant capitalize">{selectedUser.role}</span>
                  {statusPill(selectedUser.status)}
                </div>
              </div>
            </div>

            <div className="space-y-3 mb-6">
              <div className="flex justify-between py-2 border-b border-outline-variant/20 dark:border-surface-container">
                <span className="text-label-sm text-on-surface-variant dark:text-outline-variant">Email</span>
                <span className="text-label-sm text-on-surface dark:text-primary-fixed">{selectedUser.email}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-outline-variant/20 dark:border-surface-container">
                <span className="text-label-sm text-on-surface-variant dark:text-outline-variant">Phone</span>
                <span className="text-label-sm text-on-surface dark:text-primary-fixed">{selectedUser.phone || "--"}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-outline-variant/20 dark:border-surface-container">
                <span className="text-label-sm text-on-surface-variant dark:text-outline-variant">District</span>
                <span className="text-label-sm text-on-surface dark:text-primary-fixed">{selectedUser.district || "--"}</span>
              </div>
              {selectedUser.farmName && (
                <div className="flex justify-between py-2 border-b border-outline-variant/20 dark:border-surface-container">
                  <span className="text-label-sm text-on-surface-variant dark:text-outline-variant">Farm Name</span>
                  <span className="text-label-sm text-on-surface dark:text-primary-fixed">{selectedUser.farmName}</span>
                </div>
              )}
              <div className="flex justify-between py-2 border-b border-outline-variant/20 dark:border-surface-container">
                <span className="text-label-sm text-on-surface-variant dark:text-outline-variant">Joined</span>
                <span className="text-label-sm text-on-surface dark:text-primary-fixed">{formatDate(selectedUser.createdAt)}</span>
              </div>
              {selectedUser.suspendedAt && (
                <div className="flex justify-between py-2 border-b border-outline-variant/20 dark:border-surface-container">
                  <span className="text-label-sm text-on-surface-variant dark:text-outline-variant">Suspended</span>
                  <span className="text-label-sm text-error">{formatDate(selectedUser.suspendedAt)}</span>
                </div>
              )}
            </div>

            <div className="grid grid-cols-3 gap-3 mb-6">
              <div className="p-3 rounded-lg bg-surface-container/50 dark:bg-surface-container/20 text-center">
                <p className="font-headline-sm text-headline-sm text-on-surface dark:text-primary-fixed">{selectedUser.listingsCount}</p>
                <p className="text-label-sm text-on-surface-variant dark:text-outline-variant">Listings</p>
              </div>
              <div className="p-3 rounded-lg bg-surface-container/50 dark:bg-surface-container/20 text-center">
                <p className="font-headline-sm text-headline-sm text-on-surface dark:text-primary-fixed">{selectedUser.ordersCount}</p>
                <p className="text-label-sm text-on-surface-variant dark:text-outline-variant">Orders</p>
              </div>
              <div className="p-3 rounded-lg bg-surface-container/50 dark:bg-surface-container/20 text-center">
                <p className="font-headline-sm text-headline-sm text-on-surface dark:text-primary-fixed">
                  UGX {selectedUser.revenue.toLocaleString("en-UG")}
                </p>
                <p className="text-label-sm text-on-surface-variant dark:text-outline-variant">Revenue</p>
              </div>
            </div>

            {selectedUser.role !== "admin" && (
              <button
                onClick={toggleSuspension}
                disabled={actionLoading}
                className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl font-label-lg text-label-lg transition-colors ${
                  selectedUser.status === "suspended"
                    ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-400"
                    : "bg-red-50 text-red-700 hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400"
                }`}
              >
                <AlertTriangle size={18} />
                {actionLoading ? "Processing..." : selectedUser.status === "suspended" ? "Reactivate Account" : "Suspend Account"}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
