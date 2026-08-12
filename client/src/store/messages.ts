import { create } from "zustand"
import { api } from "../lib/api"
import { useAuth } from "./auth"

const WS_BASE = (import.meta.env.VITE_API_URL as string).replace(/^http/, "ws")
const RECONNECT_DELAYS = [3000, 6000, 12000, 30000]

interface MessageEvent {
  type: string
  conversationId: string
}

interface MessagesState {
  unreadCount: number
  lastEvent: MessageEvent | null
  connect: () => void
  disconnect: () => void
  refreshUnreadCount: () => void
}

let socket: WebSocket | null = null
let reconnectTimer: number | null = null
let reconnectAttempt = 0
let intentionalClose = false

export const useMessages = create<MessagesState>()((set, get) => ({
  unreadCount: 0,
  lastEvent: null,

  refreshUnreadCount: () => {
    api.get("/api/messages/unread-count")
      .then((res: { count: number }) => set({ unreadCount: res.count }))
      .catch(() => { /* leave last known count as-is */ })
  },

  connect: () => {
    if (socket) return
    intentionalClose = false
    const token = useAuth.getState().token
    if (!token) return

    const open = () => {
      socket = new WebSocket(`${WS_BASE}/api/messages/ws?token=${encodeURIComponent(token)}`)
      socket.onopen = () => {
        reconnectAttempt = 0
        get().refreshUnreadCount()
      }
      socket.onmessage = (event) => {
        try {
          const payload = JSON.parse(event.data)
          set({ lastEvent: payload })
          get().refreshUnreadCount()
        } catch {
          // ignore malformed frames
        }
      }
      socket.onclose = () => {
        socket = null
        if (intentionalClose) return
        const delay = RECONNECT_DELAYS[Math.min(reconnectAttempt, RECONNECT_DELAYS.length - 1)]
        reconnectAttempt += 1
        reconnectTimer = window.setTimeout(open, delay)
      }
      socket.onerror = () => {
        socket?.close()
      }
    }
    open()
  },

  disconnect: () => {
    intentionalClose = true
    if (reconnectTimer !== null) {
      window.clearTimeout(reconnectTimer)
      reconnectTimer = null
    }
    reconnectAttempt = 0
    socket?.close()
    socket = null
    set({ unreadCount: 0, lastEvent: null })
  },
}))
