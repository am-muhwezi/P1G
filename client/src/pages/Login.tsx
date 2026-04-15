import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/store/auth"
import { DEMO_ACCOUNTS } from "@/lib/data"
import { Eye, EyeOff, AlertCircle } from "lucide-react"

export default function Login() {
  const navigate = useNavigate()
  const login = useAuth(s => s.login)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPw, setShowPw] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)
    await new Promise(r => setTimeout(r, 800))

    const account = Object.values(DEMO_ACCOUNTS).find(a => a.email === email && a.password === password)
    if (!account) {
      setError("Invalid email or password. Try the demo credentials below.")
      setLoading(false)
      return
    }
    login(account.role, account.userId, account.name)
    if (account.role === "admin")  navigate("/admin")
    else if (account.role === "seller") navigate("/seller")
    else navigate("/buyer")
  }

  const quickLogin = (key: keyof typeof DEMO_ACCOUNTS) => {
    const a = DEMO_ACCOUNTS[key]
    login(a.role, a.userId, a.name)
    if (a.role === "admin") navigate("/admin")
    else if (a.role === "seller") navigate("/seller")
    else navigate("/buyer")
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1A3F1A] to-[#2D6A2D] flex flex-col items-center justify-center px-4 py-12">
      {/* Logo */}
      <Link to="/" className="flex items-center gap-2 mb-8">
        <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center text-2xl">🐷</div>
        <div className="text-left">
          <div className="font-bold text-white text-xl leading-none">P1G Market</div>
          <div className="text-white/60 text-xs mt-0.5">Uganda's #1 Piggery Marketplace</div>
        </div>
      </Link>

      {/* Card */}
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Welcome Back</h1>
        <p className="text-gray-500 text-sm mb-6">Log in to your account to continue</p>

        {error && (
          <div className="flex items-start gap-2 bg-red-50 text-red-700 text-sm px-4 py-3 rounded-xl mb-5 border border-red-100">
            <AlertCircle size={16} className="mt-0.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="email" className="text-sm font-medium text-gray-700">Email or Phone Number</Label>
            <Input
              id="email"
              type="email"
              placeholder="e.g. buyer@p1gmarket.ug"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="h-11 rounded-xl border-gray-200 focus:ring-green-500/30"
              required
            />
          </div>
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label htmlFor="password" className="text-sm font-medium text-gray-700">Password</Label>
              <a href="#" className="text-xs text-green-700 hover:underline">Forgot Password?</a>
            </div>
            <div className="relative">
              <Input
                id="password"
                type={showPw ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="h-11 rounded-xl border-gray-200 pr-10"
                required
              />
              <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-3 text-gray-400 hover:text-gray-600">
                {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
          <Button type="submit" disabled={loading} className="w-full h-11 bg-green-700 hover:bg-green-800 text-white rounded-xl font-semibold">
            {loading ? "Logging in…" : "Log In"}
          </Button>
        </form>

        <div className="relative my-5">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-100" /></div>
          <div className="relative flex justify-center"><span className="bg-white px-3 text-xs text-gray-400">Quick demo access</span></div>
        </div>

        {/* Demo quick login */}
        <div className="grid grid-cols-3 gap-2">
          {(["buyer", "seller", "admin"] as const).map(role => (
            <button
              key={role}
              onClick={() => quickLogin(role)}
              className="flex flex-col items-center gap-1 py-3 rounded-xl border border-gray-100 hover:bg-gray-50 hover:border-green-200 transition-all"
            >
              <span className="text-lg">{role === "buyer" ? "🛒" : role === "seller" ? "🏪" : "🛡️"}</span>
              <span className="text-xs font-semibold text-gray-700 capitalize">{role}</span>
            </button>
          ))}
        </div>

        <p className="text-center text-sm text-gray-500 mt-5">
          Don't have an account?{" "}
          <Link to="/signup" className="text-amber-600 font-semibold hover:underline">Sign Up</Link>
        </p>
        <p className="text-center text-xs text-gray-400 mt-2">
          Sellers and buyers use the same login — your dashboard adapts to your role.
        </p>
      </div>
    </div>
  )
}
