import { useState, useEffect } from "react"
import { api } from "../../lib/api"
import { formatUGX, formatDate, formatOrderId } from "../../lib/data"
import { Users, Package, ShoppingCart, TrendingUp } from "lucide-react"

interface DashboardData {
  totalUsers: number
  buyersCount: number
  sellersCount: number
  totalListings: number
  activeListings: number
  pendingListings: number
  totalOrders: number
  pendingOrders: number
  deliveredOrders: number
  revenue: number
  todaySignups: number
  todayOrders: number
  recentOrders: Array<{
    id: string
    buyerName: string
    total: number
    status: string
    createdAt: string
  }>
  recentListings: Array<{
    id: string
    title: string
    sellerName: string
    status: string
    district: string
  }>
}

export function AdminDashboard() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get("/api/admin/dashboard").then(setData).catch(() => setData(null)).finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    )
  }

  const d = data || {
    totalUsers: 0, buyersCount: 0, sellersCount: 0, totalListings: 0,
    activeListings: 0, pendingListings: 0, totalOrders: 0, pendingOrders: 0,
    deliveredOrders: 0, revenue: 0, todaySignups: 0, todayOrders: 0,
    recentOrders: [], recentListings: [],
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-headline-lg text-headline-lg text-on-surface dark:text-primary-fixed">Admin Dashboard</h1>
        <p className="text-on-surface-variant font-body-md text-body-md dark:text-outline-variant">
          Platform overview and moderation
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-surface-container-lowest rounded-xl p-5 shadow-sm border border-surface-container-high dark:bg-surface-dim dark:border-surface-container">
          <div className="w-10 h-10 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center mb-3 dark:bg-sky-900/20 dark:text-sky-400">
            <Users size={24} />
          </div>
          <p className="font-headline-md text-headline-md text-on-surface dark:text-primary-fixed">{d.totalUsers}</p>
          <p className="text-label-sm text-on-surface-variant dark:text-outline-variant">Total Users</p>
          <p className="text-label-sm text-primary dark:text-primary-fixed mt-0.5">{d.buyersCount + d.sellersCount} active</p>
        </div>
        <div className="bg-surface-container-lowest rounded-xl p-5 shadow-sm border border-surface-container-high dark:bg-surface-dim dark:border-surface-container">
          <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3 dark:bg-emerald-900/20 dark:text-emerald-400">
            <Package size={24} />
          </div>
          <p className="font-headline-md text-headline-md text-on-surface dark:text-primary-fixed">{d.totalListings}</p>
          <p className="text-label-sm text-on-surface-variant dark:text-outline-variant">Total Listings</p>
          <p className="text-label-sm text-amber-600 dark:text-amber-400 mt-0.5">{d.pendingListings} pending review</p>
        </div>
        <div className="bg-surface-container-lowest rounded-xl p-5 shadow-sm border border-surface-container-high dark:bg-surface-dim dark:border-surface-container">
          <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center mb-3 dark:bg-amber-900/20 dark:text-amber-400">
            <ShoppingCart size={24} />
          </div>
          <p className="font-headline-md text-headline-md text-on-surface dark:text-primary-fixed">{d.totalOrders}</p>
          <p className="text-label-sm text-on-surface-variant dark:text-outline-variant">Total Orders</p>
          <p className="text-label-sm text-primary dark:text-primary-fixed mt-0.5">{d.pendingOrders} pending</p>
        </div>
        <div className="bg-surface-container-lowest rounded-xl p-5 shadow-sm border border-surface-container-high dark:bg-surface-dim dark:border-surface-container">
          <div className="w-10 h-10 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center mb-3 dark:bg-purple-900/20 dark:text-purple-400">
            <TrendingUp size={24} />
          </div>
          <p className="font-headline-md text-headline-md text-on-surface dark:text-primary-fixed">{formatUGX(d.revenue)}</p>
          <p className="text-label-sm text-on-surface-variant dark:text-outline-variant">Platform Revenue</p>
          <p className="text-label-sm text-emerald-600 dark:text-emerald-400 mt-0.5">Confirmed + Delivered</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-surface-container-lowest rounded-xl p-6 shadow-sm border border-surface-container-high dark:bg-surface-dim dark:border-surface-container">
          <h2 className="font-headline-md text-headline-md text-on-surface mb-4 dark:text-primary-fixed">Recent Orders</h2>
          {d.recentOrders.length === 0 ? (
            <p className="text-on-surface-variant font-body-md dark:text-outline-variant">No orders yet.</p>
          ) : (
            <div className="space-y-3">
              {d.recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between py-2 border-b border-outline-variant/20 last:border-0 dark:border-surface-container">
                  <div className="flex-1 min-w-0">
                    <p className="font-label-lg text-label-lg text-on-surface truncate dark:text-primary-fixed">{formatOrderId(order.id)}</p>
                    <p className="text-label-sm text-on-surface-variant dark:text-outline-variant">{order.buyerName} &middot; {formatDate(order.createdAt)}</p>
                  </div>
                  <span className="font-label-lg text-label-lg text-primary dark:text-primary-fixed">{formatUGX(order.total)}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-surface-container-lowest rounded-xl p-6 shadow-sm border border-surface-container-high dark:bg-surface-dim dark:border-surface-container">
          <h2 className="font-headline-md text-headline-md text-on-surface mb-4 dark:text-primary-fixed">Pending Reviews</h2>
          {d.recentListings.filter(l => l.status === "pending").length === 0 ? (
            <p className="text-on-surface-variant font-body-md dark:text-outline-variant">No listings pending review.</p>
          ) : (
            <div className="space-y-3">
              {d.recentListings.filter(l => l.status === "pending").map((listing) => (
                <div key={listing.id} className="flex items-center justify-between py-2 border-b border-outline-variant/20 last:border-0 dark:border-surface-container">
                  <div className="flex-1 min-w-0">
                    <p className="font-label-lg text-label-lg text-on-surface truncate dark:text-primary-fixed">{listing.title}</p>
                    <p className="text-label-sm text-on-surface-variant dark:text-outline-variant">
                      {listing.sellerName} &middot; {listing.district}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 rounded-full text-label-sm font-label-sm bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400">
                      Pending
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="mt-6 bg-surface-container-lowest rounded-xl p-6 shadow-sm border border-surface-container-high dark:bg-surface-dim dark:border-surface-container">
        <h2 className="font-headline-md text-headline-md text-on-surface mb-4 dark:text-primary-fixed">Quick Stats</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-surface-container/50 dark:bg-surface-container">
            <p className="font-headline-md text-headline-md text-on-surface dark:text-primary-fixed">{d.buyersCount + d.sellersCount}</p>
            <p className="text-label-sm text-on-surface-variant dark:text-outline-variant">Non-Admin Users</p>
          </div>
          <div className="p-4 rounded-xl bg-surface-container/50 dark:bg-surface-container">
            <p className="font-headline-md text-headline-md text-on-surface dark:text-primary-fixed">{d.activeListings}</p>
            <p className="text-label-sm text-on-surface-variant dark:text-outline-variant">Active Listings</p>
          </div>
          <div className="p-4 rounded-xl bg-surface-container/50 dark:bg-surface-container">
            <p className="font-headline-md text-headline-md text-on-surface dark:text-primary-fixed">{d.deliveredOrders}</p>
            <p className="text-label-sm text-on-surface-variant dark:text-outline-variant">Delivered Orders</p>
          </div>
          <div className="p-4 rounded-xl bg-surface-container/50 dark:bg-surface-container">
            <p className="font-headline-md text-headline-md text-on-surface dark:text-primary-fixed">{d.sellersCount}</p>
            <p className="text-label-sm text-on-surface-variant dark:text-outline-variant">Sellers</p>
          </div>
        </div>
      </div>
    </div>
  )
}
