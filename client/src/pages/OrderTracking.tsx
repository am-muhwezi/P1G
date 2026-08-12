import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import { api } from "../lib/api"
import { formatDate, formatUGX, formatOrderId, type Order } from "../lib/data"
import { OrderTimeline } from "../components/features/OrderTimeline"
import { TransactionLog } from "../components/features/TransactionLog"

function statusToProgress(status: string): number {
  switch (status) {
    case "pending": return 25
    case "confirmed": return 50
    case "in_transit": return 75
    case "delivered": return 100
    default: return 0
  }
}

const stepOrder: Record<string, string> = {
  pending: "placed",
  confirmed: "confirmed",
  in_transit: "in_transit",
  delivered: "delivered",
}

export function OrderTracking() {
  const { orderId } = useParams()
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!orderId) return
    setLoading(true)
    api.get(`/api/orders/${orderId}`).then(setOrder).catch(() => setOrder(null)).finally(() => setLoading(false))
  }, [orderId])

  if (loading) {
    return (
      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-stack-lg pb-32">
        <p className="text-on-surface-variant font-body-lg text-center py-20 dark:text-outline-variant">Loading...</p>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-stack-lg pb-32">
        <p className="text-on-surface-variant font-body-lg text-center py-20 dark:text-outline-variant">Order not found.</p>
      </div>
    )
  }

  const items = order.items || []
  const firstItem = items[0]
  const progress = statusToProgress(order.status)

  const activityLog = [
    { label: "Order placed", timestamp: formatDate(order.createdAt), isCompleted: true },
    ...(order.status !== "pending" ? [{ label: "Payment confirmed", timestamp: formatDate(order.updatedAt), isCompleted: true }] : []),
    ...(order.status === "in_transit" ? [{ label: "In transit", timestamp: formatDate(order.updatedAt), isCompleted: true }] : []),
    ...(order.status === "delivered" ? [{ label: "Delivered", timestamp: formatDate(order.updatedAt), isCompleted: true }] : []),
  ]

  return (
    <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-stack-lg pb-32">
      <section className="grid grid-cols-1 md:grid-cols-3 gap-gutter mb-stack-lg">
        <div className="md:col-span-2 bg-surface-container-lowest rounded-xl p-stack-md shadow-sm border border-surface-container-high flex flex-col md:flex-row gap-6 items-center dark:bg-surface-dim dark:border-surface-container">
          <div className="w-full md:w-48 h-48 rounded-lg overflow-hidden shrink-0 bg-surface-container flex items-center justify-center text-outline-variant">
            <span className="material-symbols-outlined text-6xl">inventory_2</span>
          </div>
          <div className="flex-grow">
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-secondary-container text-on-secondary-container px-3 py-1 rounded-full text-label-sm font-label-sm flex items-center gap-1 dark:bg-secondary-fixed-dim dark:text-on-secondary-fixed">
                <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>verified_user</span>
                Payment secured
              </span>
            </div>
            <h2 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-primary mb-1 dark:text-primary-fixed">Order {formatOrderId(order.id)}</h2>
            <p className="font-body-lg text-body-lg text-on-surface-variant mb-4 dark:text-outline-variant">{firstItem?.title}</p>
            <div className="flex flex-wrap gap-4 text-label-lg font-label-lg">
              <div className="flex items-center gap-1 text-on-surface dark:text-primary-fixed">
                <span className="material-symbols-outlined text-primary dark:text-primary-fixed">pin_drop</span>
                {order.address}, {order.district}
              </div>
              <div className="flex items-center gap-1 text-on-surface dark:text-primary-fixed">
                <span className="material-symbols-outlined text-primary dark:text-primary-fixed">calendar_today</span>
                Ordered {formatDate(order.createdAt)}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-surface-container-lowest rounded-xl p-stack-md shadow-sm border border-surface-container-high flex flex-col justify-between dark:bg-surface-dim dark:border-surface-container">
          <div>
            <h3 className="font-label-lg text-label-lg text-outline uppercase tracking-wider mb-4 dark:text-outline-variant">Transaction ID</h3>
            <div className="bg-surface-container p-3 rounded-lg flex items-center justify-between mb-6 dark:bg-surface-container">
              <code className="text-primary font-bold dark:text-primary-fixed text-sm break-all">{order.id}</code>
              <span className="material-symbols-outlined text-outline cursor-pointer hover:text-primary transition-colors dark:text-outline-variant dark:hover:text-primary-fixed shrink-0 ml-2">content_copy</span>
            </div>
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-label-sm">
                <span className="text-on-surface-variant dark:text-outline-variant">Items</span>
                <span className="text-on-surface dark:text-primary-fixed">{items.length}</span>
              </div>
              <div className="flex justify-between text-label-sm">
                <span className="text-on-surface-variant dark:text-outline-variant">Delivery</span>
                <span className="text-on-surface dark:text-primary-fixed">{formatUGX(order.deliveryFee)}</span>
              </div>
              <div className="flex justify-between text-label-lg font-bold border-t border-outline-variant/20 pt-2">
                <span className="text-on-surface dark:text-primary-fixed">Total</span>
                <span className="text-primary dark:text-primary-fixed">{formatUGX(order.total)}</span>
              </div>
            </div>
          </div>
          <div className="space-y-3">
            <button className="w-full bg-primary text-on-primary py-3 rounded-xl font-label-lg flex items-center justify-center gap-2 hover:opacity-90 active:scale-95 transition-all dark:bg-primary-fixed dark:text-on-primary-fixed">
              <span className="material-symbols-outlined">support_agent</span>
              Contact Support
            </button>
          </div>
        </div>
      </section>

      <OrderTimeline status={stepOrder[order.status] || "placed"} progressPercent={progress} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-gutter">
        <TransactionLog entries={activityLog} />

        <section className="bg-primary-container text-on-primary-container rounded-xl p-stack-md shadow-sm flex flex-col justify-between dark:bg-primary dark:text-on-primary">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="material-symbols-outlined text-[32px]">verified_user</span>
              <h3 className="font-headline-md text-headline-md">Secure Trading</h3>
            </div>
            <p className="font-body-md opacity-90 mb-6">
              Your payment is handled securely. Funds are only released to the seller once you have confirmed receipt and quality. Our support team is ready to help with any concerns.
            </p>
            <ul className="space-y-3 font-label-lg">
              <li className="flex items-start gap-2">
                <span className="material-symbols-outlined text-[20px]">verified</span>
                Verified Sellers Only
              </li>
              <li className="flex items-start gap-2">
                <span className="material-symbols-outlined text-[20px]">lock_clock</span>
                Inspection Window
              </li>
              <li className="flex items-start gap-2">
                <span className="material-symbols-outlined text-[20px]">support_agent</span>
                Dispute Support
              </li>
            </ul>
          </div>
          <div className="mt-8 bg-on-primary-container/10 p-4 rounded-lg border border-on-primary-container/20 dark:bg-on-primary/10 dark:border-on-primary/20">
            <p className="text-label-sm italic opacity-80">
              "Agriculture is our foundation. Trust is our bridge." — P1G katale
            </p>
          </div>
        </section>
      </div>
    </div>
  )
}
