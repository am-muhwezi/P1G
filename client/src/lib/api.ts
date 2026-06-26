import { useAuth } from "../store/auth"

const BASE = import.meta.env.VITE_API_URL

async function request(method: string, path: string, body?: unknown) {
  const state = useAuth.getState()
  const headers: Record<string, string> = {}
  if (body) headers["Content-Type"] = "application/json"
  if (state.token) headers["x-token"] = state.token
  const res = await fetch(`${BASE}${path}`, { method, headers, body: body ? JSON.stringify(body) : undefined })
  if (!res.ok) {
    if (res.status === 401) state.logout()
    const detail = await res.json().then((d) => d.detail).catch(() => null)
    throw new Error(detail || `Request failed (${res.status})`)
  }
  if (res.status === 204) return null
  return res.json()
}

export const api = {
  get: (path: string) => request("GET", path),
  post: (path: string, body?: unknown) => request("POST", path, body),
  put: (path: string, body?: unknown) => request("PUT", path, body),
  patch: (path: string, body?: unknown) => request("PATCH", path, body),
  del: (path: string) => request("DELETE", path),
}
