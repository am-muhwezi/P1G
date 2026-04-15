import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { Role } from "@/lib/data"

interface AuthState {
  isAuthenticated: boolean
  role: Role | null
  userId: string | null
  name: string | null
  login: (role: Role, userId: string, name: string) => void
  logout: () => void
}

export const useAuth = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      role: null,
      userId: null,
      name: null,
      login: (role, userId, name) => set({ isAuthenticated: true, role, userId, name }),
      logout: () => set({ isAuthenticated: false, role: null, userId: null, name: null }),
    }),
    { name: "p1g-auth" }
  )
)
