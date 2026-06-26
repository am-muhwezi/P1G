import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { Eye, EyeOff } from "lucide-react"
import { useAuth } from "../../store/auth"
import { Button } from "../../components/ui/Button"

const API = import.meta.env.VITE_API_URL

export function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const login = useAuth((s) => s.login)
  const navigate = useNavigate()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)
    try {
      const res = await fetch(`${API}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })
      if (!res.ok) {
        const msg = res.status === 401 ? "Invalid email or password" : "Something went wrong"
        throw new Error(msg)
      }
      const data = await res.json()
      login(data.role, data.id, data.name, data.token, data.email, data.status)
      if (data.status === "suspended") {
        navigate("/suspended", { replace: true })
        return
      }
      const base = data.role === "seller" ? "/seller" : data.role === "admin" ? "/admin" : "/buyer"
      navigate(base, { replace: true })
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-surface dark:bg-background flex items-center justify-center px-margin-mobile">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <img src="/logo.png" alt="P1G katale" className="h-16 w-16 mx-auto rounded-full" />
          <h1 className="font-headline-lg text-headline-lg text-primary mt-2 dark:text-primary-fixed">P1G katale</h1>
          <p className="text-on-surface-variant font-body-md text-body-md dark:text-outline-variant">
            Sign in to your account
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-stack-md">
          <div>
            <label className="font-label-sm text-label-sm text-on-surface dark:text-primary-fixed block mb-1">Email</label>
            <input
              className="w-full px-4 py-3 bg-warm-beige border-none rounded-xl focus:ring-2 focus:ring-primary text-body-md dark:bg-surface-dim dark:text-primary-fixed dark:placeholder:text-outline"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="font-label-sm text-label-sm text-on-surface dark:text-primary-fixed block mb-1">Password</label>
            <div className="relative">
              <input
                className="w-full px-4 py-3 pr-12 bg-warm-beige border-none rounded-xl focus:ring-2 focus:ring-primary text-body-md dark:bg-surface-dim dark:text-primary-fixed dark:placeholder:text-outline"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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
            {loading ? "Signing in..." : "Sign In"}
          </Button>
        </form>

        <div className="mt-stack-lg text-center space-y-stack-sm">
          <p className="text-on-surface-variant font-body-md text-body-md dark:text-outline-variant">
            Don't have an account?
          </p>
          <div className="flex gap-3 justify-center">
            <Link
              to="/signup/buyer"
              className="font-label-lg text-label-lg text-primary hover:underline dark:text-primary-fixed"
            >
              Sign up as Buyer
            </Link>
            <span className="text-on-surface-variant dark:text-outline-variant">|</span>
            <Link
              to="/signup/seller"
              className="font-label-lg text-label-lg text-primary hover:underline dark:text-primary-fixed"
            >
              Sign up as Seller
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
