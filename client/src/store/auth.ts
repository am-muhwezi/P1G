import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { Role } from "../lib/data"

interface AuthUser {
  role: Role
  id: string
  name: string
  token: string
  email: string
  status?: string
  district?: string | null
  created_at?: string
}

interface AuthState {
  isAuthenticated: boolean
  role: Role | null
  userId: string | null
  name: string | null
  email: string | null
  token: string | null
  status: string | null
  district: string | null
  createdAt: string | null
  login: (user: AuthUser) => void
  logout: () => void
}

export const useAuth = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      role: null,
      userId: null,
      name: null,
      email: null,
      token: null,
      status: null,
      district: null,
      createdAt: null,
      login: (user) =>
        set({
          isAuthenticated: true,
          role: user.role,
          userId: user.id,
          name: user.name,
          token: user.token,
          email: user.email,
          status: user.status ?? "active",
          district: user.district ?? null,
          createdAt: user.created_at ?? null,
        }),
      logout: () =>
        set({
          isAuthenticated: false,
          role: null,
          userId: null,
          name: null,
          email: null,
          token: null,
          status: null,
          district: null,
          createdAt: null,
        }),
    }),
    { name: "p1g-auth" },
  ),
)
