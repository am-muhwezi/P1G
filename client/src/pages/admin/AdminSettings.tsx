import { useState, useEffect } from "react"
import { api } from "../../lib/api"
import { Globe, Percent, Wifi, WifiOff, ShieldPlus, CheckCircle, AlertCircle } from "lucide-react"

interface SettingsData {
  siteName: string
  contactEmail: string
  commissionRate: number
  maintenanceMode: boolean
}

export function AdminSettings() {
  const [settings, setSettings] = useState<SettingsData>({
    siteName: "P1G katale",
    contactEmail: "",
    commissionRate: 5,
    maintenanceMode: false,
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    api.get("/api/admin/settings").then((data) => {
      if (data) setSettings(data)
    }).catch(() => {}).finally(() => setLoading(false))
  }, [])

  const handleSave = async () => {
    setSaving(true)
    setSaved(false)
    try {
      const data = await api.put("/api/admin/settings", {
        site_name: settings.siteName,
        contact_email: settings.contactEmail,
        commission_rate: settings.commissionRate,
        maintenance_mode: settings.maintenanceMode,
      })
      if (data) setSettings(data)
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch { /* ignore */ }
    setSaving(false)
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-headline-lg text-headline-lg text-on-surface dark:text-primary-fixed">Settings</h1>
        <p className="text-on-surface-variant font-body-md text-body-md dark:text-outline-variant">
          Platform configuration
        </p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      ) : (
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
                  value={settings.siteName}
                  onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                />
              </div>
              <div>
                <label className="font-label-sm text-label-sm text-on-surface dark:text-primary-fixed block mb-1">Contact Email</label>
                <input
                  className="w-full px-4 py-3 bg-warm-beige rounded-xl focus:ring-2 focus:ring-primary text-body-md dark:bg-surface-dim dark:text-primary-fixed"
                  value={settings.contactEmail}
                  onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
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
                  value={settings.commissionRate}
                  onChange={(e) => setSettings({ ...settings, commissionRate: Number(e.target.value) })}
                />
                <span className="font-label-lg text-label-lg text-on-surface dark:text-primary-fixed w-10 text-right">{settings.commissionRate}%</span>
              </div>
            </div>
          </div>

          <div className="bg-surface-container-lowest rounded-xl p-6 shadow-sm border border-surface-container-high dark:bg-surface-dim dark:border-surface-container">
            <h2 className="font-headline-md text-headline-md text-on-surface mb-4 dark:text-primary-fixed flex items-center gap-2">
              {settings.maintenanceMode ? <WifiOff size={20} /> : <Wifi size={20} />}
              Maintenance Mode
            </h2>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-label-lg text-label-lg text-on-surface dark:text-primary-fixed">Enable Maintenance Mode</p>
                <p className="text-label-sm text-on-surface-variant dark:text-outline-variant">Block user access and show maintenance page</p>
              </div>
              <button
                onClick={() => setSettings({ ...settings, maintenanceMode: !settings.maintenanceMode })}
                className={`relative w-12 h-6 rounded-full transition-colors ${settings.maintenanceMode ? "bg-error" : "bg-outline-variant dark:bg-surface-container-highest"}`}
              >
                <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${settings.maintenanceMode ? "translate-x-6" : "translate-x-0.5"}`} />
              </button>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3">
            {saved && (
              <span className="text-label-sm text-emerald-600 dark:text-emerald-400">Settings saved</span>
            )}
            <button
              onClick={handleSave}
              disabled={saving}
              className="bg-primary text-on-primary font-label-lg text-label-lg py-3 px-6 rounded-xl hover:bg-primary/90 transition-all active:scale-95 shadow-md disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save Settings"}
            </button>
          </div>

          <CreateAdminSection />
        </div>
      )}
    </div>
  )
}

function CreateAdminSection() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [status, setStatus] = useState<{ type: "success" | "error"; message: string } | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus(null)
    if (!email.trim() || !password.trim() || !name.trim()) {
      setStatus({ type: "error", message: "Email, password, and name are required" })
      return
    }
    setSubmitting(true)
    try {
      await api.post("/api/admin/users", { email, password, name, phone })
      setStatus({ type: "success", message: `Admin "${name}" created successfully` })
      setEmail(""); setPassword(""); setName(""); setPhone("")
    } catch (err) {
      setStatus({ type: "error", message: err instanceof Error ? err.message : "Failed to create admin" })
    }
    setSubmitting(false)
  }

  return (
    <div className="bg-surface-container-lowest rounded-xl p-6 shadow-sm border border-surface-container-high dark:bg-surface-dim dark:border-surface-container">
      <h2 className="font-headline-md text-headline-md text-on-surface mb-4 dark:text-primary-fixed flex items-center gap-2">
        <ShieldPlus size={20} />
        Create New Admin
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="font-label-sm text-label-sm text-on-surface dark:text-primary-fixed block mb-1">Name</label>
          <input
            className="w-full px-4 py-3 bg-warm-beige rounded-xl focus:ring-2 focus:ring-primary text-body-md dark:bg-surface-dim dark:text-primary-fixed"
            placeholder="Full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div>
          <label className="font-label-sm text-label-sm text-on-surface dark:text-primary-fixed block mb-1">Email</label>
          <input
            type="email"
            className="w-full px-4 py-3 bg-warm-beige rounded-xl focus:ring-2 focus:ring-primary text-body-md dark:bg-surface-dim dark:text-primary-fixed"
            placeholder="admin@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <label className="font-label-sm text-label-sm text-on-surface dark:text-primary-fixed block mb-1">Password</label>
          <input
            type="password"
            className="w-full px-4 py-3 bg-warm-beige rounded-xl focus:ring-2 focus:ring-primary text-body-md dark:bg-surface-dim dark:text-primary-fixed"
            placeholder="Min 6 characters"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div>
          <label className="font-label-sm text-label-sm text-on-surface dark:text-primary-fixed block mb-1">Phone (optional)</label>
          <input
            className="w-full px-4 py-3 bg-warm-beige rounded-xl focus:ring-2 focus:ring-primary text-body-md dark:bg-surface-dim dark:text-primary-fixed"
            placeholder="0772 000 000"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>
        {status && (
          <div className={`flex items-center gap-2 text-label-sm ${status.type === "success" ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"}`}>
            {status.type === "success" ? <CheckCircle size={14} /> : <AlertCircle size={14} />}
            <span>{status.message}</span>
          </div>
        )}
        <button
          type="submit"
          disabled={submitting}
          className="bg-primary text-on-primary font-label-lg text-label-lg py-3 px-6 rounded-xl hover:bg-primary/90 transition-all active:scale-95 shadow-md disabled:opacity-50"
        >
          {submitting ? "Creating..." : "Create Admin"}
        </button>
      </form>
    </div>
  )
}
