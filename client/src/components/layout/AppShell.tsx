import { Link, useLocation, useNavigate } from "react-router-dom"
import { useAuth } from "@/store/auth"
import { useCart } from "@/store/cart"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Home, ShoppingBag, Package, MessageSquare, User, LogOut,
  BarChart3, Users, CheckSquare, ListChecks, Settings,
  Menu, ShoppingCart, Bell, DollarSign, PlusCircle,
} from "lucide-react"

// ─── Logo ──────────────────────────────────────────────────────────────────────
export function P1GLogo({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center text-lg">🐷</div>
      <span className="font-bold text-white text-lg tracking-tight">P1G Market</span>
    </div>
  )
}

// ─── Nav configs ───────────────────────────────────────────────────────────────
const BUYER_NAV = [
  { to: "/buyer",          icon: Home,         label: "Home" },
  { to: "/buyer/market",   icon: ShoppingBag,  label: "Marketplace" },
  { to: "/buyer/orders",   icon: Package,      label: "My Orders" },
  { to: "/buyer/messages", icon: MessageSquare,label: "Messages" },
  { to: "/buyer/profile",  icon: User,         label: "Profile" },
]

const SELLER_NAV = [
  { to: "/seller",           icon: Home,        label: "Dashboard" },
  { to: "/seller/listings",  icon: ListChecks,  label: "My Listings" },
  { to: "/seller/orders",    icon: Package,     label: "Orders" },
  { to: "/seller/messages",  icon: MessageSquare, label: "Messages" },
  { to: "/seller/earnings",  icon: DollarSign,  label: "Earnings" },
  { to: "/seller/profile",   icon: Settings,    label: "Settings" },
]

const ADMIN_NAV = [
  { to: "/admin",              icon: BarChart3,    label: "Overview" },
  { to: "/admin/users",        icon: Users,        label: "User Management" },
  { to: "/admin/seller-approvals", icon: CheckSquare, label: "Seller Approvals" },
  { to: "/admin/listing-approvals", icon: ListChecks, label: "Listing Approvals" },
  { to: "/admin/orders",       icon: Package,      label: "Orders" },
  { to: "/admin/settings",     icon: Settings,     label: "Settings" },
]

function NavItem({ to, icon: Icon, label, onClick }: { to: string; icon: React.ElementType; label: string; onClick?: () => void }) {
  const loc = useLocation()
  const active = loc.pathname === to || (to !== "/buyer" && to !== "/seller" && to !== "/admin" && loc.pathname.startsWith(to))
  return (
    <Link
      to={to}
      onClick={onClick}
      className={cn(
        "flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all",
        active
          ? "bg-white/20 text-white"
          : "text-white/70 hover:bg-white/10 hover:text-white"
      )}
    >
      <Icon size={18} />
      <span>{label}</span>
    </Link>
  )
}

// ─── Sidebar (desktop) ────────────────────────────────────────────────────────
function Sidebar({ nav }: { nav: typeof BUYER_NAV }) {
  const { name, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => { logout(); navigate("/") }

  return (
    <aside className="hidden lg:flex flex-col w-60 min-h-screen bg-[#1A3F1A] fixed top-0 left-0 z-30">
      <div className="p-5 border-b border-white/10">
        <P1GLogo />
      </div>
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {nav.map(n => <NavItem key={n.to} {...n} />)}
      </nav>
      <div className="p-3 border-t border-white/10">
        <DropdownMenu>
          <DropdownMenuTrigger>
            <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/10 transition-all text-left">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-sm text-white font-semibold shrink-0">
                {name?.[0] ?? "U"}
              </div>
              <span className="text-white/90 text-sm font-medium truncate">{name}</span>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent side="top" className="w-48">
            <DropdownMenuItem><Link to="/profile" className="w-full">Profile</Link></DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="text-red-600">
              <LogOut size={14} className="mr-2" /> Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </aside>
  )
}

// ─── Mobile Top Bar ────────────────────────────────────────────────────────────
function MobileTopBar({ nav, showCart }: { nav: typeof BUYER_NAV; showCart?: boolean }) {
  const { name, logout } = useAuth()
  const navigate = useNavigate()
  const cartItems = useCart(s => s.items)
  const totalQty = cartItems.reduce((s, i) => s + i.quantity, 0)

  return (
    <header className="lg:hidden fixed top-0 left-0 right-0 z-30 bg-[#1A3F1A] text-white px-4 h-14 flex items-center justify-between shadow-md">
      <P1GLogo />
      <div className="flex items-center gap-2">
        {showCart && (
          <Button variant="ghost" size="icon" className="text-white relative" onClick={() => navigate("/buyer/cart")}>
            <ShoppingCart size={20} />
            {totalQty > 0 && (
              <span className="absolute -top-1 -right-1 bg-amber-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">{totalQty}</span>
            )}
          </Button>
        )}
        <Button variant="ghost" size="icon" className="text-white"><Bell size={20} /></Button>
        <Sheet>
          <SheetTrigger>
            <Button variant="ghost" size="icon" className="text-white"><Menu size={22} /></Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-0 bg-[#1A3F1A] border-0">
            <div className="p-5 border-b border-white/10"><P1GLogo /></div>
            <nav className="p-3 space-y-1">
              {nav.map(n => <NavItem key={n.to} {...n} />)}
            </nav>
            <div className="absolute bottom-0 left-0 right-0 p-3 border-t border-white/10">
              <button
                onClick={() => { logout(); navigate("/") }}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-white/70 hover:bg-white/10 hover:text-white text-sm"
              >
                <LogOut size={18} /><span>Logout ({name})</span>
              </button>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  )
}

// ─── Shell ─────────────────────────────────────────────────────────────────────
export function AppShell({ children }: { children: React.ReactNode }) {
  const { role } = useAuth()

  const nav = role === "admin" ? ADMIN_NAV : role === "seller" ? SELLER_NAV : BUYER_NAV
  const showCart = role === "buyer"

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar nav={nav} />
      <MobileTopBar nav={nav} showCart={showCart} />
      <main className="lg:pl-60 pt-14 lg:pt-0 min-h-screen">
        {children}
      </main>
    </div>
  )
}

// ─── Top bar for buyer (desktop) ──────────────────────────────────────────────
export function BuyerTopBar() {
  const navigate = useNavigate()
  const cartItems = useCart(s => s.items)
  const totalQty = cartItems.reduce((s, i) => s + i.quantity, 0)
  const { name } = useAuth()

  return (
    <div className="hidden lg:flex items-center justify-between px-6 py-4 bg-white border-b sticky top-0 z-10">
      <div className="relative w-80">
        <input
          placeholder="Search pigs, feed, medicines..."
          className="w-full pl-9 pr-4 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-500/30 bg-gray-50"
        />
        <ShoppingBag size={16} className="absolute left-3 top-2.5 text-gray-400" />
      </div>
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" className="relative" onClick={() => navigate("/buyer/cart")}>
          <ShoppingCart size={20} />
          {totalQty > 0 && (
            <span className="absolute -top-1 -right-1 bg-amber-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">{totalQty}</span>
          )}
        </Button>
        <Button variant="ghost" size="icon"><Bell size={20} /></Button>
        <div className="w-8 h-8 rounded-full bg-green-700 flex items-center justify-center text-sm text-white font-semibold">{name?.[0] ?? "U"}</div>
      </div>
    </div>
  )
}

export function SellerAddListingButton() {
  const navigate = useNavigate()
  return (
    <Button onClick={() => navigate("/seller/listings/new")} className="bg-amber-500 hover:bg-amber-600 text-white gap-2">
      <PlusCircle size={16} /> Add New Listing
    </Button>
  )
}

export function AdminPageHeader({ title, subtitle, action }: { title: string; subtitle?: string; action?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between mb-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
        {subtitle && <p className="text-sm text-gray-500 mt-0.5">{subtitle}</p>}
      </div>
      {action}
    </div>
  )
}

export function StatCard({ label, value, icon: Icon, color = "green", sub }: {
  label: string; value: string | number; icon: React.ElementType; color?: "green" | "amber" | "blue" | "red"; sub?: string
}) {
  const colors = {
    green: "bg-green-50 text-green-700",
    amber: "bg-amber-50 text-amber-700",
    blue:  "bg-blue-50 text-blue-700",
    red:   "bg-red-50 text-red-700",
  }
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm text-gray-500 font-medium">{label}</span>
        <div className={cn("w-9 h-9 rounded-xl flex items-center justify-center", colors[color])}>
          <Icon size={18} />
        </div>
      </div>
      <div className="text-2xl font-bold text-gray-900">{value}</div>
      {sub && <div className="text-xs text-gray-400 mt-1">{sub}</div>}
    </div>
  )
}

export function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    active:      "bg-green-100 text-green-700",
    pending:     "bg-amber-100 text-amber-700",
    rejected:    "bg-red-100 text-red-700",
    suspended:   "bg-red-100 text-red-700",
    confirmed:   "bg-blue-100 text-blue-700",
    in_transit:  "bg-purple-100 text-purple-700",
    delivered:   "bg-green-100 text-green-700",
    cancelled:   "bg-gray-100 text-gray-600",
  }
  const label = status.replace("_", " ")
  return (
    <span className={cn("inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize", map[status] ?? "bg-gray-100 text-gray-600")}>
      {label}
    </span>
  )
}

export function RoleBadge({ role }: { role: string }) {
  const map: Record<string, string> = {
    buyer:  "bg-blue-100 text-blue-700",
    seller: "bg-green-100 text-green-700",
    admin:  "bg-purple-100 text-purple-700",
  }
  return (
    <span className={cn("inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize", map[role] ?? "bg-gray-100")}>
      {role}
    </span>
  )
}
