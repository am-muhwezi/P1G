import { useState, useEffect } from "react"
import { api } from "../../lib/api"
import { formatUGX, type Listing } from "../../lib/data"
import { TrendingUp, Eye, DollarSign, ArrowUp, ArrowDown, AlertCircle } from "lucide-react"

interface AnalyticsData {
  revenue: number
  pendingRevenue: number
  totalViews: number
  conversionRate: number
  statusBreakdown: { pending: number; confirmed: number; in_transit: number; delivered: number; cancelled: number }
  topListings: Listing[]
  activeListingsCount: number
  totalOrders: number
  avgRating: number
  unitsSold: number
  weeklyRevenue: { label: string; value: number }[]
}

const DEFAULT_DATA: AnalyticsData = {
  revenue: 0,
  pendingRevenue: 0,
  totalViews: 0,
  conversionRate: 0,
  statusBreakdown: { pending: 0, confirmed: 0, in_transit: 0, delivered: 0, cancelled: 0 },
  topListings: [],
  activeListingsCount: 0,
  totalOrders: 0,
  avgRating: 0,
  unitsSold: 0,
  weeklyRevenue: [],
}

export function SellerAnalytics() {
  const [data, setData] = useState<AnalyticsData>(DEFAULT_DATA)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    api.get("/api/seller/analytics").then(setData).catch(() => setError("Failed to load analytics.")).finally(() => setLoading(false))
  }, [])

  if (loading) {
    return <div className="flex items-center justify-center h-64 text-on-surface-variant font-body-md dark:text-outline-variant">Loading analytics...</div>
  }

  const weeklyRevenue = data.weeklyRevenue || []
  const maxValue = Math.max(...weeklyRevenue.map((d) => d.value), 1)
  const sb = data.statusBreakdown || {}

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-headline-lg text-headline-lg text-on-surface dark:text-primary-fixed">Analytics</h1>
        <p className="text-on-surface-variant font-body-md text-body-md dark:text-outline-variant">
          Performance metrics for your listings
        </p>
      </div>

      {error && (
        <div className="flex items-center gap-3 p-4 mb-6 rounded-xl bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400 border border-red-200 dark:border-red-900/30">
          <AlertCircle size={20} />
          <span className="font-label-sm text-label-sm">{error}</span>
        </div>
      )}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-surface-container-lowest rounded-xl p-5 shadow-sm border border-surface-container-high dark:bg-surface-dim dark:border-surface-container">
          <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3 dark:bg-emerald-900/20 dark:text-emerald-400">
            <DollarSign size={24} />
          </div>
          <p className="font-headline-md text-headline-md text-on-surface dark:text-primary-fixed">{formatUGX(data.revenue)}</p>
          <p className="text-label-sm text-on-surface-variant dark:text-outline-variant">Revenue</p>
        </div>
        <div className="bg-surface-container-lowest rounded-xl p-5 shadow-sm border border-surface-container-high dark:bg-surface-dim dark:border-surface-container">
          <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center mb-3 dark:bg-amber-900/20 dark:text-amber-400">
            <DollarSign size={24} />
          </div>
          <p className="font-headline-md text-headline-md text-on-surface dark:text-primary-fixed">{formatUGX(data.pendingRevenue)}</p>
          <p className="text-label-sm text-on-surface-variant dark:text-outline-variant">Pending Payouts</p>
        </div>
        <div className="bg-surface-container-lowest rounded-xl p-5 shadow-sm border border-surface-container-high dark:bg-surface-dim dark:border-surface-container">
          <div className="w-10 h-10 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center mb-3 dark:bg-sky-900/20 dark:text-sky-400">
            <Eye size={24} />
          </div>
          <p className="font-headline-md text-headline-md text-on-surface dark:text-primary-fixed">{data.totalViews}</p>
          <p className="text-label-sm text-on-surface-variant dark:text-outline-variant">Total Views</p>
        </div>
        <div className="bg-surface-container-lowest rounded-xl p-5 shadow-sm border border-surface-container-high dark:bg-surface-dim dark:border-surface-container">
          <div className="w-10 h-10 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center mb-3 dark:bg-purple-900/20 dark:text-purple-400">
            <TrendingUp size={24} />
          </div>
          <p className="font-headline-md text-headline-md text-on-surface dark:text-primary-fixed">{data.conversionRate}%</p>
          <p className="text-label-sm text-on-surface-variant dark:text-outline-variant">Conversion Rate</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-surface-container-lowest rounded-xl p-6 shadow-sm border border-surface-container-high dark:bg-surface-dim dark:border-surface-container">
          <h2 className="font-headline-md text-headline-md text-on-surface mb-6 dark:text-primary-fixed">This Week Revenue</h2>
          <div className="flex items-end justify-between gap-2 h-40">
            {weeklyRevenue.map((day) => (
              <div key={day.label} className="flex-1 flex flex-col items-center gap-1">
                <span className="text-label-sm text-on-surface-variant dark:text-outline-variant">
                  {day.value > 0 ? formatUGX(day.value).replace("UGX ", "").replace(/000$/, "k") : ""}
                </span>
                <div
                  className="w-full rounded-t-lg bg-[#002114] dark:bg-primary-fixed transition-all"
                  style={{ height: `${Math.max((day.value / maxValue) * 100, day.value > 0 ? 4 : 0)}%` }}
                />
                <span className="text-label-sm text-on-surface-variant dark:text-outline-variant">{day.label}</span>
              </div>
            ))}
            {weeklyRevenue.length === 0 && (
              <div className="w-full text-center text-on-surface-variant dark:text-outline-variant text-label-sm">No data yet</div>
            )}
          </div>
        </div>

        <div className="bg-surface-container-lowest rounded-xl p-6 shadow-sm border border-surface-container-high dark:bg-surface-dim dark:border-surface-container">
          <h2 className="font-headline-md text-headline-md text-on-surface mb-6 dark:text-primary-fixed">Order Status</h2>
          <div className="space-y-4">
            <StatusRow label="Pending" count={sb.pending} total={data.totalOrders} color="bg-amber-500" />
            <StatusRow label="Confirmed" count={sb.confirmed} total={data.totalOrders} color="bg-sky-500" />
            <StatusRow label="In Transit" count={sb.in_transit} total={data.totalOrders} color="bg-purple-500" />
            <StatusRow label="Delivered" count={sb.delivered} total={data.totalOrders} color="bg-emerald-500" />
            <StatusRow label="Cancelled" count={sb.cancelled} total={data.totalOrders} color="bg-gray-400" />
          </div>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-surface-container-lowest rounded-xl p-6 shadow-sm border border-surface-container-high dark:bg-surface-dim dark:border-surface-container">
          <h2 className="font-headline-md text-headline-md text-on-surface mb-4 dark:text-primary-fixed">Listings Performance</h2>
          <div className="space-y-3">
            {data.topListings.length === 0 ? (
              <p className="text-on-surface-variant dark:text-outline-variant text-label-sm">No listing data yet.</p>
            ) : (
              data.topListings.map((listing) => (
                <div key={listing.id} className="flex items-center justify-between py-2 border-b border-outline-variant/20 last:border-0 dark:border-surface-container">
                  <div className="flex-1 min-w-0">
                    <p className="font-label-lg text-label-lg text-on-surface truncate dark:text-primary-fixed">{listing.title}</p>
                    <p className="text-label-sm text-on-surface-variant dark:text-outline-variant">{listing.views} views</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-label-sm text-on-surface-variant dark:text-outline-variant">{formatUGX(listing.price)}</span>
                    <div className={`flex items-center gap-1 text-label-sm ${listing.views > 200 ? "text-emerald-600" : "text-amber-600"}`}>
                      {listing.views > 200 ? <ArrowUp size={14} /> : <ArrowDown size={14} />}
                      {listing.views > 200 ? "High" : "Low"}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="bg-surface-container-lowest rounded-xl p-6 shadow-sm border border-surface-container-high dark:bg-surface-dim dark:border-surface-container">
          <h2 className="font-headline-md text-headline-md text-on-surface mb-4 dark:text-primary-fixed">Quick Stats</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-surface-container/50 dark:bg-surface-container">
              <p className="font-headline-md text-headline-md text-on-surface dark:text-primary-fixed">{data.activeListingsCount}</p>
              <p className="text-label-sm text-on-surface-variant dark:text-outline-variant">Active Listings</p>
            </div>
            <div className="p-4 rounded-xl bg-surface-container/50 dark:bg-surface-container">
              <p className="font-headline-md text-headline-md text-on-surface dark:text-primary-fixed">{data.totalOrders}</p>
              <p className="text-label-sm text-on-surface-variant dark:text-outline-variant">Total Orders</p>
            </div>
            <div className="p-4 rounded-xl bg-surface-container/50 dark:bg-surface-container">
              <p className="font-headline-md text-headline-md text-on-surface dark:text-primary-fixed">
                {data.avgRating > 0 ? data.avgRating.toFixed(1) : "--"}
              </p>
              <p className="text-label-sm text-on-surface-variant dark:text-outline-variant">Avg. Rating</p>
            </div>
            <div className="p-4 rounded-xl bg-surface-container/50 dark:bg-surface-container">
              <p className="font-headline-md text-headline-md text-on-surface dark:text-primary-fixed">{data.unitsSold}</p>
              <p className="text-label-sm text-on-surface-variant dark:text-outline-variant">Units Sold</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function StatusRow({ label, count, total, color }: { label: string; count: number; total: number; color: string }) {
  const pct = total > 0 ? (count / total) * 100 : 0
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <span className="font-label-sm text-label-sm text-on-surface dark:text-primary-fixed">{label}</span>
        <span className="text-label-sm text-on-surface-variant dark:text-outline-variant">{count}</span>
      </div>
      <div className="w-full h-2 rounded-full bg-surface-container dark:bg-surface-container-highest">
        <div className={`h-2 rounded-full ${color} transition-all`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  )
}