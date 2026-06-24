import { Navigate, Outlet } from "react-router-dom"
import { useAuth } from "../../store/auth"
import type { Role } from "../../lib/data"

export function RequireAuth({ role, children }: { role?: Role; children?: React.ReactNode }) {
  const auth = useAuth()
  if (!auth.isAuthenticated) return <Navigate to="/login" replace />
  if (role && auth.role !== role) {
    const base = `/${auth.role}`
    return <Navigate to={base} replace />
  }
  return children ? <>{children}</> : <Outlet />
}
