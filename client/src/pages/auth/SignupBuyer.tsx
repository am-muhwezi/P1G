import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { Eye, EyeOff } from "lucide-react"
import { useAuth } from "../../store/auth"
import { Button } from "../../components/ui/Button"
import { UGANDAN_DISTRICTS } from "../../lib/data"

const API = import.meta.env.VITE_API_URL

export function SignupBuyer() {
  const [form, setForm] = useState({ name: "", email: "", phone: "+256 7", password: "", district: "" })
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const login = useAuth((s) => s.login)
  const navigate = useNavigate()

  const update = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [field]: e.target.value }))

  const handlePhone = (e: React.ChangeEvent<HTMLInputElement>) => {
    const cleaned = e.target.value.replace(/[^\d+]/g, "")
    if (!cleaned.startsWith("+256")) { setForm((f) => ({ ...f, phone: "+256 7" })); return }
    const digits = cleaned.slice(4)
    setForm((f) => ({ ...f, phone: `+256 ${digits}` }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)
    try {
      const res = await fetch(`${API}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, role: "buyer" }),
      })
      if (!res.ok) {
        const msg = res.status === 409 ? "Email already registered" : "Something went wrong"
        throw new Error(msg)
      }
      const data = await res.json()
      login(data.role, data.id, data.name, data.token, data.email)
      navigate("/buyer", { replace: true })
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-surface dark:bg-background flex items-center justify-center px-margin-mobile">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <img src="/logo.png" alt="P1G katale" className="h-14 w-14 mx-auto rounded-full" />
          <h1 className="font-headline-lg text-headline-lg text-primary mt-2 dark:text-primary-fixed">
            Join as a Buyer
          </h1>
          <p className="text-on-surface-variant font-body-md text-body-md dark:text-outline-variant">
            Find the best pork and live pigs near you
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-stack-md">
          <div>
            <label className="font-label-sm text-label-sm text-on-surface dark:text-primary-fixed block mb-1">
              Full Name
            </label>
            <input
              className="w-full px-4 py-3 bg-warm-beige border-none rounded-xl focus:ring-2 focus:ring-secondary text-body-md dark:bg-surface-dim dark:text-primary-fixed dark:placeholder:text-outline"
              placeholder="John Buyer"
              value={form.name}
              onChange={update("name")}
              required
            />
          </div>
          <div>
            <label className="font-label-sm text-label-sm text-on-surface dark:text-primary-fixed block mb-1">
              Email
            </label>
            <input
              className="w-full px-4 py-3 bg-warm-beige border-none rounded-xl focus:ring-2 focus:ring-secondary text-body-md dark:bg-surface-dim dark:text-primary-fixed dark:placeholder:text-outline"
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={update("email")}
              required
            />
          </div>
          <div>
            <label className="font-label-sm text-label-sm text-on-surface dark:text-primary-fixed block mb-1">
              Phone
            </label>
              <input
                className="w-full px-4 py-3 bg-warm-beige border-none rounded-xl focus:ring-2 focus:ring-secondary text-body-md dark:bg-surface-dim dark:text-primary-fixed dark:placeholder:text-outline"
                type="tel"
                placeholder="+256 712 345 678"
                value={form.phone}
                onChange={handlePhone}
                required
              />
          </div>
          <div>
            <label className="font-label-sm text-label-sm text-on-surface dark:text-primary-fixed block mb-1">
              District
            </label>
            <select
              className="w-full px-4 py-3 bg-warm-beige border-none rounded-xl focus:ring-2 focus:ring-secondary text-body-md dark:bg-surface-dim dark:text-primary-fixed appearance-none"
              value={form.district}
              onChange={update("district")}
              required
            >
              <option value="">Select district</option>
              {UGANDAN_DISTRICTS.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="font-label-sm text-label-sm text-on-surface dark:text-primary-fixed block mb-1">
              Password
            </label>
            <div className="relative">
              <input
                className="w-full px-4 py-3 pr-12 bg-warm-beige border-none rounded-xl focus:ring-2 focus:ring-secondary text-body-md dark:bg-surface-dim dark:text-primary-fixed dark:placeholder:text-outline"
                type={showPassword ? "text" : "password"}
                placeholder="At least 6 characters"
                value={form.password}
                onChange={update("password")}
                minLength={6}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
          {error && <p className="font-label-sm text-label-sm text-error">{error}</p>}
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Creating account..." : "Create Account"}
          </Button>
        </form>

        <div className="mt-stack-lg text-center">
          <p className="text-on-surface-variant font-body-md text-body-md dark:text-outline-variant">
            Already have an account?{" "}
            <Link to="/login" className="text-primary hover:underline dark:text-primary-fixed font-label-lg">
              Sign in
            </Link>
          </p>
          <p className="text-on-surface-variant font-body-md text-body-md mt-stack-sm dark:text-outline-variant">
            Are you a farmer?{" "}
            <Link to="/signup/seller" className="text-primary hover:underline dark:text-primary-fixed font-label-lg">
              Sign up as a Seller
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}