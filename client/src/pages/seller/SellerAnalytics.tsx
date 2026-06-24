import { useAuth } from "../../store/auth"
import { MOCK_ORDERS, MOCK_LISTINGS, formatUGX } from "../../lib/data"
import { TrendingUp, Eye, DollarSign, ArrowUp, ArrowDown } from "lucide-react"

const DEFAULT_SELLER_ID = "seller-1"
const DEFAULT_SELLER_NAME = "Mukasa Farms"

export function SellerAnalytics() {
  const auth = useAuth()
  const sellerId = (auth.userId && auth.userId.startsWith("seller-")) ? auth.userId : DEFAULT_SELLER_ID
  const sellerName = auth.name || DEFAULT_SELLER_NAME
  const rawListings = MOCK_LISTINGS.filter((l) => l.sellerId === sellerId || l.sellerName === sellerName)
  const sellerListings = rawListings.length > 0 ? rawListings : MOCK_LISTINGS.filter((l) => l.sellerId === DEFAULT_SELLER_ID)
  const sellerOrders = MOCK_ORDERS.filter((o) => o.items.some((i) => i.sellerName === sellerName))

  const totalViews = sellerListings.reduce((sum, l) => sum + l.views, 0)
  const revenue = sellerOrders
    .filter((o) => o.status === "delivered" || o.status === "confirmed")
    .reduce((sum, o) => sum + o.total, 0)
  const pendingRevenue = sellerOrders
    .filter((o) => o.status === "pending" || o.status === "in_transit")
    .reduce((sum, o) => sum + o.total, 0)

  const statusBreakdown = {
    pending: sellerOrders.filter((o) => o.status === "pending").length,
    confirmed: sellerOrders.filter((o) => o.status === "confirmed").length,
    in_transit: sellerOrders.filter((o) => o.status === "in_transit").length,
    delivered: sellerOrders.filter((o) => o.status === "delivered").length,
    cancelled: sellerOrders.filter((o) => o.status === "cancelled").length,
  }

  const totalOrders = sellerOrders.length
  const conversionRate = totalOrders > 0
    ? Math.round((statusBreakdown.delivered / totalOrders) * 100)
    : 0

  const barData = [
    { label: "Mon", value: 240000 },
    { label: "Tue", value: 180000 },
    { label: "Wed", value: 320000 },
    { label: "Thu", value: 1450000 },
    { label: "Fri", value: 600000 },
    { label: "Sat", value: 0 },
    { label: "Sun", value: 0 },
  ]

  const maxValue = Math.max(...barData.map((d) => d.value), 1)

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-headline-lg text-headline-lg text-on-surface dark:text-primary-fixed">Analytics</h1>
        <p className="text-on-surface-variant font-body-md text-body-md dark:text-outline-variant">
          Performance metrics for your listings
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-surface-container-lowest rounded-xl p-5 shadow-sm border border-surface-container-high dark:bg-surface-dim dark:border-surface-container">
          <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3 dark:bg-emerald-900/20 dark:text-emerald-400">
            <DollarSign size={24} />
          </div>
          <p className="font-headline-md text-headline-md text-on-surface dark:text-primary-fixed">{formatUGX(revenue)}</p>
          <p className="text-label-sm text-on-surface-variant dark:text-outline-variant">Revenue</p>
        </div>
        <div className="bg-surface-container-lowest rounded-xl p-5 shadow-sm border border-surface-container-high dark:bg-surface-dim dark:border-surface-container">
          <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center mb-3 dark:bg-amber-900/20 dark:text-amber-400">
            <DollarSign size={24} />
          </div>
          <p className="font-headline-md text-headline-md text-on-surface dark:text-primary-fixed">{formatUGX(pendingRevenue)}</p>
          <p className="text-label-sm text-on-surface-variant dark:text-outline-variant">Pending Payouts</p>
        </div>
        <div className="bg-surface-container-lowest rounded-xl p-5 shadow-sm border border-surface-container-high dark:bg-surface-dim dark:border-surface-container">
          <div className="w-10 h-10 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center mb-3 dark:bg-sky-900/20 dark:text-sky-400">
            <Eye size={24} />
          </div>
          <p className="font-headline-md text-headline-md text-on-surface dark:text-primary-fixed">{totalViews}</p>
          <p className="text-label-sm text-on-surface-variant dark:text-outline-variant">Total Views</p>
        </div>
        <div className="bg-surface-container-lowest rounded-xl p-5 shadow-sm border border-surface-container-high dark:bg-surface-dim dark:border-surface-container">
          <div className="w-10 h-10 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center mb-3 dark:bg-purple-900/20 dark:text-purple-400">
            <TrendingUp size={24} />
          </div>
          <p className="font-headline-md text-headline-md text-on-surface dark:text-primary-fixed">{conversionRate}%</p>
          <p className="text-label-sm text-on-surface-variant dark:text-outline-variant">Conversion Rate</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-surface-container-lowest rounded-xl p-6 shadow-sm border border-surface-container-high dark:bg-surface-dim dark:border-surface-container">
          <h2 className="font-headline-md text-headline-md text-on-surface mb-6 dark:text-primary-fixed">This Week Revenue</h2>
          <div className="flex items-end justify-between gap-2 h-40">
            {barData.map((day) => (
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
          </div>
        </div>

        <div className="bg-surface-container-lowest rounded-xl p-6 shadow-sm border border-surface-container-high dark:bg-surface-dim dark:border-surface-container">
          <h2 className="font-headline-md text-headline-md text-on-surface mb-6 dark:text-primary-fixed">Order Status</h2>
          <div className="space-y-4">
            <StatusRow label="Pending" count={statusBreakdown.pending} total={totalOrders} color="bg-amber-500" />
            <StatusRow label="Confirmed" count={statusBreakdown.confirmed} total={totalOrders} color="bg-sky-500" />
            <StatusRow label="In Transit" count={statusBreakdown.in_transit} total={totalOrders} color="bg-purple-500" />
            <StatusRow label="Delivered" count={statusBreakdown.delivered} total={totalOrders} color="bg-emerald-500" />
            <StatusRow label="Cancelled" count={statusBreakdown.cancelled} total={totalOrders} color="bg-gray-400" />
          </div>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-surface-container-lowest rounded-xl p-6 shadow-sm border border-surface-container-high dark:bg-surface-dim dark:border-surface-container">
          <h2 className="font-headline-md text-headline-md text-on-surface mb-4 dark:text-primary-fixed">Listings Performance</h2>
          <div className="space-y-3">
            {sellerListings.slice(0, 5).map((listing) => (
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
            ))}
          </div>
        </div>

        <div className="bg-surface-container-lowest rounded-xl p-6 shadow-sm border border-surface-container-high dark:bg-surface-dim dark:border-surface-container">
          <h2 className="font-headline-md text-headline-md text-on-surface mb-4 dark:text-primary-fixed">Quick Stats</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-surface-container/50 dark:bg-surface-container">
              <p className="font-headline-md text-headline-md text-on-surface dark:text-primary-fixed">{sellerListings.length}</p>
              <p className="text-label-sm text-on-surface-variant dark:text-outline-variant">Active Listings</p>
            </div>
            <div className="p-4 rounded-xl bg-surface-container/50 dark:bg-surface-container">
              <p className="font-headline-md text-headline-md text-on-surface dark:text-primary-fixed">{totalOrders}</p>
              <p className="text-label-sm text-on-surface-variant dark:text-outline-variant">Total Orders</p>
            </div>
            <div className="p-4 rounded-xl bg-surface-container/50 dark:bg-surface-container">
              <p className="font-headline-md text-headline-md text-on-surface dark:text-primary-fixed">
                {sellerListings.filter((l) => l.rating > 0).length > 0
                  ? (sellerListings.reduce((s, l) => s + l.rating, 0) / sellerListings.filter((l) => l.rating > 0).length).toFixed(1)
                  : "--"}
              </p>
              <p className="text-label-sm text-on-surface-variant dark:text-outline-variant">Avg. Rating</p>
            </div>
            <div className="p-4 rounded-xl bg-surface-container/50 dark:bg-surface-container">
              <p className="font-headline-md text-headline-md text-on-surface dark:text-primary-fixed">
                {sellerOrders.reduce((s, o) => s + o.items.length, 0)}
              </p>
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
