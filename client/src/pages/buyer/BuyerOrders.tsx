import { useState, useEffect } from "react"
import { api } from "../../lib/api"
import { formatUGX, formatDate, formatOrderId, type Order } from "../../lib/data"
import { Package, ShoppingCart, Clock, CheckCircle, Calendar, MapPin, AlertCircle } from "lucide-react"
import { Link } from "react-router-dom"

const STEPS = ["pending", "confirmed", "in_transit", "delivered"]

const statusColor: Record<string, string> = {
  pending: "text-amber-600 bg-amber-50 dark:text-amber-400 dark:bg-amber-900/20",
  confirmed: "text-sky-600 bg-sky-50 dark:text-sky-400 dark:bg-sky-900/20",
  in_transit: "text-purple-600 bg-purple-50 dark:text-purple-400 dark:bg-purple-900/20",
  delivered: "text-emerald-600 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-900/20",
  cancelled: "text-gray-500 bg-gray-50 dark:text-gray-400 dark:bg-gray-900/20",
}

const statusLabel: Record<string, string> = {
  pending: "Pending",
  confirmed: "Confirmed",
  in_transit: "In Transit",
  delivered: "Delivered",
  cancelled: "Cancelled",
}

function TrackingTimeline({ status }: { status: string }) {
  const stepIdx = STEPS.indexOf(status)
  const labels = ["Order Placed", "Confirmed", "In Transit", "Delivered"]
  const icons = ["📋", "✅", "🚚", "🎉"]
  if (stepIdx === -1) return null
  return (
    <div className="flex items-center gap-1 mt-4">
      {STEPS.map((s, i) => (
        <div key={s} className="flex items-center flex-1 last:flex-none">
          <div className={`flex flex-col items-center gap-1 ${i <= stepIdx ? "opacity-100" : "opacity-30"}`}>
            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-sm ${i <= stepIdx ? "bg-primary text-on-primary dark:bg-primary-fixed dark:text-on-primary-fixed" : "bg-surface-container dark:bg-surface-dim"}`}>
              {i < stepIdx ? "✓" : <span className="text-xs">{icons[i]}</span>}
            </div>
            <span className="text-[9px] text-outline-variant dark:text-outline text-center leading-none w-12">{labels[i]}</span>
          </div>
          {i < STEPS.length - 1 && (
            <div className={`flex-1 h-0.5 mb-3 ${i < stepIdx ? "bg-primary dark:bg-primary-fixed" : "bg-outline-variant/30"}`} />
          )}
        </div>
      ))}
    </div>
  )
}

export function BuyerOrders() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [filter, setFilter] = useState<string>("all")

  useEffect(() => {
    setLoading(true)
    setError("")
    api.get("/api/orders").then(setOrders).catch(() => setError("Failed to load orders.")).finally(() => setLoading(false))
  }, [])

  const filteredOrders = filter === "all" ? orders : orders.filter((o) => o.status === filter)
  const totalSpent = orders.reduce((s, o) => s + o.total, 0)
  const pendingCount = orders.filter((o) => o.status === "pending" || o.status === "confirmed").length
  const deliveredCount = orders.filter((o) => o.status === "delivered").length

  const tabs = ["all", "pending", "confirmed", "in_transit", "delivered"]

  return (
    <div className="pb-24">
      <div className="mb-6">
        <h1 className="font-headline-lg text-headline-lg text-on-surface dark:text-primary-fixed mb-1">My Orders</h1>
        <p className="text-on-surface-variant font-body-md text-body-md dark:text-outline-variant">
          Track your purchases and delivery status
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <div className="bg-surface-container-lowest rounded-xl p-4 shadow-sm border border-surface-container-high dark:bg-surface-dim dark:border-surface-container">
          <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center mb-2 dark:bg-emerald-900/20 dark:text-emerald-400">
            <ShoppingCart size={18} />
          </div>
          <p className="font-headline-md text-headline-md text-on-surface dark:text-primary-fixed">{orders.length}</p>
          <p className="text-label-sm text-on-surface-variant dark:text-outline-variant">Total Orders</p>
        </div>
        <div className="bg-surface-container-lowest rounded-xl p-4 shadow-sm border border-surface-container-high dark:bg-surface-dim dark:border-surface-container">
          <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center mb-2 dark:bg-amber-900/20 dark:text-amber-400">
            <Package size={18} />
          </div>
          <p className="font-headline-md text-headline-md text-on-surface dark:text-primary-fixed">{formatUGX(totalSpent)}</p>
          <p className="text-label-sm text-on-surface-variant dark:text-outline-variant">Total Spent</p>
        </div>
        <div className="bg-surface-container-lowest rounded-xl p-4 shadow-sm border border-surface-container-high dark:bg-surface-dim dark:border-surface-container">
          <div className="w-8 h-8 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center mb-2 dark:bg-sky-900/20 dark:text-sky-400">
            <Clock size={18} />
          </div>
          <p className="font-headline-md text-headline-md text-on-surface dark:text-primary-fixed">{pendingCount}</p>
          <p className="text-label-sm text-on-surface-variant dark:text-outline-variant">In Progress</p>
        </div>
        <div className="bg-surface-container-lowest rounded-xl p-4 shadow-sm border border-surface-container-high dark:bg-surface-dim dark:border-surface-container">
          <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center mb-2 dark:bg-emerald-900/20 dark:text-emerald-400">
            <CheckCircle size={18} />
          </div>
          <p className="font-headline-md text-headline-md text-on-surface dark:text-primary-fixed">{deliveredCount}</p>
          <p className="text-label-sm text-on-surface-variant dark:text-outline-variant">Delivered</p>
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2 mb-6 -mx-4 px-4">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`whitespace-nowrap px-4 py-2 rounded-full font-label-sm text-label-sm transition-colors ${
              filter === tab
                ? "bg-primary text-on-primary dark:bg-primary-fixed dark:text-on-primary-fixed"
                : "bg-surface-container text-on-surface-variant dark:bg-surface-dim dark:text-outline-variant"
            }`}
          >
            {tab === "all" ? "All" : statusLabel[tab] || tab}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-12 text-on-surface-variant font-body-md dark:text-outline-variant">Loading orders...</div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center py-20">
          <AlertCircle size={48} className="text-error mb-4" />
          <p className="text-on-surface-variant font-body-lg text-body-lg dark:text-outline-variant">{error}</p>
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="bg-surface-container-lowest rounded-xl p-12 shadow-sm border border-surface-container-high dark:bg-surface-dim dark:border-surface-container flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 rounded-full bg-primary-container/30 flex items-center justify-center text-primary mb-4 dark:bg-primary-fixed/20 dark:text-primary-fixed">
            <Package size={32} />
          </div>
          <h2 className="font-headline-md text-headline-md text-on-surface mb-2 dark:text-primary-fixed">No Orders Yet</h2>
          <p className="text-on-surface-variant font-body-md text-body-md max-w-sm dark:text-outline-variant">
            Browse the marketplace and place your first order.
          </p>
          <Link to="/market" className="mt-4 px-6 py-2 bg-primary text-on-primary rounded-xl font-label-lg dark:bg-primary-fixed dark:text-on-primary-fixed">
            Browse Listings
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <div
              key={order.id}
              className="bg-surface-container-lowest rounded-xl p-5 shadow-sm border border-surface-container-high dark:bg-surface-dim dark:border-surface-container"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="font-label-lg text-label-lg text-on-surface dark:text-primary-fixed">{formatOrderId(order.id)}</p>
                  <div className="flex items-center gap-3 mt-1 text-label-sm text-on-surface-variant dark:text-outline-variant">
                    <span className="flex items-center gap-1"><Calendar size={12} />{formatDate(order.createdAt)}</span>
                    <span className="flex items-center gap-1"><MapPin size={12} />{order.district}</span>
                  </div>
                </div>
                <span className={`inline-block px-3 py-0.5 rounded-full text-label-sm font-label-sm capitalize ${statusColor[order.status] || ""}`}>
                  {statusLabel[order.status] || order.status.replace(/_/g, " ")}
                </span>
              </div>

              <div className="space-y-1.5 mb-3">
                {(order.items || []).map((item, i) => (
                  <div key={i} className="flex items-center justify-between text-body-md font-body-md">
                    <span className="text-on-surface dark:text-outline-variant">{item.title} <span className="text-on-surface-variant dark:text-outline">×{item.quantity}</span></span>
                    <span className="font-label-md text-label-md text-on-surface dark:text-primary-fixed">{formatUGX(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>

              <div className="border-t border-outline-variant/20 pt-3 flex items-center justify-between">
                <div className="text-label-sm text-on-surface-variant dark:text-outline-variant">
                  <span>Delivery: {formatUGX(order.deliveryFee)}</span>
                  <span className="mx-2">•</span>
                  <span>{order.paymentMethod}</span>
                </div>
                <span className="font-label-lg text-label-lg text-primary dark:text-primary-fixed">{formatUGX(order.total)}</span>
              </div>

              {order.status !== "cancelled" && order.status !== "delivered" && (
                <TrackingTimeline status={order.status} />
              )}
              {order.status === "delivered" && (
                <div className="mt-3 text-center">
                  <span className="text-label-sm text-emerald-600 dark:text-emerald-400">✓ Delivered successfully</span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
