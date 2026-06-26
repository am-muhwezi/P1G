import { useState, useEffect } from "react"
import { api } from "../../lib/api"
import { TrendingUp, DollarSign, ShoppingCart, Package, BarChart3 } from "lucide-react"

interface AnalyticsData {
  revenue: number
  pendingRevenue: number
  totalOrders: number
  ordersBreakdown: Record<string, number>
  totalUsers: number
  buyerCount: number
  sellerCount: number
  totalListings: number
  activeListings: number
  weeklyRevenue: { date: string; revenue: number }[]
  conversionRate: number
}

export function AdminAnalytics() {
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get("/api/admin/analytics").then(setData).catch(() => setData(null)).finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    )
  }

  if (!data) {
    return <p className="text-on-surface-variant dark:text-outline-variant">Failed to load analytics.</p>
  }

  const formatUGX = (n: number) => `UGX ${n.toLocaleString("en-UG")}`

  const orderLabels: Record<string, string> = {
    pending: "Pending",
    confirmed: "Confirmed",
    in_transit: "In Transit",
    delivered: "Delivered",
    cancelled: "Cancelled",
  }

  const orderColors: Record<string, string> = {
    pending: "bg-amber-500",
    confirmed: "bg-blue-500",
    in_transit: "bg-purple-500",
    delivered: "bg-emerald-500",
    cancelled: "bg-red-500",
  }

  const weeklyRevenue: { date: string; revenue: number }[] = data.weeklyRevenue || []
  const ordersBreakdown: Record<string, number> = data.ordersBreakdown || {}
  const maxOrderCount = Math.max(...Object.values(ordersBreakdown), 1)

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-headline-lg text-headline-lg text-on-surface dark:text-primary-fixed">Analytics</h1>
        <p className="text-on-surface-variant font-body-md text-body-md dark:text-outline-variant">
          Platform performance and insights
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-surface-container-lowest rounded-xl p-5 shadow-sm border border-surface-container-high dark:bg-surface-dim dark:border-surface-container">
          <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3 dark:bg-emerald-900/20 dark:text-emerald-400">
            <DollarSign size={24} />
          </div>
          <p className="font-headline-md text-headline-md text-on-surface dark:text-primary-fixed">{formatUGX(data.revenue)}</p>
          <p className="text-label-sm text-on-surface-variant dark:text-outline-variant">Revenue (Delivered)</p>
        </div>
        <div className="bg-surface-container-lowest rounded-xl p-5 shadow-sm border border-surface-container-high dark:bg-surface-dim dark:border-surface-container">
          <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center mb-3 dark:bg-amber-900/20 dark:text-amber-400">
            <TrendingUp size={24} />
          </div>
          <p className="font-headline-md text-headline-md text-on-surface dark:text-primary-fixed">{formatUGX(data.pendingRevenue)}</p>
          <p className="text-label-sm text-on-surface-variant dark:text-outline-variant">Pending Revenue</p>
        </div>
        <div className="bg-surface-container-lowest rounded-xl p-5 shadow-sm border border-surface-container-high dark:bg-surface-dim dark:border-surface-container">
          <div className="w-10 h-10 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center mb-3 dark:bg-sky-900/20 dark:text-sky-400">
            <ShoppingCart size={24} />
          </div>
          <p className="font-headline-md text-headline-md text-on-surface dark:text-primary-fixed">{data.totalOrders}</p>
          <p className="text-label-sm text-on-surface-variant dark:text-outline-variant">Total Orders</p>
        </div>
        <div className="bg-surface-container-lowest rounded-xl p-5 shadow-sm border border-surface-container-high dark:bg-surface-dim dark:border-surface-container">
          <div className="w-10 h-10 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center mb-3 dark:bg-purple-900/20 dark:text-purple-400">
            <BarChart3 size={24} />
          </div>
          <p className="font-headline-md text-headline-md text-on-surface dark:text-primary-fixed">{data.conversionRate}%</p>
          <p className="text-label-sm text-on-surface-variant dark:text-outline-variant">Conversion Rate</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-surface-container-lowest rounded-xl p-5 shadow-sm border border-surface-container-high dark:bg-surface-dim dark:border-surface-container">
          <h2 className="font-headline-sm text-headline-sm text-on-surface dark:text-primary-fixed mb-4">Order Breakdown</h2>
          <div className="space-y-3">
            {Object.entries(ordersBreakdown).map(([key, count]) => (
              <div key={key}>
                <div className="flex justify-between mb-1">
                  <span className="font-label-sm text-label-sm text-on-surface dark:text-primary-fixed capitalize">
                    {orderLabels[key] || key}
                  </span>
                  <span className="font-label-sm text-label-sm text-on-surface-variant dark:text-outline-variant">{count}</span>
                </div>
                <div className="h-2 bg-surface-container-high rounded-full dark:bg-surface-container">
                  <div
                    className={`h-2 rounded-full transition-all ${orderColors[key] || "bg-gray-500"}`}
                    style={{ width: `${(count / maxOrderCount) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-surface-container-lowest rounded-xl p-5 shadow-sm border border-surface-container-high dark:bg-surface-dim dark:border-surface-container">
          <h2 className="font-headline-sm text-headline-sm text-on-surface dark:text-primary-fixed mb-4">Platform Overview</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 rounded-lg bg-surface-container/50 dark:bg-surface-container/20">
              <p className="font-label-sm text-label-sm text-on-surface-variant dark:text-outline-variant mb-1">Total Users</p>
              <p className="font-headline-md text-headline-md text-on-surface dark:text-primary-fixed">{data.totalUsers}</p>
              <div className="flex gap-3 mt-1">
                <span className="text-label-sm text-on-surface-variant dark:text-outline-variant">{data.buyerCount} buyers</span>
                <span className="text-label-sm text-on-surface-variant dark:text-outline-variant">{data.sellerCount} sellers</span>
              </div>
            </div>
            <div className="p-3 rounded-lg bg-surface-container/50 dark:bg-surface-container/20">
              <p className="font-label-sm text-label-sm text-on-surface-variant dark:text-outline-variant mb-1">Listings</p>
              <div className="flex items-center gap-2">
                <Package size={18} className="text-outline dark:text-outline-variant" />
                <p className="font-headline-md text-headline-md text-on-surface dark:text-primary-fixed">{data.totalListings}</p>
              </div>
              <p className="text-label-sm text-on-surface-variant dark:text-outline-variant">{data.activeListings} active</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-surface-container-lowest rounded-xl p-5 shadow-sm border border-surface-container-high dark:bg-surface-dim dark:border-surface-container">
        <h2 className="font-headline-sm text-headline-sm text-on-surface dark:text-primary-fixed mb-4">Weekly Revenue (Last 7 Days)</h2>
        <div className="space-y-2">
          {weeklyRevenue.length === 0 ? (
            <p className="text-on-surface-variant dark:text-outline-variant text-label-sm">No data yet.</p>
          ) : (
            weeklyRevenue.map((day) => {
              const maxRev = Math.max(...weeklyRevenue.map((d) => d.revenue), 1)
              return (
                <div key={day.date}>
                  <div className="flex justify-between mb-1">
                    <span className="font-label-sm text-label-sm text-on-surface dark:text-primary-fixed">
                      {new Date(day.date + "T00:00:00").toLocaleDateString("en-UG", { weekday: "short", month: "short", day: "numeric" })}
                    </span>
                    <span className="font-label-sm text-label-sm text-on-surface-variant dark:text-outline-variant">{formatUGX(day.revenue)}</span>
                  </div>
                  <div className="h-3 bg-surface-container-high rounded-full dark:bg-surface-container">
                    <div
                      className="h-3 rounded-full bg-primary transition-all"
                      style={{ width: `${(day.revenue / maxRev) * 100}%` }}
                    />
                  </div>
                </div>
              )
            })
          )}
        </div>
      </div>
    </div>
  )
}
