import { useState, useEffect } from "react"
import { useAuth } from "../../store/auth"
import { useTheme } from "../../context/ThemeContext"
import { useNavigate } from "react-router-dom"
import { Sun, Moon, Shield, LogOut, Mail, MapPin, Calendar } from "lucide-react"
import { api } from "../../lib/api"
import { formatUGX, type Order } from "../../lib/data"

function formatMemberSince(iso: string | null): string | null {
  if (!iso) return null
  const d = new Date(iso)
  if (isNaN(d.getTime())) return null
  return d.toLocaleDateString("en-UG", { year: "numeric", month: "short" })
}

export function BuyerProfile() {
  const auth = useAuth()
  const { theme, toggleTheme } = useTheme()
  const navigate = useNavigate()
  const [orders, setOrders] = useState<Order[]>([])

  useEffect(() => {
    api.get("/api/orders").then(setOrders).catch(() => {})
  }, [])

  const totalSpent = orders.reduce((s, o) => s + o.total, 0)
  const deliveredCount = orders.filter((o) => o.status === "delivered").length
  const memberSince = formatMemberSince(auth.createdAt)

  return (
    <div className="p-4">
      <div className="mb-6">
        <h1 className="font-headline-lg text-headline-lg text-on-surface dark:text-primary-fixed mb-1">Profile</h1>
        <p className="text-on-surface-variant font-body-md text-body-md dark:text-outline-variant">
          Manage your account
        </p>
      </div>

      <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-surface-container-high overflow-hidden dark:bg-surface-dim dark:border-surface-container">
        <div className="p-6 text-center">
          <div className="w-20 h-20 rounded-full bg-primary-container/40 flex items-center justify-center text-primary text-3xl font-bold mx-auto mb-4 dark:bg-primary-fixed/20 dark:text-primary-fixed">
            {auth.name?.charAt(0)?.toUpperCase() || "U"}
          </div>
          <h2 className="font-headline-md text-headline-md text-on-surface dark:text-primary-fixed">{auth.name}</h2>
          <p className="text-label-sm text-on-surface-variant dark:text-outline-variant capitalize">{auth.role}</p>
        </div>

        <div className="grid grid-cols-3 gap-px bg-outline-variant/20 dark:bg-surface-container">
          <div className="bg-surface-container-lowest dark:bg-surface-dim p-4 text-center">
            <p className="font-headline-md text-headline-md text-on-surface dark:text-primary-fixed">{orders.length}</p>
            <p className="text-label-sm text-on-surface-variant dark:text-outline-variant">Orders</p>
          </div>
          <div className="bg-surface-container-lowest dark:bg-surface-dim p-4 text-center">
            <p className="font-headline-md text-headline-md text-on-surface dark:text-primary-fixed">{formatUGX(totalSpent)}</p>
            <p className="text-label-sm text-on-surface-variant dark:text-outline-variant">Spent</p>
          </div>
          <div className="bg-surface-container-lowest dark:bg-surface-dim p-4 text-center">
            <p className="font-headline-md text-headline-md text-on-surface dark:text-primary-fixed">{deliveredCount}</p>
            <p className="text-label-sm text-on-surface-variant dark:text-outline-variant">Delivered</p>
          </div>
        </div>

        <div className="border-t border-outline-variant/20 dark:border-surface-container">
          <div className="px-6 py-4 space-y-4">
            <div className="flex items-center gap-3">
              <Mail size={18} className="text-on-surface-variant dark:text-outline-variant" />
              <span className="font-body-md text-body-md text-on-surface dark:text-primary-fixed">{auth.email || "N/A"}</span>
            </div>
            {auth.district && (
              <div className="flex items-center gap-3">
                <MapPin size={18} className="text-on-surface-variant dark:text-outline-variant" />
                <span className="font-body-md text-body-md text-on-surface dark:text-primary-fixed">{auth.district}, Uganda</span>
              </div>
            )}
            {memberSince && (
              <div className="flex items-center gap-3">
                <Calendar size={18} className="text-on-surface-variant dark:text-outline-variant" />
                <span className="font-body-md text-body-md text-on-surface dark:text-primary-fixed">Member since {memberSince}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mt-4 bg-surface-container-lowest rounded-xl shadow-sm border border-surface-container-high dark:bg-surface-dim dark:border-surface-container">
        <div className="p-4 space-y-3">
          <div className="flex items-center justify-between py-2">
            <div className="flex items-center gap-3">
              {theme === "dark" ? <Moon size={20} className="text-on-surface-variant dark:text-outline-variant" /> : <Sun size={20} className="text-on-surface-variant" />}
              <span className="font-label-lg text-label-lg text-on-surface dark:text-primary-fixed">Dark Mode</span>
            </div>
            <button
              onClick={toggleTheme}
              className={`relative w-12 h-6 rounded-full transition-colors ${theme === "dark" ? "bg-primary" : "bg-outline-variant"}`}
            >
              <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${theme === "dark" ? "translate-x-6" : "translate-x-0.5"}`} />
            </button>
          </div>
          <div className="flex items-center gap-3 py-2">
            <Shield size={20} className="text-on-surface-variant dark:text-outline-variant" />
            <span className="font-label-lg text-label-lg text-on-surface dark:text-primary-fixed">Privacy & Security</span>
            <span className="ml-auto text-label-sm text-on-surface-variant dark:text-outline-variant">Coming soon</span>
          </div>
        </div>
      </div>

      <button
        onClick={() => { auth.logout(); navigate("/login") }}
        className="w-full flex items-center justify-center gap-3 py-4 mt-4 rounded-xl bg-surface-container-lowest shadow-sm border border-surface-container-high text-on-surface-variant hover:bg-error/5 hover:text-error transition-colors dark:bg-surface-dim dark:border-surface-container dark:text-outline-variant dark:hover:text-error"
      >
        <LogOut size={20} />
        <span className="font-label-lg text-label-lg">Sign Out</span>
      </button>
    </div>
  )
}
