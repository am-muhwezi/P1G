import { useState } from "react"
import { NavLink, useNavigate, Outlet } from "react-router-dom"
import { useAuth } from "../../store/auth"
import { useTheme } from "../../context/ThemeContext"
import { LayoutDashboard, Users, Package, Settings, ClipboardList, BarChart3, LogOut, Sun, Moon, Menu } from "lucide-react"

const ADMIN_NAV = [
  { to: "/admin", label: "Dashboard", icon: <LayoutDashboard size={20} /> },
  { to: "/admin/analytics", label: "Analytics", icon: <BarChart3 size={20} /> },
  { to: "/admin/users", label: "Users", icon: <Users size={20} /> },
  { to: "/admin/listings", label: "Listings", icon: <Package size={20} /> },
  { to: "/admin/waitlist", label: "Waitlist", icon: <ClipboardList size={20} /> },
  { to: "/admin/settings", label: "Settings", icon: <Settings size={20} /> },
]

const BOTTOM_NAV = ADMIN_NAV.slice(0, 4)

export function AdminLayout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const auth = useAuth()
  const { theme, toggleTheme } = useTheme()
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-surface dark:bg-background">
      <aside className="fixed top-0 left-0 z-40 h-full w-60 bg-[#002114] flex-col hidden lg:flex">
        <div className="flex items-center gap-3 px-6 h-16 border-b border-white/10">
          <div className="h-8 w-8 rounded-full bg-white flex items-center justify-center overflow-hidden shrink-0">
            <img src="/logo.png" alt="P1G katale" className="h-7 w-7 object-contain" />
          </div>
          <span className="font-headline-md text-headline-md font-bold text-white">P1G Admin</span>
        </div>
        <nav className="flex-1 px-3 py-6 space-y-1">
          {ADMIN_NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/admin"}
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
              {auth.name?.charAt(0)?.toUpperCase() || "A"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-label-sm text-label-sm text-white truncate">{auth.name}</p>
              <p className="text-[11px] text-white/60 capitalize">{auth.role}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={toggleTheme}
              className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-white/70 hover:bg-white/5 transition-colors"
            >
              {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
            </button>
            <button
              onClick={() => { auth.logout(); navigate("/login") }}
              className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-white/70 hover:bg-white/5 transition-colors"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>

      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 flex items-center justify-between h-14 px-4 bg-surface-container dark:bg-surface-dim shadow-sm">
        <button onClick={() => setMobileMenuOpen(true)} className="text-on-surface dark:text-primary-fixed">
          <Menu size={24} />
        </button>
        <span className="font-headline-md text-headline-md font-bold text-primary dark:text-primary-fixed">P1G Admin</span>
        <button onClick={toggleTheme} className="text-on-surface dark:text-primary-fixed">
          {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </div>

      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMobileMenuOpen(false)} />
          <div className="absolute top-0 left-0 bottom-0 w-64 bg-surface-container-lowest dark:bg-surface-dim flex flex-col shadow-xl">
            <div className="flex items-center justify-between px-4 h-14 border-b border-outline-variant/20 dark:border-surface-container">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-on-primary font-bold text-xs">
                  {auth.name?.charAt(0)?.toUpperCase() || "A"}
                </div>
                <div>
                  <p className="font-label-sm text-label-sm text-on-surface dark:text-primary-fixed truncate">{auth.name}</p>
                  <p className="text-[11px] text-on-surface-variant dark:text-outline-variant capitalize">{auth.role}</p>
                </div>
              </div>
              <button onClick={() => setMobileMenuOpen(false)} className="text-on-surface-variant dark:text-outline-variant">
                <Menu size={24} />
              </button>
            </div>
            <nav className="flex-1 px-3 py-4 space-y-1">
              {ADMIN_NAV.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === "/admin"}
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

      <div className="lg:pl-60 pt-14 lg:pt-0 pb-20 lg:pb-0">
        <div className="p-4 lg:p-6 max-w-container-max mx-auto">
          <Outlet />
        </div>
      </div>

      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around h-20 px-2 pb-2 bg-[#002114] shadow-[0_-2px_12px_rgba(0,0,0,0.08)] rounded-t-2xl">
        {BOTTOM_NAV.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === "/admin"}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center gap-0.5 px-3 py-2 rounded-xl transition-colors min-w-0 ${
                isActive ? "text-white" : "text-white/60"
              }`
            }
          >
            {({ isActive }) => (
              <>
                <div className={`p-1.5 rounded-lg transition-colors ${isActive ? "bg-white/10" : ""}`}>
                  {item.icon}
                </div>
                <span className="font-label-sm text-label-sm text-center truncate w-full">{item.label}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>
    </div>
  )
}
