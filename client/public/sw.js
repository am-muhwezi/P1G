const CACHE = "p1g-v1"
const STATIC_ASSETS = [
  "/",
  "/market",
  "/login",
  "/signup/buyer",
  "/signup/seller",
  "/manifest.json",
  "/favicon.png",
  "/logo.png",
  "/icons/icon-192.png",
  "/icons/icon-512.png",
]

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll(STATIC_ASSETS)).then(() => self.skipWaiting()),
  )
})

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))),
  )
  event.waitUntil(clients.claim())
})

self.addEventListener("fetch", (event) => {
  const { request } = event
  const url = new URL(request.url)

  // API requests — network-first with cache fallback
  if (url.pathname.startsWith("/api/")) {
    event.respondWith(networkFirst(request))
    return
  }

  // Static assets — cache-first
  if (
    request.destination === "style" ||
    request.destination === "script" ||
    request.destination === "font" ||
    request.destination === "image" ||
    url.pathname.startsWith("/assets/")
  ) {
    event.respondWith(cacheFirst(request))
    return
  }

  // Navigation — network-first with offline fallback
  if (request.mode === "navigate") {
    event.respondWith(networkFirst(request))
    return
  }

  // Everything else — network-only
  event.respondWith(fetch(request))
})

async function cacheFirst(request) {
  const cached = await caches.match(request)
  if (cached) return cached
  try {
    const response = await fetch(request)
    if (response.ok) {
      const cache = await caches.open(CACHE)
      cache.put(request, response.clone())
    }
    return response
  } catch {
    return new Response("Offline", { status: 503 })
  }
}

async function networkFirst(request) {
  try {
    const response = await fetch(request)
    if (response.ok) {
      const cache = await caches.open(CACHE)
      cache.put(request, response.clone())
    }
    return response
  } catch {
    const cached = await caches.match(request)
    if (cached) return cached
    if (request.mode === "navigate") {
      return caches.match("/market")
    }
    return new Response(JSON.stringify({ error: "offline" }), {
      status: 503,
      headers: { "Content-Type": "application/json" },
    })
  }
}
