import { MOCK_USERS, MOCK_LISTINGS, MOCK_ORDERS, formatUGX, formatDate } from "../../lib/data"
import { Users, Package, ShoppingCart, TrendingUp } from "lucide-react"

export function AdminDashboard() {
  const totalUsers = MOCK_USERS.length
  const activeUsers = MOCK_USERS.filter((u) => u.status === "active").length
  const totalListings = MOCK_LISTINGS.length
  const pendingListings = MOCK_LISTINGS.filter((l) => l.status === "pending").length
  const totalOrders = MOCK_ORDERS.length
  const revenue = MOCK_ORDERS
    .filter((o) => o.status === "delivered" || o.status === "confirmed")
    .reduce((s, o) => s + o.total, 0)
  const pendingOrders = MOCK_ORDERS.filter((o) => o.status === "pending").length

  const recentOrders = [...MOCK_ORDERS].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  ).slice(0, 5)

  const pendingListingsData = MOCK_LISTINGS.filter((l) => l.status === "pending")

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
          <p className="font-headline-md text-headline-md text-on-surface dark:text-primary-fixed">{totalUsers}</p>
          <p className="text-label-sm text-on-surface-variant dark:text-outline-variant">Total Users</p>
          <p className="text-label-sm text-primary dark:text-primary-fixed mt-0.5">{activeUsers} active</p>
        </div>
        <div className="bg-surface-container-lowest rounded-xl p-5 shadow-sm border border-surface-container-high dark:bg-surface-dim dark:border-surface-container">
          <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3 dark:bg-emerald-900/20 dark:text-emerald-400">
            <Package size={24} />
          </div>
          <p className="font-headline-md text-headline-md text-on-surface dark:text-primary-fixed">{totalListings}</p>
          <p className="text-label-sm text-on-surface-variant dark:text-outline-variant">Total Listings</p>
          <p className="text-label-sm text-amber-600 dark:text-amber-400 mt-0.5">{pendingListings} pending review</p>
        </div>
        <div className="bg-surface-container-lowest rounded-xl p-5 shadow-sm border border-surface-container-high dark:bg-surface-dim dark:border-surface-container">
          <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center mb-3 dark:bg-amber-900/20 dark:text-amber-400">
            <ShoppingCart size={24} />
          </div>
          <p className="font-headline-md text-headline-md text-on-surface dark:text-primary-fixed">{totalOrders}</p>
          <p className="text-label-sm text-on-surface-variant dark:text-outline-variant">Total Orders</p>
          <p className="text-label-sm text-primary dark:text-primary-fixed mt-0.5">{pendingOrders} pending</p>
        </div>
        <div className="bg-surface-container-lowest rounded-xl p-5 shadow-sm border border-surface-container-high dark:bg-surface-dim dark:border-surface-container">
          <div className="w-10 h-10 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center mb-3 dark:bg-purple-900/20 dark:text-purple-400">
            <TrendingUp size={24} />
          </div>
          <p className="font-headline-md text-headline-md text-on-surface dark:text-primary-fixed">{formatUGX(revenue)}</p>
          <p className="text-label-sm text-on-surface-variant dark:text-outline-variant">Platform Revenue</p>
          <p className="text-label-sm text-emerald-600 dark:text-emerald-400 mt-0.5">Confirmed + Delivered</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-surface-container-lowest rounded-xl p-6 shadow-sm border border-surface-container-high dark:bg-surface-dim dark:border-surface-container">
          <h2 className="font-headline-md text-headline-md text-on-surface mb-4 dark:text-primary-fixed">Recent Orders</h2>
          {recentOrders.length === 0 ? (
            <p className="text-on-surface-variant font-body-md dark:text-outline-variant">No orders yet.</p>
          ) : (
            <div className="space-y-3">
              {recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between py-2 border-b border-outline-variant/20 last:border-0 dark:border-surface-container">
                  <div className="flex-1 min-w-0">
                    <p className="font-label-lg text-label-lg text-on-surface truncate dark:text-primary-fixed">{order.id}</p>
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
          {pendingListingsData.length === 0 ? (
            <p className="text-on-surface-variant font-body-md dark:text-outline-variant">No listings pending review.</p>
          ) : (
            <div className="space-y-3">
              {pendingListingsData.map((listing) => (
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
            <p className="font-headline-md text-headline-md text-on-surface dark:text-primary-fixed">{activeUsers}</p>
            <p className="text-label-sm text-on-surface-variant dark:text-outline-variant">Active Users</p>
          </div>
          <div className="p-4 rounded-xl bg-surface-container/50 dark:bg-surface-container">
            <p className="font-headline-md text-headline-md text-on-surface dark:text-primary-fixed">{MOCK_LISTINGS.filter(l => l.status === "active").length}</p>
            <p className="text-label-sm text-on-surface-variant dark:text-outline-variant">Active Listings</p>
          </div>
          <div className="p-4 rounded-xl bg-surface-container/50 dark:bg-surface-container">
            <p className="font-headline-md text-headline-md text-on-surface dark:text-primary-fixed">{MOCK_ORDERS.filter(o => o.status === "delivered").length}</p>
            <p className="text-label-sm text-on-surface-variant dark:text-outline-variant">Delivered Orders</p>
          </div>
          <div className="p-4 rounded-xl bg-surface-container/50 dark:bg-surface-container">
            <p className="font-headline-md text-headline-md text-on-surface dark:text-primary-fixed">{MOCK_USERS.filter(u => u.role === "seller").length}</p>
            <p className="text-label-sm text-on-surface-variant dark:text-outline-variant">Sellers</p>
          </div>
        </div>
      </div>
    </div>
  )
}
