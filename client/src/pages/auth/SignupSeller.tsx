import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { Eye, EyeOff } from "lucide-react"
import { useAuth } from "../../store/auth"
import { Button } from "../../components/ui/Button"
import { UGANDAN_DISTRICTS } from "../../lib/data"

const API = import.meta.env.VITE_API_URL

export function SignupSeller() {
  const [form, setForm] = useState({ farm_name: "", email: "", phone: "", password: "", district: "" })
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const login = useAuth((s) => s.login)
  const navigate = useNavigate()

  const update = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [field]: e.target.value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)
    try {
      const res = await fetch(`${API}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, name: form.farm_name, role: "seller" }),
      })
      if (!res.ok) {
        const msg = res.status === 409 ? "Email already registered" : "Something went wrong"
        throw new Error(msg)
      }
      const data = await res.json()
      login(data.role, data.id, data.name, data.token, data.email)
      navigate("/seller", { replace: true })
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 dark:from-surface-dim dark:to-background flex items-center justify-center px-margin-mobile">
      <div className="w-full max-w-lg">
        <div className="bg-white dark:bg-surface-dim rounded-2xl shadow-xl p-8 pb-10">
          <div className="text-center mb-8">
            <img src="/logo.png" alt="P1G katale" className="h-16 w-16 mx-auto rounded-full" />
            <h1 className="font-headline-lg text-headline-lg text-primary mt-3 dark:text-primary-fixed">
              Register Your Farm
            </h1>
            <p className="text-on-surface-variant font-body-md text-body-md dark:text-outline-variant">
              Sell pork and live pigs to buyers across Uganda
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-stack-md">
            <div>
              <label className="font-label-sm text-label-sm text-on-surface dark:text-primary-fixed block mb-1">
                Farm Name
              </label>
              <input
                className="w-full px-4 py-3 bg-warm-beige border-none rounded-xl focus:ring-2 focus:ring-primary text-body-md dark:bg-surface-container dark:text-primary-fixed dark:placeholder:text-outline"
                placeholder="Mukasa Farms"
                value={form.farm_name}
                onChange={update("farm_name")}
                required
              />
            </div>
            <div>
              <label className="font-label-sm text-label-sm text-on-surface dark:text-primary-fixed block mb-1">
                Email
              </label>
              <input
                className="w-full px-4 py-3 bg-warm-beige border-none rounded-xl focus:ring-2 focus:ring-primary text-body-md dark:bg-surface-container dark:text-primary-fixed dark:placeholder:text-outline"
                type="email"
                placeholder="farm@example.com"
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
                className="w-full px-4 py-3 bg-warm-beige border-none rounded-xl focus:ring-2 focus:ring-primary text-body-md dark:bg-surface-container dark:text-primary-fixed dark:placeholder:text-outline"
                type="tel"
                placeholder="0755 123 456"
                value={form.phone}
                onChange={update("phone")}
                required
              />
            </div>
            <div>
              <label className="font-label-sm text-label-sm text-on-surface dark:text-primary-fixed block mb-1">
                Farm District
              </label>
              <select
                className="w-full px-4 py-3 bg-warm-beige border-none rounded-xl focus:ring-2 focus:ring-primary text-body-md dark:bg-surface-container dark:text-primary-fixed appearance-none"
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
                className="w-full px-4 py-3 pr-12 bg-warm-beige border-none rounded-xl focus:ring-2 focus:ring-primary text-body-md dark:bg-surface-container dark:text-primary-fixed dark:placeholder:text-outline"
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
              {loading ? "Registering..." : "Register Farm"}
            </Button>
          </form>

          <div className="mt-stack-lg text-center space-y-stack-sm">
            <p className="text-on-surface-variant font-body-md text-body-md dark:text-outline-variant">
              Already registered?{" "}
              <Link to="/login" className="text-primary hover:underline dark:text-primary-fixed font-label-lg">
                Sign in
              </Link>
            </p>
            <p className="text-on-surface-variant font-body-md text-body-md dark:text-outline-variant">
              Looking to buy?{" "}
              <Link to="/signup/buyer" className="text-primary hover:underline dark:text-primary-fixed font-label-lg">
                Sign up as a Buyer
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}