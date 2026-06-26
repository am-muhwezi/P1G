import { useAuth } from "../store/auth"
import { useNetwork } from "../store/network"
import { useToast } from "../store/toast"

const BASE = import.meta.env.VITE_API_URL
const CACHE_KEY = "p1g-cache"

interface CacheEntry {
  data: unknown
  timestamp: number
}

function cacheGet(path: string): unknown | undefined {
  try {
    const raw = sessionStorage.getItem(CACHE_KEY)
    if (!raw) return undefined
    const store: Record<string, CacheEntry> = JSON.parse(raw)
    return store[`GET:${path}`]?.data
  } catch {
    return undefined
  }
}

function cacheSet(path: string, data: unknown): void {
  try {
    const raw = sessionStorage.getItem(CACHE_KEY)
    const store: Record<string, CacheEntry> = raw ? JSON.parse(raw) : {}
    store[`GET:${path}`] = { data, timestamp: Date.now() }
    sessionStorage.setItem(CACHE_KEY, JSON.stringify(store))
  } catch { /* storage full or unavailable */ }
}

async function request(method: string, path: string, body?: unknown) {
  const auth = useAuth.getState()
  const headers: Record<string, string> = {}
  if (body) headers["Content-Type"] = "application/json"
  if (auth.token) headers["x-token"] = auth.token

  try {
    const res = await fetch(`${BASE}${path}`, {
      method, headers,
      body: body ? JSON.stringify(body) : undefined,
    })
    if (!res.ok) {
      const detail = await res.json().then((d) => d.detail).catch(() => null)
      throw new Error(detail || `Request failed (${res.status})`)
    }
    const data = res.status === 204 ? null : await res.json()
    if (method === "GET") cacheSet(path, data)
    return data
  } catch (err) {
    if (!navigator.onLine) {
      if (method === "GET") {
        const cached = cacheGet(path)
        if (cached !== undefined) return cached
      } else {
        useNetwork.getState().enqueue({ method, path, body })
        useToast.getState().toast("Saved offline — will sync when reconnected", "info")
      }
    }
    throw err
  }
}

export const api = {
  get: (path: string) => request("GET", path),
  post: (path: string, body?: unknown) => request("POST", path, body),
  put: (path: string, body?: unknown) => request("PUT", path, body),
  patch: (path: string, body?: unknown) => request("PATCH", path, body),
  del: (path: string) => request("DELETE", path),
  retry: (req: { method: string; path: string; body?: unknown }) => request(req.method, req.path, req.body),
  clearCache: () => sessionStorage.removeItem(CACHE_KEY),
}
