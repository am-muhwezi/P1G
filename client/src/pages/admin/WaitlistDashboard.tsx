import { useState, useMemo, useEffect } from "react"
import { Users, UserPlus, Store, TrendingUp, Download, Search, ArrowUpDown, RefreshCw } from "lucide-react"

interface WaitlistEntry {
  id: string
  name: string
  email: string
  phone: string
  interest: "buyer" | "seller" | "both"
  createdAt: string
}

const API_BASE = "http://localhost:8000"

const STORAGE_KEY = "p1g-waitlist"

async function fetchFromAPI(): Promise<WaitlistEntry[] | null> {
  try {
    const adminPassword = localStorage.getItem("p1g-waitlist-admin-pw") || ""
    const res = await fetch(`${API_BASE}/api/waitlist`, {
      headers: { "x-admin-password": adminPassword },
    })
    if (!res.ok) return null
    const data = await res.json()
    if (Array.isArray(data) && data.length > 0) {
      return data.map((e: Record<string, unknown>) => ({
        id: e["id"] as string,
        name: e["name"] as string,
        email: e["email"] as string,
        phone: e["phone"] as string,
        interest: e["interest"] as WaitlistEntry["interest"],
        createdAt: (e["created_at"] ?? e["createdAt"]) as string,
      }))
    }
  } catch { /* backend not reachable */ }
  return null
}

function loadLocalEntries(): WaitlistEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw) as WaitlistEntry[]
      if (parsed.length > 0) return parsed
    }
  } catch { /* ignore */ }
  return []
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-UG", {
    day: "numeric", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  })
}

const interestLabel: Record<string, { label: string; color: string }> = {
  buyer: { label: "Buyer", color: "bg-sky-50 text-sky-700 dark:bg-sky-900/20 dark:text-sky-400" },
  seller: { label: "Seller", color: "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400" },
  both: { label: "Both", color: "bg-purple-50 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400" },
}

type SortKey = "name" | "email" | "interest" | "createdAt"

export default function WaitlistDashboard() {
  const [entries, setEntries] = useState<WaitlistEntry[]>(loadLocalEntries)
  const [loadingAPI, setLoadingAPI] = useState(true)
  const [apiSource, setApiSource] = useState(false)

  useEffect(() => {
    fetchFromAPI().then(apiData => {
      if (apiData) {
        setEntries(apiData)
        setApiSource(true)
      }
      setLoadingAPI(false)
    })
  }, [])

  const [search, setSearch] = useState("")
  const [filterInterest, setFilterInterest] = useState<string>("all")
  const [sortKey, setSortKey] = useState<SortKey>("createdAt")
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc")

  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    return entries
      .filter(e => {
        if (filterInterest !== "all" && e.interest !== filterInterest) return false
        if (!q) return true
        return (
          e.name.toLowerCase().includes(q) ||
          e.email.toLowerCase().includes(q) ||
          e.phone.includes(q)
        )
      })
      .sort((a, b) => {
        const mul = sortDir === "asc" ? 1 : -1
        if (sortKey === "createdAt") return mul * (new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
        if (sortKey === "name") return mul * a.name.localeCompare(b.name)
        if (sortKey === "email") return mul * a.email.localeCompare(b.email)
        return mul * a.interest.localeCompare(b.interest)
      })
  }, [entries, search, filterInterest, sortKey, sortDir])

  const stats = useMemo(() => ({
    total: entries.length,
    buyers: entries.filter(e => e.interest === "buyer" || e.interest === "both").length,
    sellers: entries.filter(e => e.interest === "seller" || e.interest === "both").length,
    today: entries.filter(e => {
      const d = new Date(e.createdAt)
      const now = new Date()
      return d.toDateString() === now.toDateString()
    }).length,
  }), [entries])

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir(d => d === "asc" ? "desc" : "asc")
    else { setSortKey(key); setSortDir("desc") }
  }

  const exportCSV = () => {
    const header = "Name,Email,Phone,Interest,Date Joined"
    const rows = entries.map(e =>
      `"${e.name}","${e.email}","${e.phone}","${e.interest}","${new Date(e.createdAt).toISOString()}"`
    )
    const bom = "\uFEFF"
    const blob = new Blob([bom + header + "\n" + rows.join("\n")], { type: "text/csv;charset=utf-8" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `p1g-waitlist-${new Date().toISOString().slice(0, 10)}.csv`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const SortHeader = ({ label, sortKey: k }: { label: string; sortKey: SortKey }) => (
    <button
      onClick={() => toggleSort(k)}
      className="flex items-center gap-1 text-label-sm font-label-sm text-on-surface-variant hover:text-primary transition-colors"
    >
      {label}
      <ArrowUpDown size={12} className={sortKey === k ? "text-primary" : "opacity-40"} />
    </button>
  )

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-headline-lg text-headline-lg text-on-surface dark:text-primary-fixed">Waitlist</h1>
          <p className="text-on-surface-variant font-body-md text-body-md dark:text-outline-variant">
            People who opted in for early access
          </p>
        </div>
        <button
          onClick={exportCSV}
          className="inline-flex items-center gap-2 bg-primary text-on-primary hover:bg-primary/90 rounded-xl px-5 py-3 font-label-lg text-label-lg transition-all active:scale-95 shadow-md"
        >
          <Download size={18} />
          Export CSV
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { icon: Users, label: "Total Signups", value: stats.total, color: "bg-sky-50 text-sky-600 dark:bg-sky-900/20 dark:text-sky-400" },
          { icon: UserPlus, label: "Buyers", value: stats.buyers, color: "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400" },
          { icon: Store, label: "Sellers", value: stats.sellers, color: "bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400" },
          { icon: TrendingUp, label: "Joined Today", value: stats.today, color: "bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400" },
        ].map(s => (
          <div key={s.label} className="bg-surface-container-lowest rounded-xl p-5 shadow-sm border border-surface-container-high dark:bg-surface-dim dark:border-surface-container">
            <div className={`w-10 h-10 rounded-lg ${s.color} flex items-center justify-center mb-3`}>
              <s.icon size={24} />
            </div>
            <p className="font-headline-md text-headline-md text-on-surface dark:text-primary-fixed">{s.value}</p>
            <p className="text-label-sm text-on-surface-variant dark:text-outline-variant">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant" />
          <input
            type="text"
            placeholder="Search by name, email or phone..."
            className="w-full pl-9 pr-4 py-2.5 bg-warm-beige rounded-xl text-body-md text-on-surface placeholder:text-outline focus:ring-2 focus:ring-primary outline-none border-none dark:bg-surface-dim dark:text-primary-fixed"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          {["all", "buyer", "seller", "both"].map(f => (
            <button
              key={f}
              onClick={() => setFilterInterest(f)}
              className={`px-4 py-2 rounded-xl text-label-sm font-label-sm transition-all ${
                filterInterest === f
                  ? "bg-primary text-on-primary"
                  : "bg-surface-container-lowest text-on-surface-variant hover:bg-surface-container dark:bg-surface-dim dark:text-outline-variant"
              }`}
            >
              {f === "all" ? "All" : f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-surface-container-high overflow-hidden dark:bg-surface-dim dark:border-surface-container">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-outline-variant/20 dark:border-surface-container">
                {[
                  { label: "Name", key: "name" as SortKey },
                  { label: "Email", key: "email" as SortKey },
                  { label: "Phone", key: null },
                  { label: "Interest", key: "interest" as SortKey },
                  { label: "Date Joined", key: "createdAt" as SortKey },
                ].map(col => (
                  <th key={col.label} className="text-left px-5 py-4">
                    {col.key ? <SortHeader label={col.label} sortKey={col.key} /> : (
                      <span className="text-label-sm font-label-sm text-on-surface-variant">{col.label}</span>
                    )}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-12 text-on-surface-variant text-body-md">
                    No waitlist entries found.
                  </td>
                </tr>
              ) : (
                filtered.map((entry, i) => (
                  <tr key={entry.id} className={`border-b border-outline-variant/10 dark:border-surface-container hover:bg-surface-container/30 dark:hover:bg-surface-container/50 transition-colors ${i === 0 ? "bg-primary/5" : ""}`}>
                    <td className="px-5 py-4">
                      <span className="font-label-lg text-label-lg text-on-surface dark:text-primary-fixed">{entry.name}</span>
                    </td>
                    <td className="px-5 py-4">
                      <a href={`mailto:${entry.email}`} className="text-body-md text-primary hover:underline dark:text-primary-fixed">{entry.email}</a>
                    </td>
                    <td className="px-5 py-4 text-body-md text-on-surface-variant dark:text-outline-variant">{entry.phone}</td>
                    <td className="px-5 py-4">
                      <span className={`inline-block px-3 py-1 rounded-full text-label-sm font-label-sm ${interestLabel[entry.interest]?.color ?? ""}`}>
                        {interestLabel[entry.interest]?.label ?? entry.interest}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-body-md text-on-surface-variant dark:text-outline-variant">{formatDate(entry.createdAt)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className="px-5 py-3 border-t border-outline-variant/10 dark:border-surface-container flex items-center justify-between text-label-sm text-on-surface-variant">
          <span>
            {filtered.length} of {entries.length} entries
            {loadingAPI && <span className="ml-2 text-primary/50"><RefreshCw size={12} className="inline animate-spin" /> connecting...</span>}
            {!loadingAPI && apiSource && <span className="ml-2 text-emerald-600">API</span>}
            {!loadingAPI && !apiSource && <span className="ml-2 text-amber-600">local</span>}
          </span>
          {entries.length > 0 && (
            <span className="text-primary/70">Latest first</span>
          )}
        </div>
      </div>
    </div>
  )
}
