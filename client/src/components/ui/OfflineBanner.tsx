import { useEffect, useRef, useState } from "react"
import { useNetwork } from "../../store/network"
import { Wifi, WifiOff, RefreshCw } from "lucide-react"

export function OfflineBanner() {
  const isOnline = useNetwork((s) => s.isOnline)
  const [showBackOnline, setShowBackOnline] = useState(false)
  const prevRef = useRef(isOnline)

  useEffect(() => {
    if (!prevRef.current && isOnline) {
      setShowBackOnline(true)
      const t = setTimeout(() => setShowBackOnline(false), 3000)
      prevRef.current = true
      return () => clearTimeout(t)
    }
    prevRef.current = isOnline
  }, [isOnline])

  if (isOnline && !showBackOnline) return null

  return (
    <div
      className={`fixed top-0 left-0 right-0 z-[110] px-4 py-2.5 flex items-center justify-center gap-2 text-sm font-medium transition-all duration-500 ${
        isOnline
          ? "bg-emerald-500 text-white animate-slide-down"
          : "bg-amber-500 text-white"
      }`}
    >
      {isOnline ? (
        <>
          <Wifi size={16} />
          Back online
        </>
      ) : (
        <>
          <WifiOff size={16} />
          You are offline — showing cached content
          <RefreshCw size={14} className="animate-spin ml-1" />
        </>
      )}
    </div>
  )
}
