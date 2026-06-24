import { useState } from "react"
import { MOCK_USERS } from "../../lib/data"
import { Search, Shield, ShieldCheck, ShieldX } from "lucide-react"

const roleIcon: Record<string, React.ReactNode> = {
  admin: <ShieldCheck size={16} />,
  seller: <Shield size={16} />,
  buyer: <ShieldX size={16} />,
}

const statusColor: Record<string, string> = {
  active: "text-emerald-600 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-900/20",
  pending: "text-amber-600 bg-amber-50 dark:text-amber-400 dark:bg-amber-900/20",
  suspended: "text-red-600 bg-red-50 dark:text-red-400 dark:bg-red-900/20",
}

function StatusPill({ status }: { status: string }) {
  return (
    <span className={`inline-block px-3 py-1 rounded-full text-label-sm font-label-sm capitalize ${statusColor[status] || ""}`}>
      {status}
    </span>
  )
}

export function AdminUsers() {
  const [search, setSearch] = useState("")

  const filtered = MOCK_USERS.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.role.toLowerCase().includes(search.toLowerCase()),
  )

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-headline-lg text-headline-lg text-on-surface dark:text-primary-fixed">Users</h1>
        <p className="text-on-surface-variant font-body-md text-body-md dark:text-outline-variant">
          Manage platform users ({MOCK_USERS.length} total)
        </p>
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
              <th className="px-4 py-4 font-label-sm text-label-sm text-on-surface-variant dark:text-outline-variant">District</th>
              <th className="px-4 py-4 font-label-sm text-label-sm text-on-surface-variant dark:text-outline-variant">Status</th>
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
                <tr key={user.id} className="border-b border-outline-variant/20 hover:bg-surface-container/50 transition-colors dark:border-surface-container dark:hover:bg-on-background/50">
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-primary-container/30 flex items-center justify-center text-primary text-sm font-bold dark:bg-primary-fixed/20 dark:text-primary-fixed">
                        {user.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-label-lg text-label-lg text-on-surface dark:text-primary-fixed">{user.name}</p>
                        <p className="text-label-sm text-on-surface-variant dark:text-outline-variant">{user.phone}</p>
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
                  <td className="px-4 py-4 text-label-sm text-on-surface-variant dark:text-outline-variant">{user.district}</td>
                  <td className="px-4 py-4"><StatusPill status={user.status} /></td>
                  <td className="px-4 py-4 text-label-sm text-on-surface-variant dark:text-outline-variant">{user.joinedAt}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
