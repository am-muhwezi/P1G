import { useState } from "react"
import { X, Eye, EyeOff } from "lucide-react"
import { api } from "../../lib/api"
import { useAuth } from "../../store/auth"
import { Button } from "../ui/Button"
import { GlassCard } from "../ui/GlassCard"
import { UGANDAN_DISTRICTS } from "../../lib/data"

type Mode = "login" | "signup"

interface CheckoutAuthGateProps {
  open: boolean
  onClose: () => void
  onAuthenticated: () => void
}

export function CheckoutAuthGate({ open, onClose, onAuthenticated }: CheckoutAuthGateProps) {
  const login = useAuth((s) => s.login)
  const [mode, setMode] = useState<Mode>("login")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const [loginForm, setLoginForm] = useState({ email: "", password: "" })
  const [signupForm, setSignupForm] = useState({ name: "", email: "", phone: "+256 7", district: "", password: "" })

  if (!open) return null

  const switchMode = (next: Mode) => {
    setMode(next)
    setError("")
  }

  const handlePhone = (e: React.ChangeEvent<HTMLInputElement>) => {
    const cleaned = e.target.value.replace(/[^\d+]/g, "")
    if (!cleaned.startsWith("+256")) { setSignupForm((f) => ({ ...f, phone: "+256 7" })); return }
    setSignupForm((f) => ({ ...f, phone: `+256 ${cleaned.slice(4)}` }))
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)
    try {
      const data = await api.post("/api/auth/login", loginForm)
      login(data)
      onAuthenticated()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Invalid email or password")
    } finally {
      setLoading(false)
    }
  }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)
    try {
      const data = await api.post("/api/auth/register", { ...signupForm, role: "buyer" })
      login(data)
      onAuthenticated()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-white/10 dark:bg-black/30 backdrop-blur-md p-4"
      onClick={onClose}
    >
      <GlassCard className="w-full max-w-md shadow-xl" >
        <div className="p-6" onClick={(e) => e.stopPropagation()}>
          <div className="flex items-center justify-between mb-1">
            <h2 className="font-headline-md text-headline-md text-on-surface dark:text-primary-fixed">
              {mode === "login" ? "Log in to checkout" : "Create a buyer account"}
            </h2>
            <button onClick={onClose} className="text-on-surface-variant hover:text-on-surface dark:text-outline-variant dark:hover:text-primary-fixed">
              <X size={22} />
            </button>
          </div>
          <p className="text-label-sm text-on-surface-variant dark:text-outline-variant mb-5">
            Your cart is saved — {mode === "login" ? "log in" : "sign up"} and pick up right where you left off.
          </p>

          {mode === "login" ? (
            <form onSubmit={handleLogin} className="space-y-3">
              <input
                type="email"
                required
                placeholder="Email"
                value={loginForm.email}
                onChange={(e) => setLoginForm((f) => ({ ...f, email: e.target.value }))}
                className="w-full px-4 py-3 bg-warm-beige border-none rounded-xl focus:ring-2 focus:ring-primary text-body-md dark:bg-surface-dim dark:text-primary-fixed dark:placeholder:text-outline"
              />
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="Password"
                  value={loginForm.password}
                  onChange={(e) => setLoginForm((f) => ({ ...f, password: e.target.value }))}
                  className="w-full px-4 py-3 pr-12 bg-warm-beige border-none rounded-xl focus:ring-2 focus:ring-primary text-body-md dark:bg-surface-dim dark:text-primary-fixed dark:placeholder:text-outline"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {error && <p className="font-label-sm text-label-sm text-error">{error}</p>}
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Logging in..." : "Log In"}
              </Button>
            </form>
          ) : (
            <form onSubmit={handleSignup} className="space-y-3">
              <input
                required
                placeholder="Full name"
                value={signupForm.name}
                onChange={(e) => setSignupForm((f) => ({ ...f, name: e.target.value }))}
                className="w-full px-4 py-3 bg-warm-beige border-none rounded-xl focus:ring-2 focus:ring-primary text-body-md dark:bg-surface-dim dark:text-primary-fixed dark:placeholder:text-outline"
              />
              <input
                type="email"
                required
                placeholder="Email"
                value={signupForm.email}
                onChange={(e) => setSignupForm((f) => ({ ...f, email: e.target.value }))}
                className="w-full px-4 py-3 bg-warm-beige border-none rounded-xl focus:ring-2 focus:ring-primary text-body-md dark:bg-surface-dim dark:text-primary-fixed dark:placeholder:text-outline"
              />
              <input
                type="tel"
                required
                placeholder="+256 712 345 678"
                value={signupForm.phone}
                onChange={handlePhone}
                className="w-full px-4 py-3 bg-warm-beige border-none rounded-xl focus:ring-2 focus:ring-primary text-body-md dark:bg-surface-dim dark:text-primary-fixed dark:placeholder:text-outline"
              />
              <select
                required
                value={signupForm.district}
                onChange={(e) => setSignupForm((f) => ({ ...f, district: e.target.value }))}
                className="w-full px-4 py-3 bg-warm-beige border-none rounded-xl focus:ring-2 focus:ring-primary text-body-md dark:bg-surface-dim dark:text-primary-fixed appearance-none"
              >
                <option value="">Select district</option>
                {UGANDAN_DISTRICTS.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  minLength={6}
                  placeholder="Password (at least 6 characters)"
                  value={signupForm.password}
                  onChange={(e) => setSignupForm((f) => ({ ...f, password: e.target.value }))}
                  className="w-full px-4 py-3 pr-12 bg-warm-beige border-none rounded-xl focus:ring-2 focus:ring-primary text-body-md dark:bg-surface-dim dark:text-primary-fixed dark:placeholder:text-outline"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {error && <p className="font-label-sm text-label-sm text-error">{error}</p>}
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Creating account..." : "Create Account"}
              </Button>
            </form>
          )}

          <div className="mt-5 text-center">
            <button
              onClick={() => switchMode(mode === "login" ? "signup" : "login")}
              className="font-label-sm text-label-sm text-primary hover:underline dark:text-primary-fixed"
            >
              {mode === "login" ? "Need an account? Sign up" : "Already have an account? Log in"}
            </button>
          </div>
        </div>
      </GlassCard>
    </div>
  )
}
