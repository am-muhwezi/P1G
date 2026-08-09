import { useState } from "react"
import { NavLink, Outlet, useNavigate } from "react-router-dom"
import { useTheme } from "../../context/ThemeContext"
import { useAuth } from "../../store/auth"
import { Home, ShoppingBag, User, ShoppingCart, Sun, Moon, LogOut, Menu, Bell, Search } from "lucide-react"
import { useCart } from "../../store/cart"

const BUYER_NAV = [
  { to: "/buyer", label: "Home", icon: <Home size={20} /> },
  { to: "/buyer/orders", label: "Orders", icon: <ShoppingBag size={20} /> },
  { to: "/buyer/cart", label: "Cart", icon: <ShoppingCart size={20} /> },
  { to: "/buyer/profile", label: "Profile", icon: <User size={20} /> },
]

export function BuyerLayout({ children }: { children?: React.ReactNode }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { theme, toggleTheme } = useTheme()
  const navigate = useNavigate()
  const auth = useAuth()
  const cartItems = useCart((s) => s.items)
  const totalQty = cartItems.reduce((s, i) => s + i.quantity, 0)

  return (
    <div className="min-h-screen bg-surface dark:bg-background">
      <aside className="fixed top-0 left-0 z-40 h-full w-60 bg-[#002114] flex-col hidden lg:flex">
        <div className="flex items-center gap-3 px-6 h-16 border-b border-white/10">
          <div className="h-8 w-8 rounded-full bg-white flex items-center justify-center overflow-hidden shrink-0">
            <img src="/logo.png" alt="P1G katale" className="h-7 w-7 object-contain" />
          </div>
          <span className="font-headline-md text-headline-md font-bold text-white">P1G katale</span>
        </div>
        <nav className="flex-1 px-3 py-6 space-y-1">
          {BUYER_NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/buyer"}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl font-label-lg text-label-lg transition-colors ${
                  isActive
                    ? "bg-white/10 text-white font-semibold"
                    : "text-white/70 hover:bg-white/5 hover:text-white"
                }`
              }
            >
              {item.icon}
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="p-4 border-t border-white/10">
          <div className="flex items-center gap-3 mb-3 px-2">
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white font-bold text-xs">
              {auth.name?.charAt(0)?.toUpperCase() || "B"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-label-sm text-label-sm text-white truncate">{auth.name}</p>
              <p className="text-[11px] text-white/60 capitalize">Buyer</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={toggleTheme} className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-white/70 hover:bg-white/5 transition-colors">
              {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
            </button>
            <button onClick={() => { auth.logout(); navigate("/login") }} className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-white/70 hover:bg-white/5 transition-colors">
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>

      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 flex items-center justify-between h-14 px-4 bg-surface-container dark:bg-surface-dim shadow-sm">
        <button onClick={() => setMobileMenuOpen(true)} className="text-on-surface dark:text-primary-fixed">
          <Menu size={24} />
        </button>
        <span className="font-headline-md text-headline-md font-bold text-primary dark:text-primary-fixed">P1G katale</span>
        <div className="flex items-center gap-2">
          <button onClick={() => navigate("/buyer/cart")} className="relative text-on-surface dark:text-primary-fixed">
            <ShoppingCart size={20} />
            {totalQty > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-primary text-on-primary text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center dark:bg-primary-fixed dark:text-on-primary-fixed">
                {totalQty}
              </span>
            )}
          </button>
          <button onClick={toggleTheme} className="text-on-surface dark:text-primary-fixed">
            {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMobileMenuOpen(false)} />
          <div className="absolute top-0 left-0 bottom-0 w-64 bg-surface-container-lowest dark:bg-surface-dim flex flex-col shadow-xl">
            <div className="flex items-center justify-between px-4 h-14 border-b border-outline-variant/20 dark:border-surface-container">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-on-primary font-bold text-xs">
                  {auth.name?.charAt(0)?.toUpperCase() || "B"}
                </div>
                <div>
                  <p className="font-label-sm text-label-sm text-on-surface dark:text-primary-fixed truncate">{auth.name}</p>
                  <p className="text-[11px] text-on-surface-variant dark:text-outline-variant">Buyer</p>
                </div>
              </div>
              <button onClick={() => setMobileMenuOpen(false)} className="text-on-surface-variant dark:text-outline-variant">
                <Menu size={24} />
              </button>
            </div>
            <nav className="flex-1 px-3 py-4 space-y-1">
              {BUYER_NAV.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === "/buyer"}
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-3 rounded-xl font-label-lg text-label-lg transition-colors ${
                      isActive
                        ? "bg-primary-container/20 text-primary dark:bg-primary-fixed/20 dark:text-primary-fixed"
                        : "text-on-surface-variant hover:bg-surface-container hover:text-on-surface dark:text-outline-variant dark:hover:bg-surface-container dark:hover:text-primary-fixed"
                    }`
                  }
                >
                  {item.icon}
                  {item.label}
                </NavLink>
              ))}
            </nav>
            <div className="p-4 border-t border-outline-variant/20 dark:border-surface-container">
              <button
                onClick={() => { auth.logout(); navigate("/login"); setMobileMenuOpen(false) }}
                className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-on-surface-variant hover:bg-surface-container dark:text-outline-variant dark:hover:bg-surface-container transition-colors"
              >
                <LogOut size={20} />
                <span className="font-label-lg text-label-lg">Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="lg:pl-60 pt-14 lg:pt-0">
        <div className="hidden lg:flex items-center justify-between px-6 py-3 bg-surface-container dark:bg-surface-dim border-b border-outline-variant/20 sticky top-0 z-10">
          <div className="relative w-80">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-outline-variant dark:text-outline" />
            <input
              placeholder="Search pigs, feed, medicines..."
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-outline-variant bg-surface dark:bg-surface-dim text-on-surface dark:text-primary-fixed text-sm font-body-md focus:outline-none focus:ring-2 focus:ring-primary/30 placeholder:text-outline-variant"
            />
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => navigate("/buyer/cart")} className="relative text-on-surface-variant dark:text-outline-variant hover:text-on-surface dark:hover:text-primary-fixed transition-colors">
              <ShoppingCart size={20} />
              {totalQty > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-primary text-on-primary text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center dark:bg-primary-fixed dark:text-on-primary-fixed">
                  {totalQty}
                </span>
              )}
            </button>
            <button onClick={toggleTheme} className="text-on-surface-variant dark:text-outline-variant hover:text-on-surface dark:hover:text-primary-fixed transition-colors">
              {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button className="text-on-surface-variant dark:text-outline-variant hover:text-on-surface dark:hover:text-primary-fixed transition-colors">
              <Bell size={20} />
            </button>
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-sm text-on-primary font-semibold dark:bg-primary-fixed dark:text-on-primary-fixed">
              {auth.name?.[0]?.toUpperCase() || "U"}
            </div>
          </div>
        </div>
        <div className="p-4 lg:p-6 max-w-container-max mx-auto">
          {children || <Outlet />}
        </div>
      </div>
    </div>
  )
}
