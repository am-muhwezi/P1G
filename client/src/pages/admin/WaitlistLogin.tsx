import { useState } from "react"
import { ShieldCheck, Lock, AlertCircle } from "lucide-react"

const API_BASE = "http://localhost:8000"
const AUTH_STORAGE_KEY = "p1g-waitlist-password"
const PW_STORAGE_KEY = "p1g-waitlist-admin-pw"

interface Props {
  onAuth: () => void
}

export function WaitlistLogin({ onAuth }: Props) {
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [serverDown, setServerDown] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setServerDown(false)
    if (!password.trim()) { setError("Enter a password"); return }

    setLoading(true)
    try {
      const res = await fetch(`${API_BASE}/api/waitlist/auth`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      })
      if (res.ok) {
        localStorage.setItem(PW_STORAGE_KEY, password)
        localStorage.setItem(AUTH_STORAGE_KEY, "true")
        onAuth()
      } else if (res.status === 403) {
        setError("Incorrect password")
      } else {
        setError("Server error — try again")
      }
    } catch {
      setServerDown(true)
      setError("Cannot reach server")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-surface dark:bg-background flex items-center justify-center px-5">
      <div className="w-full max-w-sm text-center">
        <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
          <ShieldCheck size={32} className="text-primary" />
        </div>
        <h1 className="font-headline-lg text-headline-lg text-on-surface mb-2 dark:text-primary-fixed">Admin Access</h1>
        <p className="text-on-surface-variant text-body-md mb-8 dark:text-outline-variant">
          Enter the waitlist admin password
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <Lock size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant" />
            <input
              type="password"
              placeholder="Password"
              className="w-full pl-10 pr-4 py-3 bg-warm-beige rounded-xl text-body-md text-on-surface placeholder:text-outline focus:ring-2 focus:ring-primary outline-none border-none dark:bg-surface-dim dark:text-primary-fixed"
              value={password}
              onChange={e => setPassword(e.target.value)}
              autoFocus
            />
          </div>
          {error && (
            <div className={`flex items-center gap-2 text-sm text-left ${serverDown ? "text-amber-600" : "text-red-600 dark:text-red-400"}`}>
              <AlertCircle size={14} />
              <span>{error}</span>
            </div>
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-on-primary font-label-lg text-label-lg py-3.5 rounded-xl hover:bg-primary/90 transition-all active:scale-95 shadow-md disabled:opacity-50"
          >
            {loading ? "Verifying..." : "Unlock Dashboard"}
          </button>
        </form>
      </div>
    </div>
  )
}
