import { useState } from "react"
import { useAuth } from "../../store/auth"
import { MOCK_ORDERS, formatUGX, formatDate, type Order } from "../../lib/data"
import { Search, ChevronDown, ChevronUp, MessageSquare, CheckCheck, X, ShoppingCart, Clock, CheckCircle, DollarSign } from "lucide-react"

const DEFAULT_SELLER_NAME = "Mukasa Farms"

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
              {order.items.map((item, idx) => (
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

interface Thread {
  id: string
  buyerId: string
  buyerName: string
  subject: string
  preview: string
  timestamp: string
  unread: boolean
  messages: { from: "buyer" | "seller"; text: string; time: string }[]
}

const MOCK_THREADS: Thread[] = [
  {
    id: "msg-1",
    buyerId: "buyer-1",
    buyerName: "John Buyer",
    subject: "Large White Boar - 80kg",
    preview: "Is the boar still available? I'd like to come see it this weekend.",
    timestamp: "2025-06-23T09:15:00Z",
    unread: true,
    messages: [
      { from: "buyer", text: "Hi, I'm interested in the Large White Boar. Is it still available?", time: "9:15 AM" },
      { from: "buyer", text: "I'd like to come see it this weekend if possible.", time: "9:15 AM" },
    ],
  },
  {
    id: "msg-2",
    buyerId: "buyer-1",
    buyerName: "John Buyer",
    subject: "Duroc Piglets - Set of 5",
    preview: "Great, I'll take the set. Can you deliver to Kampala?",
    timestamp: "2025-06-22T14:30:00Z",
    unread: false,
    messages: [
      { from: "buyer", text: "Are the Duroc piglets still for sale?", time: "2:00 PM" },
      { from: "seller", text: "Yes, still available! I have 3 sets left.", time: "2:15 PM" },
      { from: "buyer", text: "Great, I'll take the set. Can you deliver to Kampala?", time: "2:30 PM" },
      { from: "seller", text: "Yes, delivery to Kampala is UGX 30,000. I can arrange for Friday.", time: "2:45 PM" },
      { from: "buyer", text: "Perfect, let's proceed. Sending payment now.", time: "3:00 PM" },
    ],
  },
  {
    id: "msg-3",
    buyerId: "buyer-1",
    buyerName: "John Buyer",
    subject: "Premium Landrace Sow",
    preview: "Payment sent! Please confirm receipt.",
    timestamp: "2025-06-21T11:00:00Z",
    unread: false,
    messages: [
      { from: "buyer", text: "I'd like to buy the Landrace Sow. Price is UGX 1,450,000?", time: "10:00 AM" },
      { from: "seller", text: "That's correct. She's a proven breeder with excellent lineage.", time: "10:15 AM" },
      { from: "seller", text: "I can do UGX 1,400,000 if you arrange transport.", time: "10:20 AM" },
      { from: "buyer", text: "Deal! I'll arrange pickup on Monday. Sending payment now.", time: "10:45 AM" },
      { from: "buyer", text: "Payment sent! Please confirm receipt.", time: "11:00 AM" },
    ],
  },
]

const tabs = ["Orders", "Messages"] as const
type Tab = (typeof tabs)[number]

export function SellerOrders() {
  const auth = useAuth()
  const sellerName = auth.name || DEFAULT_SELLER_NAME
  const [search, setSearch] = useState("")
  const [activeTab, setActiveTab] = useState<Tab>("Orders")

  const rawOrders = MOCK_ORDERS.filter((o) =>
    o.items.some((i) => i.sellerName === sellerName),
  )
  const allOrders = rawOrders.length > 0
    ? rawOrders
    : MOCK_ORDERS.filter((o) => o.items.some((i) => i.sellerName === DEFAULT_SELLER_NAME))

  const pendingCount = allOrders.filter((o) => o.status === "pending").length
  const confirmedCount = allOrders.filter((o) => o.status === "confirmed" || o.status === "in_transit").length
  const totalRevenue = allOrders.filter((o) => o.status === "delivered" || o.status === "confirmed").reduce((s, o) => s + o.total, 0)

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-headline-lg text-headline-lg text-on-surface dark:text-primary-fixed">Orders</h1>
        <p className="text-on-surface-variant font-body-md text-body-md dark:text-outline-variant">
          Manage orders and messages from buyers
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <div className="bg-surface-container-lowest rounded-xl p-4 shadow-sm border border-surface-container-high dark:bg-surface-dim dark:border-surface-container">
          <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center mb-2 dark:bg-emerald-900/20 dark:text-emerald-400">
            <ShoppingCart size={18} />
          </div>
          <p className="font-headline-md text-headline-md text-on-surface dark:text-primary-fixed">{allOrders.length}</p>
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

      <div className="flex gap-1 mb-6 p-1 bg-surface-container rounded-xl w-fit dark:bg-surface-dim">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-5 py-2 rounded-lg font-label-sm text-label-sm transition-colors ${
              activeTab === tab
                ? "bg-white text-on-surface shadow-sm dark:bg-surface-container-lowest dark:text-primary-fixed"
                : "text-on-surface-variant hover:text-on-surface dark:text-outline-variant dark:hover:text-primary-fixed"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === "Orders" ? (
        <OrdersPanel search={search} setSearch={setSearch} filtered={allOrders.filter(
          (o) =>
            o.id.toLowerCase().includes(search.toLowerCase()) ||
            o.buyerName.toLowerCase().includes(search.toLowerCase()),
        )} />
      ) : (
        <MessagesPanel />
      )}
    </div>
  )
}

function OrdersPanel({ search, setSearch, filtered }: { search: string; setSearch: (s: string) => void; filtered: Order[] }) {
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
    </>
  )
}

function MessagesPanel() {
  const [search, setSearch] = useState("")
  const [activeThread, setActiveThread] = useState<string | null>(null)

  const threads = MOCK_THREADS.filter(
    (t) =>
      t.buyerName.toLowerCase().includes(search.toLowerCase()) ||
      t.subject.toLowerCase().includes(search.toLowerCase()),
  )

  const active = threads.find((t) => t.id === activeThread)

  return (
    <>
      <div className="relative mb-4 lg:hidden">
        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-outline dark:text-outline-variant" />
        <input
          className="w-full pl-11 pr-4 py-3 bg-warm-beige border-none rounded-xl focus:ring-2 focus:ring-primary text-body-md dark:bg-surface-dim dark:text-primary-fixed dark:placeholder:text-outline"
          placeholder="Search messages..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className={`bg-surface-container-lowest rounded-xl shadow-sm border border-surface-container-high dark:bg-surface-dim dark:border-surface-container lg:col-span-1 ${activeThread ? "hidden lg:block" : ""}`}>
          <div className="hidden lg:block p-4 border-b border-outline-variant/20 dark:border-surface-container">
            <Search size={18} className="absolute left-6 mt-3 text-outline dark:text-outline-variant" />
            <input
              className="w-full pl-8 pr-4 py-2 bg-warm-beige border-none rounded-lg focus:ring-2 focus:ring-primary text-body-md dark:bg-surface-dim dark:text-primary-fixed dark:placeholder:text-outline"
              placeholder="Search messages..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="divide-y divide-outline-variant/20 dark:divide-surface-container max-h-[500px] overflow-y-auto">
            {threads.length === 0 ? (
              <div className="p-8 text-center">
                <div className="w-12 h-12 rounded-full bg-primary-container/30 flex items-center justify-center text-primary mx-auto mb-3 dark:bg-primary-fixed/20 dark:text-primary-fixed">
                  <MessageSquare size={24} />
                </div>
                <p className="text-on-surface-variant font-body-md dark:text-outline-variant">No messages found.</p>
              </div>
            ) : (
              threads.map((thread) => (
                <button
                  key={thread.id}
                  onClick={() => setActiveThread(thread.id)}
                  className={`w-full text-left p-4 transition-colors hover:bg-surface-container/50 dark:hover:bg-surface-container ${
                    activeThread === thread.id ? "bg-surface-container/70 dark:bg-surface-container" : ""
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0 ${
                      thread.unread ? "bg-primary dark:bg-primary-fixed" : "bg-outline-variant dark:bg-surface-container-highest"
                    }`}>
                      {thread.buyerName.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-0.5">
                        <span className={`font-label-lg text-label-lg truncate ${thread.unread ? "text-on-surface font-semibold dark:text-primary-fixed" : "text-on-surface dark:text-primary-fixed"}`}>
                          {thread.buyerName}
                        </span>
                        <span className="text-label-sm text-on-surface-variant dark:text-outline-variant shrink-0 ml-2">
                          {new Date(thread.timestamp).toLocaleDateString("en-UG", { month: "short", day: "numeric" })}
                        </span>
                      </div>
                      <p className="text-label-sm text-on-surface-variant dark:text-outline-variant truncate">{thread.subject}</p>
                      <p className="text-label-sm text-on-surface-variant/70 dark:text-outline-variant/70 truncate mt-0.5">{thread.preview}</p>
                    </div>
                    {thread.unread && (
                      <div className="w-2 h-2 rounded-full bg-primary dark:bg-primary-fixed shrink-0 mt-2" />
                    )}
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        <div className={`bg-surface-container-lowest rounded-xl shadow-sm border border-surface-container-high dark:bg-surface-dim dark:border-surface-container flex flex-col lg:col-span-2 ${!activeThread ? "hidden lg:flex" : ""}`}>
          {active ? (
            <>
              <div className="flex items-center gap-3 p-4 border-b border-outline-variant/20 dark:border-surface-container">
                <button onClick={() => setActiveThread(null)} className="lg:hidden text-on-surface-variant dark:text-outline-variant">
                  <X size={20} />
                </button>
                <div className="w-10 h-10 rounded-full bg-outline-variant dark:bg-surface-container-highest flex items-center justify-center text-white font-bold text-sm">
                  {active.buyerName.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-label-lg text-label-lg text-on-surface dark:text-primary-fixed">{active.buyerName}</p>
                  <p className="text-label-sm text-on-surface-variant dark:text-outline-variant">{active.subject}</p>
                </div>
              </div>
              <div className="flex-1 p-4 space-y-4 overflow-y-auto max-h-[400px]">
                {active.messages.map((msg, idx) => (
                  <div key={idx} className={`flex ${msg.from === "seller" ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-[80%] p-3 rounded-xl ${
                      msg.from === "seller"
                        ? "bg-[#002114] text-white rounded-br-none"
                        : "bg-surface-container dark:bg-surface-container dark:text-primary-fixed rounded-bl-none"
                    }`}>
                      <p className="font-body-md text-body-md">{msg.text}</p>
                      <div className={`flex items-center justify-end gap-1 mt-1 ${
                        msg.from === "seller" ? "text-white/60" : "text-on-surface-variant dark:text-outline-variant"
                      }`}>
                        <span className="text-[10px]">{msg.time}</span>
                        {msg.from === "seller" && <CheckCheck size={12} />}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-4 border-t border-outline-variant/20 dark:border-surface-container">
                <div className="flex gap-2">
                  <input
                    className="flex-1 px-4 py-3 bg-warm-beige border-none rounded-xl focus:ring-2 focus:ring-primary text-body-md dark:bg-surface-dim dark:text-primary-fixed dark:placeholder:text-outline"
                    placeholder="Type a message..."
                    readOnly
                  />
                  <button className="px-4 py-3 bg-[#002114] text-white rounded-xl font-label-lg hover:bg-[#002114]/90 transition-colors">
                    Send
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-12 text-center">
              <div className="w-16 h-16 rounded-full bg-primary-container/30 flex items-center justify-center text-primary mb-4 dark:bg-primary-fixed/20 dark:text-primary-fixed">
                <MessageSquare size={32} />
              </div>
              <h2 className="font-headline-md text-headline-md text-on-surface mb-2 dark:text-primary-fixed">Select a Conversation</h2>
              <p className="text-on-surface-variant font-body-md text-body-md max-w-sm dark:text-outline-variant">
                Choose a thread from the left to view messages.
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
