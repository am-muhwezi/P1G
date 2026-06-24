import { useState } from "react"
import { Globe, Percent, Wifi, WifiOff } from "lucide-react"

export function AdminSettings() {
  const [siteName, setSiteName] = useState("P1G Kataale")
  const [contactEmail, setContactEmail] = useState("admin@p1gmarket.ug")
  const [commission, setCommission] = useState(5)
  const [maintenance, setMaintenance] = useState(false)

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-headline-lg text-headline-lg text-on-surface dark:text-primary-fixed">Settings</h1>
        <p className="text-on-surface-variant font-body-md text-body-md dark:text-outline-variant">
          Platform configuration
        </p>
      </div>

      <div className="space-y-4 max-w-2xl">
        <div className="bg-surface-container-lowest rounded-xl p-6 shadow-sm border border-surface-container-high dark:bg-surface-dim dark:border-surface-container">
          <h2 className="font-headline-md text-headline-md text-on-surface mb-4 dark:text-primary-fixed flex items-center gap-2">
            <Globe size={20} />
            General
          </h2>
          <div className="space-y-4">
            <div>
              <label className="font-label-sm text-label-sm text-on-surface dark:text-primary-fixed block mb-1">Site Name</label>
              <input
                className="w-full px-4 py-3 bg-warm-beige rounded-xl focus:ring-2 focus:ring-primary text-body-md dark:bg-surface-dim dark:text-primary-fixed"
                value={siteName}
                onChange={(e) => setSiteName(e.target.value)}
              />
            </div>
            <div>
              <label className="font-label-sm text-label-sm text-on-surface dark:text-primary-fixed block mb-1">Contact Email</label>
              <input
                className="w-full px-4 py-3 bg-warm-beige rounded-xl focus:ring-2 focus:ring-primary text-body-md dark:bg-surface-dim dark:text-primary-fixed"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="bg-surface-container-lowest rounded-xl p-6 shadow-sm border border-surface-container-high dark:bg-surface-dim dark:border-surface-container">
          <h2 className="font-headline-md text-headline-md text-on-surface mb-4 dark:text-primary-fixed flex items-center gap-2">
            <Percent size={20} />
            Commission
          </h2>
          <div>
            <label className="font-label-sm text-label-sm text-on-surface dark:text-primary-fixed block mb-1">Default Commission Rate (%)</label>
            <div className="flex items-center gap-3">
              <input
                type="range"
                min={0}
                max={20}
                className="flex-1 accent-primary dark:accent-primary-fixed"
                value={commission}
                onChange={(e) => setCommission(Number(e.target.value))}
              />
              <span className="font-label-lg text-label-lg text-on-surface dark:text-primary-fixed w-10 text-right">{commission}%</span>
            </div>
          </div>
        </div>

        <div className="bg-surface-container-lowest rounded-xl p-6 shadow-sm border border-surface-container-high dark:bg-surface-dim dark:border-surface-container">
          <h2 className="font-headline-md text-headline-md text-on-surface mb-4 dark:text-primary-fixed flex items-center gap-2">
            {maintenance ? <WifiOff size={20} /> : <Wifi size={20} />}
            Maintenance Mode
          </h2>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-label-lg text-label-lg text-on-surface dark:text-primary-fixed">Enable Maintenance Mode</p>
              <p className="text-label-sm text-on-surface-variant dark:text-outline-variant">Block user access and show maintenance page</p>
            </div>
            <button
              onClick={() => setMaintenance(!maintenance)}
              className={`relative w-12 h-6 rounded-full transition-colors ${maintenance ? "bg-error" : "bg-outline-variant dark:bg-surface-container-highest"}`}
            >
              <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${maintenance ? "translate-x-6" : "translate-x-0.5"}`} />
            </button>
          </div>
        </div>

        <div className="bg-surface-container-lowest rounded-xl p-6 shadow-sm border border-surface-container-high dark:bg-surface-dim dark:border-surface-container">
          <h2 className="font-headline-md text-headline-md text-on-surface mb-4 dark:text-primary-fixed">Platform Stats</h2>
          <div className="grid grid-cols-2 gap-4 text-label-sm">
            <div className="py-2 flex justify-between">
              <span className="text-on-surface-variant dark:text-outline-variant">Version</span>
              <span className="text-on-surface dark:text-primary-fixed font-medium">1.0.0</span>
            </div>
            <div className="py-2 flex justify-between">
              <span className="text-on-surface-variant dark:text-outline-variant">Environment</span>
              <span className="text-on-surface dark:text-primary-fixed font-medium">Staging</span>
            </div>
            <div className="py-2 flex justify-between">
              <span className="text-on-surface-variant dark:text-outline-variant">Last Deployed</span>
              <span className="text-on-surface dark:text-primary-fixed font-medium">Jun 23, 2026</span>
            </div>
            <div className="py-2 flex justify-between">
              <span className="text-on-surface-variant dark:text-outline-variant">Database</span>
              <span className="text-on-surface dark:text-primary-fixed font-medium">PostgreSQL 16</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
