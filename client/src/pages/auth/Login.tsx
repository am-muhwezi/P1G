import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../../store/auth"
import { DEMO_ACCOUNTS, MOCK_USERS } from "../../lib/data"
import { Button } from "../../components/ui/Button"

export function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const login = useAuth((s) => s.login)
  const navigate = useNavigate()

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    const found = DEMO_ACCOUNTS.find((a) => a.email === email && a.password === password)
    if (found) {
      const user = MOCK_USERS.find((u) => u.email === found.email)
      login(found.role, user?.id ?? found.email, found.name)
      const base = found.role === "seller" ? "/seller" : found.role === "admin" ? "/admin" : "/buyer"
      navigate(base, { replace: true })
    } else {
      setError("Invalid email or password")
    }
  }

  const quickLogin = (demo: (typeof DEMO_ACCOUNTS)[number]) => {
    const user = MOCK_USERS.find((u) => u.email === demo.email)
    login(demo.role, user?.id ?? demo.email, demo.name)
    const base = demo.role === "seller" ? "/seller" : demo.role === "admin" ? "/admin" : "/buyer"
    navigate(base, { replace: true })
  }

  const roleLabel = (r: string) => r.charAt(0).toUpperCase() + r.slice(1)

  return (
    <div className="min-h-screen bg-surface dark:bg-background flex items-center justify-center px-margin-mobile">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <img src="/logo.png" alt="P1G Kataale" className="h-16 w-16 mx-auto rounded-full" />
          <h1 className="font-headline-lg text-headline-lg text-primary mt-2 dark:text-primary-fixed">P1G Kataale</h1>
          <p className="text-on-surface-variant font-body-md text-body-md dark:text-outline-variant">
            Sign in to your account
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-stack-md mb-stack-lg">
          <div>
            <label className="font-label-sm text-label-sm text-on-surface dark:text-primary-fixed block mb-1">Email</label>
            <input
              className="w-full px-4 py-3 bg-warm-beige border-none rounded-xl focus:ring-2 focus:ring-primary text-body-md dark:bg-surface-dim dark:text-primary-fixed dark:placeholder:text-outline"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="font-label-sm text-label-sm text-on-surface dark:text-primary-fixed block mb-1">Password</label>
            <input
              className="w-full px-4 py-3 bg-warm-beige border-none rounded-xl focus:ring-2 focus:ring-primary text-body-md dark:bg-surface-dim dark:text-primary-fixed dark:placeholder:text-outline"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {error && <p className="font-label-sm text-label-sm text-error">{error}</p>}
          <Button type="submit" className="w-full">Sign In</Button>
        </form>

        <div className="relative mb-stack-lg">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-outline-variant dark:border-outline" />
          </div>
          <div className="relative flex justify-center">
            <span className="bg-surface px-4 font-label-sm text-label-sm text-on-surface-variant dark:bg-background dark:text-outline-variant">
              Quick Demo Access
            </span>
          </div>
        </div>

        <div className="space-y-stack-sm">
          {DEMO_ACCOUNTS.map((demo) => (
            <button
              key={demo.role}
              onClick={() => quickLogin(demo)}
              className="w-full flex items-center gap-4 p-4 rounded-xl bg-surface-container-lowest border border-surface-container-high premium-card-shadow hover:border-primary transition-colors dark:bg-surface-dim dark:border-surface-container dark:hover:border-primary-fixed"
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm ${
                  demo.role === "seller" ? "bg-primary" : demo.role === "admin" ? "bg-tertiary-container" : "bg-secondary"
                }`}
              >
                {demo.role === "seller" ? "S" : demo.role === "admin" ? "A" : "B"}
              </div>
              <div className="flex-1 text-left">
                <p className="font-label-lg text-label-lg text-on-surface dark:text-primary-fixed">{demo.name}</p>
                <p className="font-label-sm text-label-sm text-on-surface-variant dark:text-outline-variant">{demo.email}</p>
              </div>
              <span className="font-label-sm text-label-sm px-3 py-1 rounded-full bg-surface-container text-on-surface-variant dark:bg-surface-container dark:text-outline-variant">
                {roleLabel(demo.role)}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
