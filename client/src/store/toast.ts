import { create } from "zustand"

export type ToastType = "success" | "error" | "info"

interface Toast {
  id: string
  message: string
  type: ToastType
  bump: number
}

interface ToastState {
  toasts: Toast[]
  toast: (message: string, type?: ToastType) => void
  dismiss: (id: string) => void
}

const MAX_VISIBLE = 4
const DURATION_MS = 3500

let nextId = 0
const timers = new Map<string, ReturnType<typeof setTimeout>>()

function scheduleDismiss(set: (fn: (s: ToastState) => Partial<ToastState>) => void, id: string) {
  const timer = setTimeout(() => {
    set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) }))
    timers.delete(id)
  }, DURATION_MS)
  timers.set(id, timer)
}

export const useToast = create<ToastState>()((set, get) => ({
  toasts: [],
  toast: (message, type = "success") => {
    // Repeated identical toasts (e.g. rapid double-clicks) just refresh the
    // existing one's timer instead of stacking duplicates on screen.
    const existing = get().toasts.find((t) => t.message === message && t.type === type)
    if (existing) {
      const timer = timers.get(existing.id)
      if (timer) clearTimeout(timer)
      // Bump so the UI can replay its entrance animation, acknowledging the
      // repeated action instead of silently doing nothing.
      set((s) => ({ toasts: s.toasts.map((t) => t.id === existing.id ? { ...t, bump: t.bump + 1 } : t) }))
      scheduleDismiss(set, existing.id)
      return
    }

    const id = String(++nextId)
    set((s) => ({ toasts: [...s.toasts, { id, message, type, bump: 0 }].slice(-MAX_VISIBLE) }))
    scheduleDismiss(set, id)
  },
  dismiss: (id) => {
    const timer = timers.get(id)
    if (timer) clearTimeout(timer)
    timers.delete(id)
    set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) }))
  },
}))
