import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { useAuth } from "@/store/auth"
import { CheckCircle2, AlertCircle } from "lucide-react"

type Step = 1 | 2 | 3
type RoleChoice = "buyer" | "seller"

export default function Signup() {
  const navigate = useNavigate()
  const login = useAuth(s => s.login)
  const [step, setStep] = useState<Step>(1)
  const [role, setRole] = useState<RoleChoice | null>(null)
  const [form, setForm] = useState({ name: "", email: "", phone: "", district: "", password: "" })
  const [loading, setLoading] = useState(false)

  const handleNext = async () => {
    if (step === 2) {
      setStep(3)
    } else if (step === 3) {
      setLoading(true)
      await new Promise(r => setTimeout(r, 1000))
      login(role!, "new-user", form.name || "New User")
      if (role === "buyer") navigate("/buyer")
      else navigate("/seller")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1A3F1A] to-[#2D6A2D] flex flex-col items-center justify-center px-4 py-12">
      <Link to="/" className="flex items-center gap-2 mb-8">
        <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center text-2xl">🐷</div>
        <div>
          <div className="font-bold text-white text-xl leading-none">P1G Market</div>
          <div className="text-white/60 text-xs mt-0.5">Uganda's #1 Piggery Marketplace</div>
        </div>
      </Link>

      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8">
        {/* Progress */}
        <div className="flex items-center gap-2 mb-7">
          {[1, 2, 3].map(n => (
            <div key={n} className="flex items-center gap-2 flex-1 last:flex-none">
              <div className={cn("w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold",
                step > n ? "bg-green-700 text-white" : step === n ? "bg-green-700 text-white" : "bg-gray-100 text-gray-400"
              )}>
                {step > n ? <CheckCircle2 size={14} /> : n}
              </div>
              {n < 3 && <div className={cn("flex-1 h-0.5", step > n ? "bg-green-700" : "bg-gray-100")} />}
            </div>
          ))}
        </div>

        {/* Step 1 — Role */}
        {step === 1 && (
          <>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">Create Your Account</h1>
            <p className="text-gray-500 text-sm mb-6">Join thousands of farmers and sellers across Uganda</p>
            <p className="text-sm font-semibold text-gray-700 mb-3">I want to…</p>
            <div className="grid grid-cols-2 gap-3 mb-6">
              {([
                { r: "buyer" as const, icon: "🛒", title: "Buy Products", desc: "Browse and purchase pigs, feed, medicines & more" },
                { r: "seller" as const, icon: "🏪", title: "Sell Products", desc: "List and sell your products to farmers nationwide" },
              ]).map(opt => (
                <button
                  key={opt.r}
                  onClick={() => setRole(opt.r)}
                  className={cn(
                    "flex flex-col items-center gap-2 p-5 rounded-2xl border-2 transition-all text-left",
                    role === opt.r
                      ? "border-green-700 bg-green-50"
                      : "border-gray-100 hover:border-green-200 bg-gray-50"
                  )}
                >
                  <span className="text-3xl">{opt.icon}</span>
                  <span className="text-sm font-bold text-gray-900">{opt.title}</span>
                  <span className="text-xs text-gray-500 text-center leading-snug">{opt.desc}</span>
                  {role === opt.r && <CheckCircle2 size={18} className="text-green-700" />}
                </button>
              ))}
            </div>
            {role === "seller" && (
              <div className="flex items-start gap-2 bg-amber-50 text-amber-800 text-xs px-3 py-2.5 rounded-xl mb-4 border border-amber-100">
                <AlertCircle size={14} className="mt-0.5 shrink-0" />
                Seller accounts require admin approval. You'll be notified within 24 hours.
              </div>
            )}
            <Button disabled={!role} onClick={() => setStep(2)} className="w-full h-11 bg-green-700 hover:bg-green-800 text-white rounded-xl font-semibold">
              Continue
            </Button>
          </>
        )}

        {/* Step 2 — Details */}
        {step === 2 && (
          <>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">Your Details</h1>
            <p className="text-gray-500 text-sm mb-6">Fill in your basic information</p>
            <div className="space-y-4">
              {[
                { key: "name", label: "Full Name", placeholder: "e.g. John Mukasa", type: "text" },
                { key: "email", label: "Email Address", placeholder: "john@example.com", type: "email" },
                { key: "phone", label: "Phone Number", placeholder: "e.g. 0772 345 678", type: "tel" },
                { key: "district", label: "District", placeholder: "e.g. Kampala", type: "text" },
                { key: "password", label: "Create Password", placeholder: "At least 8 characters", type: "password" },
              ].map(f => (
                <div key={f.key} className="space-y-1.5">
                  <Label className="text-sm font-medium text-gray-700">{f.label}</Label>
                  <Input
                    type={f.type}
                    placeholder={f.placeholder}
                    value={form[f.key as keyof typeof form]}
                    onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                    className="h-11 rounded-xl border-gray-200"
                  />
                </div>
              ))}
            </div>
            <div className="flex gap-3 mt-6">
              <Button variant="outline" onClick={() => setStep(1)} className="flex-1 h-11 rounded-xl">Back</Button>
              <Button onClick={handleNext} className="flex-2 flex-1 h-11 bg-green-700 hover:bg-green-800 text-white rounded-xl font-semibold">Continue</Button>
            </div>
          </>
        )}

        {/* Step 3 — Confirm */}
        {step === 3 && (
          <>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">Almost Done!</h1>
            <p className="text-gray-500 text-sm mb-6">Review and confirm your account</p>
            <div className="bg-gray-50 rounded-2xl p-4 space-y-3 mb-6 text-sm">
              <div className="flex justify-between"><span className="text-gray-500">Account type</span><span className="font-semibold capitalize text-green-700">{role}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Name</span><span className="font-semibold">{form.name || "—"}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Email</span><span className="font-semibold">{form.email || "—"}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Phone</span><span className="font-semibold">{form.phone || "—"}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">District</span><span className="font-semibold">{form.district || "—"}</span></div>
            </div>
            {role === "seller" && (
              <div className="flex items-start gap-2 bg-blue-50 text-blue-800 text-xs px-3 py-3 rounded-xl mb-5 border border-blue-100">
                <AlertCircle size={14} className="mt-0.5 shrink-0" />
                Your seller account will be reviewed by our admin team within 24 hours. You'll receive a confirmation SMS/email once approved.
              </div>
            )}
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setStep(2)} className="flex-1 h-11 rounded-xl">Back</Button>
              <Button onClick={handleNext} disabled={loading} className="flex-1 h-11 bg-green-700 hover:bg-green-800 text-white rounded-xl font-semibold">
                {loading ? "Creating account…" : "Create Account"}
              </Button>
            </div>
          </>
        )}

        <p className="text-center text-sm text-gray-500 mt-5">
          Already have an account?{" "}
          <Link to="/login" className="text-amber-600 font-semibold hover:underline">Log In</Link>
        </p>
      </div>
    </div>
  )
}
