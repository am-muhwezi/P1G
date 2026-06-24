import { useState, useEffect } from "react"
import { NavLink } from "react-router-dom"
import { Menu, Users, Sun, Moon, LogOut } from "lucide-react"
import { useTheme } from "../../context/ThemeContext"
import { WaitlistLogin } from "./WaitlistLogin"
import WaitlistDashboard from "./WaitlistDashboard"

const WAITLIST_PASSWORD_KEY = "p1g-waitlist-password"
const ADMIN_STORAGE_KEY = "p1g-waitlist-admin"

const WAITLIST_NAV = [
  { to: "/admin/waitlist", label: "Waitlist", icon: <Users size={20} /> },
]

export default function WaitlistAdminPage() {
  const [authed, setAuthed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const { theme, toggleTheme } = useTheme()

  useEffect(() => {
    if (localStorage.getItem(WAITLIST_PASSWORD_KEY) === "true") {
      setAuthed(true)
    }
  }, [])

  const handleAuth = () => setAuthed(true)

  const handleLogout = () => {
    localStorage.removeItem(WAITLIST_PASSWORD_KEY)
    localStorage.removeItem("p1g-waitlist-admin-pw")
    setAuthed(false)
  }

  const adminName = localStorage.getItem(ADMIN_STORAGE_KEY) || "Admin"

  if (!authed) return <WaitlistLogin onAuth={handleAuth} />

  return (
    <div className="min-h-screen bg-surface dark:bg-background">
      {/* Sidebar */}
      <aside className="fixed top-0 left-0 z-40 h-full w-60 bg-[#002114] flex-col hidden lg:flex">
        <div className="flex items-center gap-3 px-6 h-16 border-b border-white/10">
          <div className="h-8 w-8 rounded-full bg-white flex items-center justify-center overflow-hidden shrink-0">
            <img src="/logo.png" alt="P1G Kataale" className="h-7 w-7 object-contain" />
          </div>
          <span className="font-['Plus_Jakarta_Sans'] text-[24px] font-bold text-white">P1G Admin</span>
        </div>
        <nav className="flex-1 px-3 py-6 space-y-1">
          {WAITLIST_NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl font-['Plus_Jakarta_Sans'] text-[14px] font-semibold tracking-[0.05em] transition-colors ${
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
        {/* Sidebar bottom: admin info + theme + logout */}
        <div className="p-4 border-t border-white/10">
          <div className="flex items-center gap-3 mb-3 px-2">
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white font-bold text-xs">
              {adminName.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[13px] font-semibold text-white truncate">{adminName}</p>
              <p className="text-[11px] text-white/60">Administrator</p>
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
              onClick={handleLogout}
              className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-white/70 hover:bg-white/5 transition-colors"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile top bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 flex items-center justify-between h-14 px-4 bg-[#002114] shadow-sm">
        <button onClick={() => setMobileOpen(true)} className="text-white">
          <Menu size={24} />
        </button>
        <span className="font-['Plus_Jakarta_Sans'] text-[20px] font-bold text-white">P1G Admin</span>
        <div className="flex items-center gap-2">
          <button onClick={toggleTheme} className="text-white/70 hover:text-white transition-colors">
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMobileOpen(false)} />
          <div className="absolute top-0 left-0 bottom-0 w-64 bg-[#002114] flex flex-col shadow-xl">
            <div className="flex items-center justify-between px-4 h-14 border-b border-white/10">
              <span className="font-['Plus_Jakarta_Sans'] text-[20px] font-bold text-white">P1G Admin</span>
              <button onClick={() => setMobileOpen(false)} className="text-white/60">
                <Menu size={24} />
              </button>
            </div>
            <nav className="flex-1 px-3 py-4 space-y-1">
              {WAITLIST_NAV.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-3 rounded-xl font-['Plus_Jakarta_Sans'] text-[14px] font-semibold tracking-[0.05em] transition-colors ${
                      isActive
                        ? "bg-white/10 text-white"
                        : "text-white/70 hover:bg-white/5 hover:text-white"
                    }`
                  }
                >
                  {item.icon}
                  {item.label}
                </NavLink>
              ))}
            </nav>
            {/* Mobile drawer bottom */}
            <div className="p-4 border-t border-white/10">
              <div className="flex items-center gap-3 px-2 mb-3">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white font-bold text-xs">
                  {adminName.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-semibold text-white truncate">{adminName}</p>
                  <p className="text-[11px] text-white/60">Administrator</p>
                </div>
              </div>
              <button
                onClick={() => { setMobileOpen(false); handleLogout() }}
                className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-white/70 hover:bg-white/5 hover:text-white transition-colors"
              >
                <LogOut size={20} />
                <span className="text-[14px] font-semibold">Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="lg:pl-60 pt-14 lg:pt-0 pb-20 lg:pb-0">
        <div className="p-4 lg:p-6 max-w-[1280px] mx-auto">
          <WaitlistDashboard />
        </div>
      </div>
    </div>
  )
}
