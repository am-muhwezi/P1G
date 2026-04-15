import { Link } from "react-router-dom"
import { AppShell, StatCard } from "@/components/layout/AppShell"
import { Button } from "@/components/ui/button"
import { MOCK_LISTINGS, formatUGX } from "@/lib/data"
import { useAuth } from "@/store/auth"
import { ListChecks, Package, Eye, TrendingUp } from "lucide-react"
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts"

const WEEKLY_DATA = [
  { day: "Mon", orders: 3 }, { day: "Tue", orders: 5 }, { day: "Wed", orders: 2 },
  { day: "Thu", orders: 7 }, { day: "Fri", orders: 9 }, { day: "Sat", orders: 4 }, { day: "Sun", orders: 1 },
]

export default function SellerDashboard() {
  const { userId, name } = useAuth()
  const myListings = MOCK_LISTINGS.filter(l => l.sellerId === userId)
  const active = myListings.filter(l => l.status === "active")
  const pending = myListings.filter(l => l.status === "pending")
  const totalViews = myListings.reduce((s, l) => s + l.views, 0)

  return (
    <AppShell>
      <div className="p-4 lg:p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Welcome back, {name?.split(" ")[0]} 👋</h1>
            <p className="text-sm text-gray-500 mt-0.5">Here's how your store is doing</p>
          </div>
          <Link to="/seller/listings">
            <Button className="bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-sm hidden sm:flex">
              Manage Listings
            </Button>
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatCard label="Total Listings" value={myListings.length} icon={ListChecks} color="green" />
          <StatCard label="Active Listings" value={active.length} icon={Package} color="blue" />
          <StatCard label="Pending Approval" value={pending.length} icon={TrendingUp} color="amber" sub={pending.length > 0 ? "Awaiting admin review" : "All clear"} />
          <StatCard label="Total Views" value={totalViews.toLocaleString()} icon={Eye} color="green" sub="Across all listings" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Orders chart */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
            <h2 className="font-bold text-gray-900 mb-1">Orders This Week</h2>
            <p className="text-xs text-gray-400 mb-4">Daily order count</p>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={WEEKLY_DATA} barSize={24}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="day" tick={{ fontSize: 12, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #e5e7eb", fontSize: 12 }} />
                <Bar dataKey="orders" fill="#2D6A2D" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Quick links */}
          <div className="space-y-3">
            <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
              <h3 className="font-bold text-gray-900 text-sm mb-3">My Listings Status</h3>
              <div className="space-y-2">
                {[
                  { label: "Active", count: active.length, color: "bg-green-500" },
                  { label: "Pending", count: pending.length, color: "bg-amber-500" },
                  { label: "Rejected", count: myListings.filter(l => l.status === "rejected").length, color: "bg-red-500" },
                ].map(s => (
                  <div key={s.label} className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <div className={`w-2 h-2 rounded-full ${s.color}`} />
                      {s.label}
                    </div>
                    <span className="text-sm font-bold text-gray-900">{s.count}</span>
                  </div>
                ))}
              </div>
            </div>
            <Link to="/seller/listings" className="block">
              <div className="bg-green-50 rounded-2xl border border-green-100 p-4 hover:bg-green-100 transition-colors cursor-pointer">
                <p className="text-sm font-semibold text-green-800">+ Add New Listing</p>
                <p className="text-xs text-green-600 mt-0.5">Submit a product for approval</p>
              </div>
            </Link>
          </div>
        </div>

        {/* Recent Listings */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5 mt-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-gray-900">Recent Listings</h2>
            <Link to="/seller/listings" className="text-xs text-green-700 hover:underline">See all</Link>
          </div>
          <div className="space-y-3">
            {myListings.slice(0, 4).map(l => (
              <div key={l.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-green-50 flex items-center justify-center text-base">🐷</div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 line-clamp-1">{l.title}</p>
                    <p className="text-xs text-gray-400">{formatUGX(l.price)} • {l.views} views</p>
                  </div>
                </div>
                <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                  l.status === "active" ? "bg-green-100 text-green-700" :
                  l.status === "pending" ? "bg-amber-100 text-amber-700" : "bg-red-100 text-red-700"
                }`}>{l.status}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppShell>
  )
}
