import { AppShell, BuyerTopBar, StatusBadge } from "@/components/layout/AppShell"
import { MOCK_ORDERS, formatUGX } from "@/lib/data"
import { useAuth } from "@/store/auth"
import { Package, MapPin, Calendar } from "lucide-react"

const STEPS = ["pending", "confirmed", "in_transit", "delivered"]

function TrackingTimeline({ status }: { status: string }) {
  const stepIdx = STEPS.indexOf(status)
  const labels = ["Order Placed", "Confirmed", "In Transit", "Delivered"]
  const icons = ["📋", "✅", "🚚", "🎉"]
  return (
    <div className="flex items-center gap-1 mt-3">
      {STEPS.map((s, i) => (
        <div key={s} className="flex items-center flex-1 last:flex-none">
          <div className={`flex flex-col items-center gap-1 ${i <= stepIdx ? "opacity-100" : "opacity-30"}`}>
            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-sm ${i <= stepIdx ? "bg-green-700" : "bg-gray-200"}`}>
              {i < stepIdx ? "✓" : <span className="text-xs">{icons[i]}</span>}
            </div>
            <span className="text-[9px] text-gray-500 text-center leading-none w-12">{labels[i]}</span>
          </div>
          {i < STEPS.length - 1 && (
            <div className={`flex-1 h-0.5 mb-3 ${i < stepIdx ? "bg-green-700" : "bg-gray-200"}`} />
          )}
        </div>
      ))}
    </div>
  )
}

export default function BuyerOrders() {
  const { userId } = useAuth()
  const orders = MOCK_ORDERS.filter(o => o.buyerId === userId)

  return (
    <AppShell>
      <BuyerTopBar />
      <div className="p-4 lg:p-6">
        <h1 className="text-xl font-bold text-gray-900 mb-1">My Orders</h1>
        <p className="text-sm text-gray-500 mb-5">Track your purchases and delivery status</p>

        {orders.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <Package size={40} className="mx-auto mb-3 opacity-30" />
            <p className="font-medium">No orders yet</p>
            <p className="text-sm">Start shopping from the marketplace</p>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map(order => (
              <div key={order.id} className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="font-bold text-gray-900 text-sm">{order.id}</p>
                    <div className="flex items-center gap-3 mt-1 text-xs text-gray-400">
                      <span className="flex items-center gap-1"><Calendar size={11} />{order.createdAt}</span>
                      <span className="flex items-center gap-1"><MapPin size={11} />{order.district}</span>
                    </div>
                  </div>
                  <StatusBadge status={order.status} />
                </div>

                {/* Items */}
                <div className="space-y-1.5 mb-3">
                  {order.items.map((item, i) => (
                    <div key={i} className="flex items-center justify-between text-sm">
                      <span className="text-gray-700">{item.title} <span className="text-gray-400">×{item.quantity}</span></span>
                      <span className="font-medium text-gray-900">{formatUGX(item.price * item.quantity)}</span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-gray-100 pt-3 flex items-center justify-between">
                  <div className="text-xs text-gray-500">
                    <span>Delivery: {formatUGX(order.deliveryFee)}</span>
                    <span className="mx-2">•</span>
                    <span>{order.paymentMethod}</span>
                  </div>
                  <span className="font-bold text-green-700">{formatUGX(order.total)}</span>
                </div>

                {order.status !== "cancelled" && order.status !== "delivered" && (
                  <TrackingTimeline status={order.status} />
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </AppShell>
  )
}
