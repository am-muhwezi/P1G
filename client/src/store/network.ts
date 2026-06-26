import { create } from "zustand"

export interface QueuedRequest {
  id: string
  method: string
  path: string
  body?: unknown
}

interface NetworkState {
  isOnline: boolean
  queue: QueuedRequest[]
  setOnline: (online: boolean) => void
  enqueue: (req: Omit<QueuedRequest, "id">) => string
  dequeue: (id: string) => void
  flush: () => QueuedRequest[]
}

export const useNetwork = create<NetworkState>()((set, get) => ({
  isOnline: navigator.onLine,
  queue: [],
  setOnline: (online) => set({ isOnline: online }),
  enqueue: (req) => {
    const id = crypto.randomUUID()
    set((s) => ({ queue: [...s.queue, { ...req, id }] }))
    return id
  },
  dequeue: (id) => set((s) => ({ queue: s.queue.filter((q) => q.id !== id) })),
  flush: () => {
    const items = [...get().queue]
    set({ queue: [] })
    return items
  },
}))
