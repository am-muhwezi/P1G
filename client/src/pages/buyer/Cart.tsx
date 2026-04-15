import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { AppShell, BuyerTopBar } from "@/components/layout/AppShell"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useCart } from "@/store/cart"
import { formatUGX } from "@/lib/data"
import { Trash2, Plus, Minus, ShoppingCart } from "lucide-react"
import { toast } from "sonner"

const DELIVERY_FEE = 25000

export default function Cart() {
  const navigate = useNavigate()
  const { items, removeItem, updateQty, total, clearCart } = useCart()
  const [step, setStep] = useState<"cart" | "checkout" | "success">("cart")
  const [paymentMethod, setPaymentMethod] = useState("mtn")
  const [phone, setPhone] = useState("")
  const [address, setAddress] = useState("Plot 14, Kampala Road, Wakiso District")
  const [loading, setLoading] = useState(false)

  const grandTotal = total() + DELIVERY_FEE

  const handlePlaceOrder = async () => {
    setLoading(true)
    await new Promise(r => setTimeout(r, 1500))
    clearCart()
    setStep("success")
    setLoading(false)
  }

  if (step === "success") {
    return (
      <AppShell>
        <BuyerTopBar />
        <div className="flex flex-col items-center justify-center min-h-[60vh] p-6 text-center">
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Order Placed!</h2>
          <p className="text-gray-500 text-sm mb-1">Your order has been successfully placed.</p>
          <p className="text-gray-500 text-sm mb-6">You'll receive an SMS confirmation shortly.</p>
          <div className="bg-green-50 border border-green-200 rounded-2xl px-6 py-4 mb-6">
            <p className="text-xs text-green-700 font-semibold">Order #ORD-{Date.now().toString().slice(-6)}</p>
            <p className="text-xs text-green-600 mt-1">Payment via {paymentMethod === "mtn" ? "MTN Mobile Money" : paymentMethod === "airtel" ? "Airtel Money" : "Cash on Delivery"}</p>
          </div>
          <Button onClick={() => navigate("/buyer/orders")} className="bg-green-700 hover:bg-green-800 text-white rounded-xl h-11 px-8">
            Track My Order
          </Button>
          <Button variant="ghost" onClick={() => navigate("/buyer")} className="mt-2 text-gray-500">Continue Shopping</Button>
        </div>
      </AppShell>
    )
  }

  return (
    <AppShell>
      <BuyerTopBar />
      <div className="p-4 lg:p-6 max-w-2xl mx-auto">
        {/* Steps */}
        <div className="flex items-center gap-3 mb-6">
          {["Cart", "Checkout"].map((s, i) => (
            <div key={s} className="flex items-center gap-3">
              <div className={`flex items-center gap-1.5 text-sm font-medium ${
                (step === "cart" && i === 0) || (step === "checkout" && i === 1)
                  ? "text-green-700" : "text-gray-400"
              }`}>
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                  (step === "cart" && i === 0) || (step === "checkout" && i === 1)
                    ? "bg-green-700 text-white" : "bg-gray-200 text-gray-400"
                }`}>{i + 1}</div>
                {s}
              </div>
              {i === 0 && <div className="h-0.5 w-8 bg-gray-200" />}
            </div>
          ))}
        </div>

        {step === "cart" && (
          <>
            <h1 className="text-xl font-bold text-gray-900 mb-4">My Cart ({items.length})</h1>

            {items.length === 0 ? (
              <div className="text-center py-20 text-gray-400">
                <ShoppingCart size={40} className="mx-auto mb-3 opacity-30" />
                <p className="font-medium">Your cart is empty</p>
                <Button className="mt-4 bg-green-700 hover:bg-green-800 text-white rounded-xl" onClick={() => navigate("/buyer")}>
                  Browse Marketplace
                </Button>
              </div>
            ) : (
              <>
                <div className="space-y-3 mb-5">
                  {items.map(item => (
                    <div key={item.listingId} className="bg-white rounded-2xl border border-gray-100 p-4 flex items-center gap-3">
                      <div className="w-14 h-14 rounded-xl bg-green-50 flex items-center justify-center text-2xl shrink-0">🐷</div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-900 line-clamp-1">{item.title}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{item.sellerName} • per {item.unit}</p>
                        <p className="text-sm font-bold text-green-700 mt-1">{formatUGX(item.price)}</p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <button onClick={() => updateQty(item.listingId, item.quantity - 1)} className="w-7 h-7 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center">
                          <Minus size={12} />
                        </button>
                        <span className="text-sm font-semibold w-5 text-center">{item.quantity}</span>
                        <button onClick={() => updateQty(item.listingId, item.quantity + 1)} className="w-7 h-7 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center">
                          <Plus size={12} />
                        </button>
                        <button onClick={() => { removeItem(item.listingId); toast.success("Removed from cart") }} className="w-7 h-7 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 flex items-center justify-center ml-1">
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="bg-white rounded-2xl border border-gray-100 p-4 mb-5">
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between text-gray-600"><span>Subtotal</span><span>{formatUGX(total())}</span></div>
                    <div className="flex justify-between text-gray-600"><span>Delivery fee</span><span>{formatUGX(DELIVERY_FEE)}</span></div>
                    <div className="flex justify-between font-bold text-gray-900 text-base pt-2 border-t border-gray-100">
                      <span>Total</span><span className="text-green-700">{formatUGX(grandTotal)}</span>
                    </div>
                  </div>
                </div>

                <Button onClick={() => setStep("checkout")} className="w-full h-12 bg-green-700 hover:bg-green-800 text-white rounded-xl font-semibold text-base">
                  Proceed to Checkout
                </Button>
              </>
            )}
          </>
        )}

        {step === "checkout" && (
          <>
            <h1 className="text-xl font-bold text-gray-900 mb-4">Checkout</h1>

            {/* Order summary */}
            <div className="bg-gray-50 rounded-2xl p-4 mb-4">
              <h3 className="text-sm font-semibold text-gray-700 mb-2">Order Summary</h3>
              {items.map(item => (
                <div key={item.listingId} className="flex justify-between text-sm text-gray-600 mb-1">
                  <span className="truncate pr-4">{item.title} ×{item.quantity}</span>
                  <span className="shrink-0 font-medium">{formatUGX(item.price * item.quantity)}</span>
                </div>
              ))}
              <div className="border-t border-gray-200 mt-2 pt-2 flex justify-between font-bold text-gray-900">
                <span>Total</span><span className="text-green-700">{formatUGX(grandTotal)}</span>
              </div>
            </div>

            {/* Delivery address */}
            <div className="bg-white rounded-2xl border border-gray-100 p-4 mb-4">
              <Label className="text-sm font-semibold text-gray-700 block mb-2">Delivery Address</Label>
              <Input value={address} onChange={e => setAddress(e.target.value)} className="rounded-xl border-gray-200 text-sm" />
            </div>

            {/* Payment */}
            <div className="bg-white rounded-2xl border border-gray-100 p-4 mb-5">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Payment Method</h3>
              <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="space-y-2">
                {[
                  { value: "mtn", label: "MTN Mobile Money", icon: "🟡", color: "text-yellow-600" },
                  { value: "airtel", label: "Airtel Money", icon: "🔴", color: "text-red-600" },
                  { value: "bank", label: "Bank Transfer", icon: "🏦", color: "text-blue-600" },
                  { value: "cod", label: "Cash on Delivery", icon: "💵", color: "text-green-600" },
                ].map(opt => (
                  <div key={opt.value} className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${paymentMethod === opt.value ? "border-green-700 bg-green-50" : "border-gray-100 hover:border-green-200"}`}>
                    <RadioGroupItem value={opt.value} id={opt.value} />
                    <label htmlFor={opt.value} className="flex items-center gap-2 cursor-pointer flex-1">
                      <span>{opt.icon}</span>
                      <span className={`text-sm font-medium ${opt.color}`}>{opt.label}</span>
                    </label>
                  </div>
                ))}
              </RadioGroup>

              {(paymentMethod === "mtn" || paymentMethod === "airtel") && (
                <div className="mt-3">
                  <Label className="text-xs text-gray-600 mb-1.5 block">Mobile Money Number</Label>
                  <Input
                    placeholder="e.g. 0772 345 678"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    className="rounded-xl border-gray-200 text-sm"
                  />
                </div>
              )}
            </div>

            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setStep("cart")} className="flex-1 h-12 rounded-xl">Back</Button>
              <Button onClick={handlePlaceOrder} disabled={loading} className="flex-1 h-12 bg-green-700 hover:bg-green-800 text-white rounded-xl font-semibold">
                {loading ? "Placing Order…" : "Place Order"}
              </Button>
            </div>
          </>
        )}
      </div>
    </AppShell>
  )
}
