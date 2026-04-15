import { Link } from "react-router-dom"
import { AppShell, StatCard } from "@/components/layout/AppShell"
import { Button } from "@/components/ui/button"
import { PLATFORM_STATS, formatUGX } from "@/lib/data"
import { Users, ShoppingBag, CheckSquare, ListChecks, TrendingUp, DollarSign, Clock, AlertCircle } from "lucide-react"
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, PieChart, Pie, Cell, Legend } from "recharts"

const WEEKLY_ORDERS = [
  { week: "W1 Mar", orders: 58 }, { week: "W2 Mar", orders: 72 }, { week: "W3 Mar", orders: 65 },
  { week: "W4 Mar", orders: 89 }, { week: "W1 Apr", orders: 94 }, { week: "W2 Apr", orders: 110 },
]

const CATEGORY_PIE = [
  { name: "Live Pigs", value: 38, color: "#2D6A2D" },
  { name: "Feed", value: 28, color: "#F59E0B" },
  { name: "Medicines", value: 18, color: "#0EA5E9" },
  { name: "Semen", value: 8, color: "#8B5CF6" },
  { name: "Vets", value: 5, color: "#EC4899" },
  { name: "Pork", value: 3, color: "#F97316" },
]

const RECENT_ACTIVITY = [
  { icon: "👤", text: "Moses Kato registered as a seller", time: "5 min ago", type: "info" },
  { icon: "✅", text: "Listing 'Pig Starter Crumbles' approved", time: "12 min ago", type: "success" },
  { icon: "🛒", text: "New order ORD-428 placed — UGX 263,000", time: "28 min ago", type: "info" },
  { icon: "⚠️", text: "Agnes Tendo's listing requires review", time: "1 hr ago", type: "warning" },
  { icon: "✅", text: "David Ssali seller account approved", time: "2 hr ago", type: "success" },
  { icon: "❌", text: "Listing 'Duroc Gilt 5mo' rejected (quality)", time: "3 hr ago", type: "error" },
]

export default function AdminDashboard() {
  return (
    <AppShell>
      <div className="p-4 lg:p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Platform Overview</h1>
            <p className="text-sm text-gray-500 mt-0.5">P1G Market — Admin Dashboard</p>
          </div>
          <div className="flex gap-2">
            <Link to="/admin/seller-approvals">
              <Button className="bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-sm hidden sm:flex gap-1.5">
                <AlertCircle size={15} /> {PLATFORM_STATS.pendingSellerApprovals} Pending Sellers
              </Button>
            </Link>
          </div>
        </div>

        {/* KPI Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-6">
          <StatCard label="Total Users" value={PLATFORM_STATS.totalUsers.toLocaleString()} icon={Users} color="blue" />
          <StatCard label="Active Sellers" value={PLATFORM_STATS.sellers} icon={ShoppingBag} color="green" />
          <StatCard label="Seller Approvals" value={PLATFORM_STATS.pendingSellerApprovals} icon={CheckSquare} color="amber" sub="Pending review" />
          <StatCard label="Pending Listings" value={PLATFORM_STATS.pendingListings} icon={ListChecks} color="amber" sub="Awaiting approval" />
          <StatCard label="Monthly Orders" value={PLATFORM_STATS.ordersThisMonth} icon={TrendingUp} color="green" />
          <StatCard label="Platform GMV" value={formatUGX(PLATFORM_STATS.gmv)} icon={DollarSign} color="green" sub="This month" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-5">
          {/* Orders chart */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
            <h2 className="font-bold text-gray-900 mb-1">Weekly Orders</h2>
            <p className="text-xs text-gray-400 mb-4">Last 6 weeks</p>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={WEEKLY_ORDERS} barSize={28}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="week" tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #e5e7eb", fontSize: 12 }} />
                <Bar dataKey="orders" fill="#2D6A2D" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Category pie */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
            <h2 className="font-bold text-gray-900 mb-1">Sales by Category</h2>
            <p className="text-xs text-gray-400 mb-2">% of total orders</p>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={CATEGORY_PIE} dataKey="value" cx="50%" cy="50%" outerRadius={70} innerRadius={40}>
                  {CATEGORY_PIE.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: 10, fontSize: 11 }} />
                <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Recent activity */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
            <h2 className="font-bold text-gray-900 mb-4">Recent Activity</h2>
            <div className="space-y-3">
              {RECENT_ACTIVITY.map((a, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-gray-50 flex items-center justify-center text-sm shrink-0">{a.icon}</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-700 leading-snug">{a.text}</p>
                    <p className="text-xs text-gray-400 mt-0.5 flex items-center gap-1"><Clock size={10} />{a.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick actions */}
          <div className="space-y-3">
            <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
              <h3 className="font-bold text-gray-900 text-sm mb-3">Quick Actions</h3>
              <div className="space-y-2">
                <Link to="/admin/seller-approvals">
                  <Button className="w-full justify-start bg-amber-500 hover:bg-amber-600 text-white rounded-xl h-10 text-sm gap-2">
                    <CheckSquare size={15} /> Review {PLATFORM_STATS.pendingSellerApprovals} Sellers
                  </Button>
                </Link>
                <Link to="/admin/listing-approvals">
                  <Button className="w-full justify-start bg-green-700 hover:bg-green-800 text-white rounded-xl h-10 text-sm gap-2">
                    <ListChecks size={15} /> Review {PLATFORM_STATS.pendingListings} Listings
                  </Button>
                </Link>
                <Link to="/admin/users">
                  <Button variant="outline" className="w-full justify-start rounded-xl h-10 text-sm gap-2 border-gray-200">
                    <Users size={15} /> Manage Users
                  </Button>
                </Link>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
              <h3 className="font-bold text-gray-900 text-sm mb-3">User Breakdown</h3>
              {[
                { label: "Buyers", count: PLATFORM_STATS.buyers, color: "bg-blue-500" },
                { label: "Sellers", count: PLATFORM_STATS.sellers, color: "bg-green-500" },
                { label: "Pending", count: PLATFORM_STATS.pendingSellerApprovals, color: "bg-amber-500" },
              ].map(s => (
                <div key={s.label} className="flex items-center justify-between py-1.5">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <div className={`w-2 h-2 rounded-full ${s.color}`} />
                    {s.label}
                  </div>
                  <span className="text-sm font-bold text-gray-900">{s.count.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  )
}
