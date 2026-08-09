import { useState, useEffect } from "react"
import { api } from "../../lib/api"
import { formatUGX, formatDate, type Order } from "../../lib/data"
import { Search, ChevronDown, ChevronUp, ShoppingCart, Clock, CheckCircle, DollarSign } from "lucide-react"

const statusColor: Record<string, string> = {
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

function OrderRow({ order }: { order: Order }) {
  const [expanded, setExpanded] = useState(false)

  return (
    <>
      <tr
        className="border-b border-outline-variant/20 hover:bg-surface-container/50 transition-colors cursor-pointer dark:border-surface-container dark:hover:bg-on-background/50"
        onClick={() => setExpanded(!expanded)}
      >
        <td className="px-4 py-4">
          <p className="font-label-lg text-label-lg text-on-surface dark:text-primary-fixed">{order.id}</p>
        </td>
        <td className="px-4 py-4 text-label-sm text-on-surface-variant dark:text-outline-variant">{order.buyerName}</td>
        <td className="px-4 py-4 text-label-sm text-on-surface-variant dark:text-outline-variant">{formatDate(order.createdAt)}</td>
        <td className="px-4 py-4 font-label-lg text-label-lg text-primary dark:text-primary-fixed">{formatUGX(order.total)}</td>
        <td className="px-4 py-4"><StatusPill status={order.status} /></td>
        <td className="px-4 py-4 text-right">
          {expanded ? <ChevronUp size={16} className="text-outline dark:text-outline-variant" /> : <ChevronDown size={16} className="text-outline dark:text-outline-variant" />}
        </td>
      </tr>
      {expanded && (
        <tr className="bg-surface-container/30 dark:bg-surface-container/30">
          <td colSpan={6} className="px-4 py-4">
            <div className="space-y-2">
              <p className="font-label-sm text-label-sm text-on-surface-variant dark:text-outline-variant">Items</p>
              {(order.items || []).map((item, idx) => (
                <div key={idx} className="flex items-center justify-between py-1">
                  <span className="font-label-lg text-label-lg text-on-surface dark:text-primary-fixed">{item.title}</span>
                  <span className="text-label-sm text-on-surface-variant dark:text-outline-variant">
                    {item.quantity} x {formatUGX(item.price)}
                  </span>
                </div>
              ))}
              <div className="pt-2 border-t border-outline-variant/20 dark:border-surface-container">
                <p className="flex justify-between font-label-lg">
                  <span className="text-on-surface-variant dark:text-outline-variant">Delivery Fee</span>
                  <span className="text-on-surface dark:text-primary-fixed">{formatUGX(order.deliveryFee)}</span>
                </p>
                <p className="flex justify-between font-label-lg mt-1">
                  <span className="text-on-surface-variant dark:text-outline-variant">Payment</span>
                  <span className="text-on-surface dark:text-primary-fixed">{order.paymentMethod}</span>
                </p>
                <p className="flex justify-between font-label-lg mt-1">
                  <span className="text-on-surface-variant dark:text-outline-variant">Delivery</span>
                  <span className="text-on-surface dark:text-primary-fixed">{order.address}, {order.district}</span>
                </p>
                {order.notes && (
                  <p className="flex justify-between font-label-lg mt-1">
                    <span className="text-on-surface-variant dark:text-outline-variant">Notes</span>
                    <span className="text-on-surface dark:text-primary-fixed">{order.notes}</span>
                  </p>
                )}
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  )
}

export function SellerOrders() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")

  useEffect(() => {
    api.get("/api/seller/orders")
      .then(setOrders)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const pendingCount = orders.filter((o) => o.status === "pending").length
  const confirmedCount = orders.filter((o) => o.status === "confirmed" || o.status === "in_transit").length
  const totalRevenue = orders.filter((o) => o.status === "delivered" || o.status === "confirmed").reduce((s, o) => s + o.total, 0)

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-headline-lg text-headline-lg text-on-surface dark:text-primary-fixed">Orders</h1>
        <p className="text-on-surface-variant font-body-md text-body-md dark:text-outline-variant">
          Manage orders from buyers
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
            <Clock size={18} />
          </div>
          <p className="font-headline-md text-headline-md text-on-surface dark:text-primary-fixed">{pendingCount}</p>
          <p className="text-label-sm text-on-surface-variant dark:text-outline-variant">Pending</p>
        </div>
        <div className="bg-surface-container-lowest rounded-xl p-4 shadow-sm border border-surface-container-high dark:bg-surface-dim dark:border-surface-container">
          <div className="w-8 h-8 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center mb-2 dark:bg-sky-900/20 dark:text-sky-400">
            <CheckCircle size={18} />
          </div>
          <p className="font-headline-md text-headline-md text-on-surface dark:text-primary-fixed">{confirmedCount}</p>
          <p className="text-label-sm text-on-surface-variant dark:text-outline-variant">Active</p>
        </div>
        <div className="bg-surface-container-lowest rounded-xl p-4 shadow-sm border border-surface-container-high dark:bg-surface-dim dark:border-surface-container">
          <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center mb-2 dark:bg-purple-900/20 dark:text-purple-400">
            <DollarSign size={18} />
          </div>
          <p className="font-headline-md text-headline-md text-on-surface dark:text-primary-fixed">{formatUGX(totalRevenue)}</p>
          <p className="text-label-sm text-on-surface-variant dark:text-outline-variant">Revenue</p>
        </div>
      </div>

      <OrdersPanel search={search} setSearch={setSearch} filtered={orders.filter(
        (o) =>
          o.id.toLowerCase().includes(search.toLowerCase()) ||
          o.buyerName.toLowerCase().includes(search.toLowerCase()),
      )} loading={loading} />
    </div>
  )
}

function OrdersPanel({ search, setSearch, filtered, loading }: { search: string; setSearch: (s: string) => void; filtered: Order[]; loading: boolean }) {
  return (
    <>
      <div className="relative mb-6">
        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-outline dark:text-outline-variant" />
        <input
          className="w-full pl-11 pr-4 py-3 bg-warm-beige border-none rounded-xl focus:ring-2 focus:ring-primary text-body-md dark:bg-surface-dim dark:text-primary-fixed dark:placeholder:text-outline"
          placeholder="Search orders..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-40 text-on-surface-variant font-body-md dark:text-outline-variant">Loading orders...</div>
      ) : (
        <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-surface-container-high overflow-x-auto dark:bg-surface-dim dark:border-surface-container">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-outline-variant/30 dark:border-surface-container">
                <th className="px-4 py-4 font-label-sm text-label-sm text-on-surface-variant dark:text-outline-variant">Order ID</th>
                <th className="px-4 py-4 font-label-sm text-label-sm text-on-surface-variant dark:text-outline-variant">Buyer</th>
                <th className="px-4 py-4 font-label-sm text-label-sm text-on-surface-variant dark:text-outline-variant">Date</th>
                <th className="px-4 py-4 font-label-sm text-label-sm text-on-surface-variant dark:text-outline-variant">Total</th>
                <th className="px-4 py-4 font-label-sm text-label-sm text-on-surface-variant dark:text-outline-variant">Status</th>
                <th className="px-4 py-4" />
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-on-surface-variant font-body-md dark:text-outline-variant">
                    No orders found.
                  </td>
                </tr>
              ) : (
                filtered.map((order) => <OrderRow key={order.id} order={order} />)
              )}
            </tbody>
          </table>
        </div>
      )}
    </>
  )
}
