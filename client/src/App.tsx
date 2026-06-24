import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { Layout } from './components/layout/Layout';
import { AppShell } from './components/layout/AppShell';
import { AdminLayout } from './components/layout/AdminLayout';
import { BuyerLayout } from './components/layout/BuyerLayout';
import { RequireAuth } from './components/auth/RequireAuth';
import ComingSoon from './pages/ComingSoon';
import { Landing } from './pages/Landing';
import { Marketplace } from './pages/Marketplace';
import { ProductDetail } from './pages/ProductDetail';
import { OrderTracking } from './pages/OrderTracking';
import { Login } from './pages/auth/Login';
import { SellerDashboard } from './pages/seller/SellerDashboard';
import { SellerListings } from './pages/seller/SellerListings';
import { SellerOrders } from './pages/seller/SellerOrders';

import { SellerAnalytics } from './pages/seller/SellerAnalytics';
import { SellerSettings } from './pages/seller/SellerSettings';
import { BuyerHome } from './pages/buyer/BuyerHome';
import { BuyerOrders } from './pages/buyer/BuyerOrders';
import { BuyerProfile } from './pages/buyer/BuyerProfile';
import { Cart } from './pages/buyer/Cart';
import { Wishlist } from './pages/Wishlist';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import WaitlistAdminPage from './pages/admin/WaitlistAdminPage';
import { AdminUsers } from './pages/admin/AdminUsers';
import { AdminListings } from './pages/admin/AdminListings';
import { AdminSettings } from './pages/admin/AdminSettings';

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<ComingSoon />} />
          <Route path="/waitlist" element={<ComingSoon />} />
          <Route element={<Layout />}>
            <Route path="/home" element={<Landing />} />
            <Route path="/market" element={<Marketplace />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/order/:orderId" element={<OrderTracking />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/wishlist" element={<Wishlist />} />
          </Route>
          <Route path="/login" element={<Login />} />
          <Route element={<RequireAuth role="seller" />}>
            <Route element={<AppShell />}>
              <Route path="/seller" element={<SellerDashboard />} />
              <Route path="/seller/listings" element={<SellerListings />} />
              <Route path="/seller/orders" element={<SellerOrders />} />

              <Route path="/seller/analytics" element={<SellerAnalytics />} />
              <Route path="/seller/settings" element={<SellerSettings />} />
            </Route>
          </Route>
          <Route path="/admin/waitlist" element={<WaitlistAdminPage />} />
          <Route element={<RequireAuth role="admin" />}>
            <Route element={<AdminLayout />}>
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/users" element={<AdminUsers />} />
              <Route path="/admin/listings" element={<AdminListings />} />
              <Route path="/admin/settings" element={<AdminSettings />} />
            </Route>
          </Route>
          <Route element={<RequireAuth role="buyer" />}>
            <Route element={<BuyerLayout />}>
              <Route path="/buyer" element={<BuyerHome />} />
              <Route path="/buyer/orders" element={<BuyerOrders />} />
              <Route path="/buyer/profile" element={<BuyerProfile />} />
              <Route path="/buyer/cart" element={<Cart />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}
