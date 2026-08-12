import { useEffect, useState } from "react"
import { api } from "../../lib/api"
import { formatUGX, formatDate, formatOrderId, type Listing, type Order } from "../../lib/data"
import { Package, ShoppingCart, Eye, TrendingUp, ArrowUp, AlertCircle } from "lucide-react"

const statusColor: Record<string, string> = {
  active: "text-emerald-600 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-900/20",
  pending: "text-amber-600 bg-amber-50 dark:text-amber-400 dark:bg-amber-900/20",
  confirmed: "text-sky-600 bg-sky-50 dark:text-sky-400 dark:bg-sky-900/20",
  in_transit: "text-purple-600 bg-purple-50 dark:text-purple-400 dark:bg-purple-900/20",
  delivered: "text-emerald-600 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-900/20",
  cancelled: "text-gray-500 bg-gray-50 dark:text-gray-400 dark:bg-gray-900/20",
}

function StatusPill({ status }: { status: string }) {
  return (
    <span className={`inline-block px-3 py-1 rounded-full text-label-sm font-label-sm capitalize ${statusColor[status] || "text-gray-500 bg-gray-50"}`}>
      {status.replace(/_/g, " ")}
    </span>
  )
}

interface DashboardData {
  totalListings: number
  activeListings: number
  totalViews: number
  revenue: number
  ordersCount: number
  pendingOrders: number
  topListing: Listing | null
  avgRating: number
  reviewedListings: number
  recentListings: Listing[]
  recentOrders: Order[]
  weeklyData: { label: string; orders: number; revenue: number }[]
}

const DEFAULT_DATA: DashboardData = {
  totalListings: 0,
  activeListings: 0,
  totalViews: 0,
  revenue: 0,
  ordersCount: 0,
  pendingOrders: 0,
  topListing: null,
  avgRating: 0,
  reviewedListings: 0,
  recentListings: [],
  recentOrders: [],
  weeklyData: [],
}

export function SellerDashboard() {
  const [data, setData] = useState<DashboardData>(DEFAULT_DATA)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    api.get("/api/seller/dashboard").then(setData).catch(() => setError("Failed to load dashboard.")).finally(() => setLoading(false))
  }, [])

  if (loading) {
    return <div className="flex items-center justify-center h-64 text-on-surface-variant font-body-md dark:text-outline-variant">Loading dashboard...</div>
  }

  const topListing = data.topListing
  const weeklyData = data.weeklyData || []
  const maxRevenue = Math.max(...weeklyData.map((d) => d.revenue), 1)
  const maxOrders = Math.max(...weeklyData.map((d) => d.orders), 1)

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-headline-lg text-headline-lg text-on-surface dark:text-primary-fixed">Dashboard</h1>
        <p className="text-on-surface-variant font-body-md text-body-md dark:text-outline-variant">
          Welcome back
        </p>
      </div>

      {error && (
        <div className="flex items-center gap-3 p-4 mb-6 rounded-xl bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400 border border-red-200 dark:border-red-900/30">
          <AlertCircle size={20} />
          <span className="font-label-sm text-label-sm">{error}</span>
        </div>
      )}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard icon={<Package size={24} />} label="Total Listings" value={data.totalListings} sub={`${data.activeListings} active`} color="green" />
        <StatCard icon={<Eye size={24} />} label="Total Views" value={data.totalViews} sub="This month" color="blue" />
        <StatCard icon={<ShoppingCart size={24} />} label="Orders Received" value={data.ordersCount} sub={`${data.pendingOrders} pending`} color="amber" />
        <StatCard icon={<TrendingUp size={24} />} label="Revenue" value={formatUGX(data.revenue)} sub="All time" color="green" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="bg-surface-container-lowest rounded-xl p-6 shadow-sm border border-surface-container-high dark:bg-surface-dim dark:border-surface-container lg:col-span-2">
          <h2 className="font-headline-md text-headline-md text-on-surface mb-6 dark:text-primary-fixed">This Week</h2>
          <div className="flex items-end justify-between gap-3 h-36">
            {weeklyData.map((day) => (
              <div key={day.label} className="flex-1 flex flex-col items-center gap-1">
                <span className="text-label-sm text-on-surface-variant dark:text-outline-variant">
                  {day.revenue > 0 ? `${(day.revenue / 1000).toFixed(0)}k` : ""}
                </span>
                <div className="w-full flex flex-col items-center gap-0.5 flex-1 justify-end">
                  <div
                    className="w-3 rounded-t-sm bg-amber-400 dark:bg-amber-500 transition-all"
                    style={{ height: `${Math.max((day.orders / maxOrders) * 100, day.orders > 0 ? 20 : 0)}%` }}
                  />
                  <div
                    className="w-full rounded-t-sm bg-[#002114] dark:bg-primary-fixed transition-all"
                    style={{ height: `${Math.max((day.revenue / maxRevenue) * 100, day.revenue > 0 ? 10 : 0)}%` }}
                  />
                </div>
                <span className="text-label-sm text-on-surface-variant dark:text-outline-variant mt-1">{day.label}</span>
              </div>
            ))}
            {weeklyData.length === 0 && (
              <div className="w-full text-center text-on-surface-variant dark:text-outline-variant text-label-sm">No data yet</div>
            )}
          </div>
          <div className="flex items-center gap-4 mt-4 pt-4 border-t border-outline-variant/20 dark:border-surface-container">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-sm bg-[#002114] dark:bg-primary-fixed" />
              <span className="text-label-sm text-on-surface-variant dark:text-outline-variant">Revenue</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-sm bg-amber-400 dark:bg-amber-500" />
              <span className="text-label-sm text-on-surface-variant dark:text-outline-variant">Orders</span>
            </div>
          </div>
        </div>

        <div className="bg-surface-container-lowest rounded-xl p-6 shadow-sm border border-surface-container-high dark:bg-surface-dim dark:border-surface-container">
          <h2 className="font-headline-md text-headline-md text-on-surface mb-4 dark:text-primary-fixed">Quick Overview</h2>
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-surface-container/50 dark:bg-surface-container">
              <div className="flex items-center justify-between mb-1">
                <span className="text-label-sm text-on-surface-variant dark:text-outline-variant">Top Listing</span>
                <ArrowUp size={16} className="text-emerald-500" />
              </div>
              <p className="font-label-lg text-label-lg text-on-surface dark:text-primary-fixed truncate">{topListing?.title || "--"}</p>
              <p className="text-label-sm text-on-surface-variant dark:text-outline-variant">{topListing?.views || 0} views</p>
            </div>
            <div className="p-4 rounded-xl bg-surface-container/50 dark:bg-surface-container">
              <div className="flex items-center justify-between mb-1">
                <span className="text-label-sm text-on-surface-variant dark:text-outline-variant">Avg. Rating</span>
                <span className="text-label-sm text-amber-500">&#9733; {data.avgRating.toFixed(1)}</span>
              </div>
              <p className="font-label-lg text-label-lg text-on-surface dark:text-primary-fixed">{data.reviewedListings}</p>
              <p className="text-label-sm text-on-surface-variant dark:text-outline-variant">Reviewed listings</p>
            </div>
            <div className="p-4 rounded-xl bg-surface-container/50 dark:bg-surface-container">
              <div className="flex items-center justify-between mb-1">
                <span className="text-label-sm text-on-surface-variant dark:text-outline-variant">Orders This Week</span>
                <ArrowUp size={16} className="text-emerald-500" />
              </div>
              <p className="font-label-lg text-label-lg text-on-surface dark:text-primary-fixed">{weeklyData.reduce((s, d) => s + d.orders, 0)}</p>
              <p className="text-label-sm text-on-surface-variant dark:text-outline-variant">{formatUGX(weeklyData.reduce((s, d) => s + d.revenue, 0))}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-surface-container-lowest rounded-xl p-6 shadow-sm border border-surface-container-high dark:bg-surface-dim dark:border-surface-container">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-headline-md text-headline-md text-on-surface dark:text-primary-fixed">Active Listings</h2>
            <span className="text-label-sm text-on-surface-variant dark:text-outline-variant">{data.recentListings.length} items</span>
          </div>
          {data.recentListings.length === 0 ? (
            <p className="text-on-surface-variant font-body-md dark:text-outline-variant">No active listings yet.</p>
          ) : (
            <div className="space-y-3">
              {data.recentListings.slice(0, 5).map((listing) => (
                <div key={listing.id} className="flex items-center justify-between py-2 border-b border-outline-variant/30 last:border-0 dark:border-surface-container">
                  <div className="flex-1 min-w-0">
                    <p className="font-label-lg text-label-lg text-on-surface truncate dark:text-primary-fixed">{listing.title}</p>
                    <p className="text-label-sm text-on-surface-variant dark:text-outline-variant">{listing.views} views &middot; {listing.district}</p>
                  </div>
                  <span className="font-label-lg text-label-lg text-primary dark:text-primary-fixed ml-4">{formatUGX(listing.price)}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-surface-container-lowest rounded-xl p-6 shadow-sm border border-surface-container-high dark:bg-surface-dim dark:border-surface-container">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-headline-md text-headline-md text-on-surface dark:text-primary-fixed">Recent Orders</h2>
            <span className="text-label-sm text-on-surface-variant dark:text-outline-variant">{data.ordersCount} total</span>
          </div>
          {data.recentOrders.length === 0 ? (
            <p className="text-on-surface-variant font-body-md dark:text-outline-variant">No orders yet.</p>
          ) : (
            <div className="space-y-3">
              {data.recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between py-2 border-b border-outline-variant/30 last:border-0 dark:border-surface-container">
                  <div className="flex-1 min-w-0">
                    <p className="font-label-lg text-label-lg text-on-surface truncate dark:text-primary-fixed">{formatOrderId(order.id)}</p>
                    <p className="text-label-sm text-on-surface-variant dark:text-outline-variant">{order.buyerName} &middot; {formatDate(order.createdAt)}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-label-sm text-label-sm text-on-surface-variant dark:text-outline-variant">{formatUGX(order.total)}</span>
                    <StatusPill status={order.status} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function StatCard({ icon, label, value, sub, color }: { icon: React.ReactNode; label: string; value: string | number; sub: string; color: string }) {
  const colorMap: Record<string, string> = {
    green: "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400",
    blue: "bg-sky-50 text-sky-600 dark:bg-sky-900/20 dark:text-sky-400",
    amber: "bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400",
  }
  return (
    <div className="bg-surface-container-lowest rounded-xl p-5 shadow-sm border border-surface-container-high dark:bg-surface-dim dark:border-surface-container">
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${colorMap[color] || colorMap.green}`}>
        {icon}
      </div>
      <p className="font-headline-md text-headline-md text-on-surface dark:text-primary-fixed">{value}</p>
      <p className="text-label-sm text-on-surface-variant dark:text-outline-variant">{label}</p>
      <p className="text-label-sm text-primary dark:text-primary-fixed mt-0.5">{sub}</p>
    </div>
  )
}