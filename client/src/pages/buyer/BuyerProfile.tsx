import { useState } from "react"
import { useAuth } from "../../store/auth"
import { useTheme } from "../../context/ThemeContext"
import { useNavigate } from "react-router-dom"
import { Sun, Moon, Bell, Shield, LogOut, Mail, MapPin, Calendar, Smartphone } from "lucide-react"
import { MOCK_USERS, MOCK_ORDERS, formatUGX } from "../../lib/data"

export function BuyerProfile() {
  const auth = useAuth()
  const { theme, toggleTheme } = useTheme()
  const navigate = useNavigate()
  const user = MOCK_USERS.find((u) => u.id === auth.userId)
  const userName = auth.name || "John Buyer"
  const userOrders = MOCK_ORDERS.filter((o) => o.buyerName === userName)
  const totalSpent = userOrders.reduce((s, o) => s + o.total, 0)
  const deliveredCount = userOrders.filter((o) => o.status === "delivered").length
  const [orderNotify, setOrderNotify] = useState(true)
  const [promoNotify, setPromoNotify] = useState(false)

  const toggleClass = (on: boolean) =>
    `relative w-12 h-6 rounded-full transition-colors ${on ? "bg-primary dark:bg-primary-fixed" : "bg-outline-variant dark:bg-surface-container-highest"}`
  const dotClass = (on: boolean) =>
    `absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${on ? "translate-x-6" : "translate-x-0.5"}`

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
            <p className="font-headline-md text-headline-md text-on-surface dark:text-primary-fixed">{userOrders.length}</p>
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
              <span className="font-body-md text-body-md text-on-surface dark:text-primary-fixed">{user?.email || auth.userId + "@example.com"}</span>
            </div>
            <div className="flex items-center gap-3">
              <MapPin size={18} className="text-on-surface-variant dark:text-outline-variant" />
              <span className="font-body-md text-body-md text-on-surface dark:text-primary-fixed">{user?.district || "Kampala, Uganda"}</span>
            </div>
            <div className="flex items-center gap-3">
              <Calendar size={18} className="text-on-surface-variant dark:text-outline-variant" />
              <span className="font-body-md text-body-md text-on-surface dark:text-primary-fixed">Joined {user?.joinedAt ? new Date(user.joinedAt).toLocaleDateString("en-UG", { year: "numeric", month: "long" }) : "January 2025"}</span>
            </div>
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
          <div className="flex items-center justify-between py-2">
            <div className="flex items-center gap-3">
              <Bell size={20} className="text-on-surface-variant dark:text-outline-variant" />
              <span className="font-label-lg text-label-lg text-on-surface dark:text-primary-fixed">Order Updates</span>
            </div>
            <button onClick={() => setOrderNotify(!orderNotify)} className={toggleClass(orderNotify)}>
              <div className={dotClass(orderNotify)} />
            </button>
          </div>
          <div className="flex items-center justify-between py-2">
            <div className="flex items-center gap-3">
              <Smartphone size={20} className="text-on-surface-variant dark:text-outline-variant" />
              <span className="font-label-lg text-label-lg text-on-surface dark:text-primary-fixed">Promotions</span>
            </div>
            <button onClick={() => setPromoNotify(!promoNotify)} className={toggleClass(promoNotify)}>
              <div className={dotClass(promoNotify)} />
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
