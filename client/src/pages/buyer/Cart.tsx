import { useState } from "react"
import { Link } from "react-router-dom"
import { ShoppingCart, Trash2, Minus, Plus, CheckCircle, ChevronLeft, User, Mail, Phone, MapPin } from "lucide-react"
import { api } from "../../lib/api"
import { useCart } from "../../store/cart"
import { formatUGX, UGANDAN_DISTRICTS } from "../../lib/data"

type Step = "cart" | "details" | "review" | "success"

const DELIVERY_FEE = 25000

export function Cart() {
  const { items, removeItem, updateQty, clearCart, total } = useCart()
  const [step, setStep] = useState<Step>("cart")
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [address, setAddress] = useState("")
  const [district, setDistrict] = useState("Kampala")
  const [paymentMethod, setPaymentMethod] = useState("MTN Mobile Money")
  const [ordering, setOrdering] = useState(false)
  const [orderNumber, setOrderNumber] = useState("")
  const [error, setError] = useState("")

  const subtotal = total()
  const grandTotal = subtotal + DELIVERY_FEE

  const handlePlaceOrder = async () => {
    setOrdering(true)
    setError("")
    try {
      const order = await api.post("/api/orders", {
        items: items.map((i) => ({ listing_id: i.listingId, quantity: i.quantity })),
        delivery_fee: DELIVERY_FEE,
        payment_method: paymentMethod,
        address,
        district,
      })
      setOrderNumber(order.id)
      clearCart()
      setStep("success")
    } catch (err: any) {
      setError(err.message)
    } finally {
      setOrdering(false)
    }
  }

  if (step === "details") {
    return (
      <div className="p-4 pb-24 max-w-lg mx-auto">
        <button onClick={() => setStep("cart")} className="flex items-center gap-1 text-on-surface-variant dark:text-outline-variant mb-4 font-label-sm text-label-sm">
          <ChevronLeft size={18} /> Back to Cart
        </button>
        <h1 className="font-headline-lg text-headline-lg text-on-surface dark:text-primary-fixed mb-6">Delivery Details</h1>
        <div className="bg-surface-container-lowest dark:bg-surface-dim rounded-xl p-4 border border-outline-variant/20 mb-6 space-y-4">
          <div>
            <label className="font-label-sm text-label-sm text-on-surface-variant dark:text-outline-variant block mb-1">Full Name</label>
            <div className="relative">
              <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-outline-variant" />
              <input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. John Doe" className="w-full pl-9 pr-4 py-3 rounded-lg border border-outline-variant bg-surface-container dark:bg-surface-dim text-on-surface dark:text-primary-fixed text-body-md font-body-md focus:outline-none focus:ring-2 focus:ring-primary/30" />
            </div>
          </div>
          <div>
            <label className="font-label-sm text-label-sm text-on-surface-variant dark:text-outline-variant block mb-1">Email</label>
            <div className="relative">
              <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-outline-variant" />
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="e.g. john@example.com" className="w-full pl-9 pr-4 py-3 rounded-lg border border-outline-variant bg-surface-container dark:bg-surface-dim text-on-surface dark:text-primary-fixed text-body-md font-body-md focus:outline-none focus:ring-2 focus:ring-primary/30" />
            </div>
          </div>
          <div>
            <label className="font-label-sm text-label-sm text-on-surface-variant dark:text-outline-variant block mb-1">Phone Number</label>
            <div className="relative">
              <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-outline-variant" />
              <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="e.g. 0772 345 678" className="w-full pl-9 pr-4 py-3 rounded-lg border border-outline-variant bg-surface-container dark:bg-surface-dim text-on-surface dark:text-primary-fixed text-body-md font-body-md focus:outline-none focus:ring-2 focus:ring-primary/30" />
            </div>
          </div>
          <div>
            <label className="font-label-sm text-label-sm text-on-surface-variant dark:text-outline-variant block mb-1">Delivery Address</label>
            <div className="relative">
              <MapPin size={16} className="absolute left-3 top-3 text-outline-variant" />
              <textarea value={address} onChange={(e) => setAddress(e.target.value)} placeholder="e.g. Plot 14, Kampala Road" className="w-full pl-9 pr-4 py-3 rounded-lg border border-outline-variant bg-surface-container dark:bg-surface-dim text-on-surface dark:text-primary-fixed text-body-md font-body-md resize-none focus:outline-none focus:ring-2 focus:ring-primary/30" rows={3} />
            </div>
          </div>
          <div>
            <label className="font-label-sm text-label-sm text-on-surface-variant dark:text-outline-variant block mb-1">District</label>
            <select value={district} onChange={(e) => setDistrict(e.target.value)} className="w-full p-3 rounded-lg border border-outline-variant bg-surface-container dark:bg-surface-dim text-on-surface dark:text-primary-fixed text-body-md font-body-md focus:outline-none focus:ring-2 focus:ring-primary/30">
              {UGANDAN_DISTRICTS.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>
        </div>
        <button
          onClick={() => setStep("review")}
          disabled={!name || !address}
          className="w-full py-4 bg-primary text-on-primary rounded-xl font-label-lg text-label-lg hover:bg-primary/90 transition-colors disabled:opacity-50 dark:bg-primary-fixed dark:text-on-primary-fixed"
        >
          Continue to Review
        </button>
      </div>
    )
  }

  if (step === "review") {
    return (
      <div className="p-4 pb-24 max-w-lg mx-auto">
        <button onClick={() => setStep("details")} className="flex items-center gap-1 text-on-surface-variant dark:text-outline-variant mb-4 font-label-sm text-label-sm">
          <ChevronLeft size={18} /> Back to Details
        </button>
        <h1 className="font-headline-lg text-headline-lg text-on-surface dark:text-primary-fixed mb-6">Review Your Order</h1>
        <div className="space-y-4 mb-6">
          <div className="bg-surface-container-lowest dark:bg-surface-dim rounded-xl p-4 border border-outline-variant/20">
            <h2 className="font-label-lg text-label-lg text-on-surface dark:text-primary-fixed mb-3">Contact & Delivery</h2>
            <p className="font-body-md text-body-md text-on-surface dark:text-outline-variant">{name}</p>
            <p className="font-body-md text-body-md text-on-surface-variant dark:text-outline">{email}</p>
            <p className="font-body-md text-body-md text-on-surface-variant dark:text-outline">{phone}</p>
            <p className="font-body-md text-body-md text-on-surface-variant dark:text-outline mt-1 flex items-start gap-1"><MapPin size={14} className="mt-0.5 shrink-0" />{address}</p>
            <p className="font-body-md text-body-md text-on-surface-variant dark:text-outline mt-1 flex items-start gap-1"><MapPin size={14} className="mt-0.5 shrink-0" />{district}</p>
          </div>
          <div className="bg-surface-container-lowest dark:bg-surface-dim rounded-xl p-4 border border-outline-variant/20">
            <h2 className="font-label-lg text-label-lg text-on-surface dark:text-primary-fixed mb-3">Order Summary</h2>
            {items.map((item) => (
              <div key={item.listingId} className="flex justify-between py-2 border-b border-outline-variant/10 last:border-0">
                <span className="font-body-md text-body-md text-on-surface dark:text-outline-variant">{item.title} x{item.quantity}</span>
                <span className="font-body-md text-body-md text-on-surface dark:text-primary-fixed">{formatUGX(item.price * item.quantity)}</span>
              </div>
            ))}
            <div className="flex justify-between pt-2 mt-2 border-t border-outline-variant/10">
              <span className="font-body-md text-body-md text-on-surface-variant dark:text-outline-variant">Delivery Fee</span>
              <span className="font-body-md text-body-md text-on-surface dark:text-outline-variant">{formatUGX(DELIVERY_FEE)}</span>
            </div>
            <div className="flex justify-between pt-2 mt-2 border-t border-outline-variant/20">
              <span className="font-label-lg text-label-lg text-on-surface dark:text-primary-fixed">Total</span>
              <span className="font-label-lg text-label-lg text-primary dark:text-primary-fixed">{formatUGX(grandTotal)}</span>
            </div>
          </div>
          <div className="bg-surface-container-lowest dark:bg-surface-dim rounded-xl p-4 border border-outline-variant/20">
            <h2 className="font-label-lg text-label-lg text-on-surface dark:text-primary-fixed mb-3">Payment Method</h2>
            {["MTN Mobile Money", "Airtel Money", "Bank Transfer", "Cash on Delivery"].map((method) => (
              <label key={method} className="flex items-center gap-3 py-2 cursor-pointer">
                <input type="radio" name="payment" value={method} checked={paymentMethod === method} onChange={(e) => setPaymentMethod(e.target.value)} className="accent-primary" />
                <span className="font-body-md text-body-md text-on-surface dark:text-outline-variant">{method}</span>
              </label>
            ))}
            {(paymentMethod === "MTN Mobile Money" || paymentMethod === "Airtel Money") && (
              <div className="mt-3">
                <label className="font-label-sm text-label-sm text-on-surface-variant dark:text-outline-variant block mb-1">Phone Number</label>
                <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="e.g. 0772 345 678" className="w-full p-3 rounded-lg border border-outline-variant bg-surface-container dark:bg-surface-dim text-on-surface dark:text-primary-fixed text-body-md font-body-md" />
              </div>
            )}
          </div>
        </div>
        {error && <p className="font-label-sm text-label-sm text-error mb-3">{error}</p>}
        <button
          onClick={handlePlaceOrder}
          disabled={ordering}
          className="w-full py-4 bg-primary text-on-primary rounded-xl font-label-lg text-label-lg hover:bg-primary/90 transition-colors disabled:opacity-50 dark:bg-primary-fixed dark:text-on-primary-fixed"
        >
          {ordering ? "Processing..." : `Place Order - ${formatUGX(grandTotal)}`}
        </button>
      </div>
    )
  }

  if (step === "success") {
    return (
      <div className="p-4 pb-24 max-w-lg mx-auto text-center pt-16">
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 rounded-full bg-primary/10 dark:bg-primary-fixed/20 flex items-center justify-center">
            <CheckCircle size={48} className="text-primary dark:text-primary-fixed" />
          </div>
        </div>
        <h1 className="font-headline-xl text-headline-xl text-on-surface dark:text-primary-fixed mb-2">Order Placed!</h1>
        <p className="font-body-md text-body-md text-on-surface-variant dark:text-outline-variant mb-6">
          Your order <span className="font-bold text-on-surface dark:text-primary-fixed">{orderNumber}</span> has been confirmed.
        </p>
        <div className="bg-surface-container-lowest dark:bg-surface-dim rounded-xl p-6 border border-outline-variant/20 mb-8">
          <p className="font-body-md text-body-md text-on-surface-variant dark:text-outline-variant mb-1">Estimated Delivery</p>
          <p className="font-headline-md text-headline-md text-on-surface dark:text-primary-fixed">2-4 business days</p>
        </div>
        <Link to="/market" className="block w-full py-4 border border-primary text-primary rounded-xl font-label-lg text-label-lg hover:bg-primary hover:text-white transition-colors dark:border-primary-fixed dark:text-primary-fixed dark:hover:bg-primary-fixed dark:hover:text-on-primary-fixed">
          Continue Shopping
        </Link>
      </div>
    )
  }

  return (
    <div className="p-4 pb-24 max-w-lg mx-auto">
      <h1 className="font-headline-lg text-headline-lg text-on-surface dark:text-primary-fixed mb-6 flex items-center gap-2">
        <ShoppingCart size={24} /> Shopping Cart
      </h1>
      {items.length === 0 ? (
        <div className="text-center py-20">
          <ShoppingCart size={64} className="mx-auto text-outline-variant dark:text-outline mb-4" />
          <p className="font-body-lg text-body-lg text-on-surface-variant dark:text-outline-variant mb-6">Your cart is empty.</p>
          <Link to="/market" className="inline-block px-8 py-4 bg-primary text-on-primary rounded-xl font-label-lg text-label-lg hover:bg-primary/90 transition-colors dark:bg-primary-fixed dark:text-on-primary-fixed">
            Browse Listings
          </Link>
        </div>
      ) : (
        <>
          <div className="space-y-3 mb-6">
            {items.map((item) => (
              <div key={item.listingId} className="bg-surface-container-lowest dark:bg-surface-dim rounded-xl p-4 border border-outline-variant/20 flex items-center gap-4">
                <div className="flex-1 min-w-0">
                  <h3 className="font-label-md text-label-md text-on-surface dark:text-primary-fixed truncate">{item.title}</h3>
                  <p className="font-label-sm text-label-sm text-primary dark:text-primary-fixed mt-0.5">{formatUGX(item.price)} each</p>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => updateQty(item.listingId, item.quantity - 1)} className="w-8 h-8 rounded-full border border-outline-variant flex items-center justify-center text-on-surface dark:text-outline-variant hover:bg-surface-container dark:hover:bg-surface-dim transition-colors">
                    <Minus size={14} />
                  </button>
                  <span className="w-8 text-center font-body-md text-body-md text-on-surface dark:text-primary-fixed">{item.quantity}</span>
                  <button onClick={() => updateQty(item.listingId, item.quantity + 1)} className="w-8 h-8 rounded-full border border-outline-variant flex items-center justify-center text-on-surface dark:text-outline-variant hover:bg-surface-container dark:hover:bg-surface-dim transition-colors">
                    <Plus size={14} />
                  </button>
                </div>
                <div className="text-right min-w-[80px]">
                  <p className="font-label-md text-label-md text-on-surface dark:text-primary-fixed">{formatUGX(item.price * item.quantity)}</p>
                  <button onClick={() => removeItem(item.listingId)} className="text-error flex items-center gap-0.5 font-label-sm text-label-sm mt-0.5">
                    <Trash2 size={12} /> Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="bg-surface-container-lowest dark:bg-surface-dim rounded-xl p-4 border border-outline-variant/20 mb-6">
            <div className="flex justify-between mb-2">
              <span className="font-body-md text-body-md text-on-surface-variant dark:text-outline-variant">Subtotal</span>
              <span className="font-body-md text-body-md text-on-surface dark:text-primary-fixed">{formatUGX(subtotal)}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="font-body-md text-body-md text-on-surface-variant dark:text-outline-variant">Delivery Fee</span>
              <span className="font-body-md text-body-md text-on-surface dark:text-outline-variant">{formatUGX(DELIVERY_FEE)}</span>
            </div>
            <div className="flex justify-between pt-2 mt-2 border-t border-outline-variant/20">
              <span className="font-label-lg text-label-lg text-on-surface dark:text-primary-fixed">Total</span>
              <span className="font-label-lg text-label-lg text-primary dark:text-primary-fixed">{formatUGX(grandTotal)}</span>
            </div>
          </div>
          <button onClick={() => setStep("details")} className="w-full py-4 bg-primary text-on-primary rounded-xl font-label-lg text-label-lg hover:bg-primary/90 transition-colors dark:bg-primary-fixed dark:text-on-primary-fixed">
            Proceed to Checkout
          </button>
        </>
      )}
    </div>
  )
}
