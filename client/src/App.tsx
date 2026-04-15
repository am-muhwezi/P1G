import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { Toaster } from "@/components/ui/sonner"
import { useAuth } from "@/store/auth"

import Landing from "@/pages/Landing"
import Login from "@/pages/Login"
import Signup from "@/pages/Signup"

// Buyer
import BuyerHome from "@/pages/buyer/BuyerHome"
import BuyerOrders from "@/pages/buyer/BuyerOrders"
import Cart from "@/pages/buyer/Cart"
import { BuyerPlaceholder } from "@/pages/Placeholder"

// Seller
import SellerDashboard from "@/pages/seller/SellerDashboard"
import SellerListings from "@/pages/seller/SellerListings"
import { SellerPlaceholder } from "@/pages/Placeholder"

// Admin
import AdminDashboard from "@/pages/admin/AdminDashboard"
import AdminUsers from "@/pages/admin/AdminUsers"
import AdminListingApprovals from "@/pages/admin/AdminListingApprovals"
import { AdminPlaceholder } from "@/pages/Placeholder"

function RequireAuth({ children, role }: { children: React.ReactNode; role?: string }) {
  const auth = useAuth()
  if (!auth.isAuthenticated) return <Navigate to="/login" replace />
  if (role && auth.role !== role) return <Navigate to={`/${auth.role}`} replace />
  return <>{children}</>
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Buyer */}
        <Route path="/buyer" element={<RequireAuth role="buyer"><BuyerHome /></RequireAuth>} />
        <Route path="/buyer/market" element={<RequireAuth role="buyer"><BuyerHome /></RequireAuth>} />
        <Route path="/buyer/listing/:id" element={<RequireAuth role="buyer"><BuyerPlaceholder title="Listing Detail" /></RequireAuth>} />
        <Route path="/buyer/orders" element={<RequireAuth role="buyer"><BuyerOrders /></RequireAuth>} />
        <Route path="/buyer/cart" element={<RequireAuth role="buyer"><Cart /></RequireAuth>} />
        <Route path="/buyer/messages" element={<RequireAuth role="buyer"><BuyerPlaceholder title="Messages" /></RequireAuth>} />
        <Route path="/buyer/profile" element={<RequireAuth role="buyer"><BuyerPlaceholder title="My Profile" /></RequireAuth>} />

        {/* Seller */}
        <Route path="/seller" element={<RequireAuth role="seller"><SellerDashboard /></RequireAuth>} />
        <Route path="/seller/listings" element={<RequireAuth role="seller"><SellerListings /></RequireAuth>} />
        <Route path="/seller/listings/new" element={<RequireAuth role="seller"><SellerListings /></RequireAuth>} />
        <Route path="/seller/orders" element={<RequireAuth role="seller"><SellerPlaceholder title="Seller Orders" /></RequireAuth>} />
        <Route path="/seller/messages" element={<RequireAuth role="seller"><SellerPlaceholder title="Messages" /></RequireAuth>} />
        <Route path="/seller/earnings" element={<RequireAuth role="seller"><SellerPlaceholder title="Earnings & Payouts" /></RequireAuth>} />
        <Route path="/seller/profile" element={<RequireAuth role="seller"><SellerPlaceholder title="Account Settings" /></RequireAuth>} />

        {/* Admin */}
        <Route path="/admin" element={<RequireAuth role="admin"><AdminDashboard /></RequireAuth>} />
        <Route path="/admin/users" element={<RequireAuth role="admin"><AdminUsers /></RequireAuth>} />
        <Route path="/admin/seller-approvals" element={<RequireAuth role="admin"><AdminUsers /></RequireAuth>} />
        <Route path="/admin/listing-approvals" element={<RequireAuth role="admin"><AdminListingApprovals /></RequireAuth>} />
        <Route path="/admin/orders" element={<RequireAuth role="admin"><AdminPlaceholder title="Order Management" /></RequireAuth>} />
        <Route path="/admin/settings" element={<RequireAuth role="admin"><AdminPlaceholder title="Platform Settings" /></RequireAuth>} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Toaster richColors position="top-right" />
    </BrowserRouter>
  )
}
