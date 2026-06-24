import { useState } from "react"
import { useAuth } from "../../store/auth"
import { useNavigate } from "react-router-dom"
import { LogOut, User, Bell, Shield, Mail, Phone, MapPin, Globe } from "lucide-react"

export function SellerSettings() {
  const auth = useAuth()
  const navigate = useNavigate()
  const [emailNotify, setEmailNotify] = useState(true)
  const [smsNotify, setSmsNotify] = useState(false)
  const [orderAlerts, setOrderAlerts] = useState(true)
  const [messageAlerts, setMessageAlerts] = useState(true)
  const [twoFactor, setTwoFactor] = useState(false)

  const toggleClass = (on: boolean) =>
    `relative w-12 h-6 rounded-full transition-colors ${on ? "bg-primary dark:bg-primary-fixed" : "bg-outline-variant dark:bg-surface-container-highest"}`
  const dotClass = (on: boolean) =>
    `absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${on ? "translate-x-6" : "translate-x-0.5"}`

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-headline-lg text-headline-lg text-on-surface dark:text-primary-fixed">Settings</h1>
        <p className="text-on-surface-variant font-body-md text-body-md dark:text-outline-variant">
          Manage your account and preferences
        </p>
      </div>

      <div className="space-y-4">
        <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-surface-container-high dark:bg-surface-dim dark:border-surface-container">
          <div className="flex items-center gap-4 p-4 border-b border-outline-variant/20 dark:border-surface-container">
            <div className="w-12 h-12 rounded-full bg-primary-container/30 flex items-center justify-center text-primary dark:bg-primary-fixed/20 dark:text-primary-fixed">
              <User size={24} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-label-lg text-label-lg text-on-surface dark:text-primary-fixed">{auth.name}</p>
              <p className="text-label-sm text-on-surface-variant dark:text-outline-variant capitalize">{auth.role} account</p>
            </div>
            <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 text-label-sm font-label-sm dark:bg-emerald-900/20 dark:text-emerald-400">
              Verified
            </span>
          </div>
          <div className="p-4 space-y-3">
            <div className="flex items-center gap-3 py-2">
              <Mail size={18} className="text-on-surface-variant dark:text-outline-variant" />
              <span className="font-body-md text-body-md text-on-surface dark:text-primary-fixed">mukasa@p1gmarket.ug</span>
            </div>
            <div className="flex items-center gap-3 py-2">
              <Phone size={18} className="text-on-surface-variant dark:text-outline-variant" />
              <span className="font-body-md text-body-md text-on-surface dark:text-primary-fixed">0755 123 456</span>
            </div>
            <div className="flex items-center gap-3 py-2">
              <MapPin size={18} className="text-on-surface-variant dark:text-outline-variant" />
              <span className="font-body-md text-body-md text-on-surface dark:text-primary-fixed">Masaka, Uganda</span>
            </div>
            <div className="flex items-center gap-3 py-2">
              <Globe size={18} className="text-on-surface-variant dark:text-outline-variant" />
              <span className="font-body-md text-body-md text-on-surface dark:text-primary-fixed">Joined Jan 2022</span>
            </div>
          </div>
        </div>

        <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-surface-container-high dark:bg-surface-dim dark:border-surface-container">
          <div className="p-4 space-y-3">
            <h2 className="font-headline-md text-headline-md text-on-surface dark:text-primary-fixed flex items-center gap-2">
              <Bell size={20} />
              Notifications
            </h2>
            <div className="flex items-center justify-between py-2">
              <div>
                <span className="font-label-lg text-label-lg text-on-surface dark:text-primary-fixed">Email Notifications</span>
                <p className="text-label-sm text-on-surface-variant dark:text-outline-variant">Receive order updates via email</p>
              </div>
              <button onClick={() => setEmailNotify(!emailNotify)} className={toggleClass(emailNotify)}>
                <div className={dotClass(emailNotify)} />
              </button>
            </div>
            <div className="flex items-center justify-between py-2">
              <div>
                <span className="font-label-lg text-label-lg text-on-surface dark:text-primary-fixed">SMS Alerts</span>
                <p className="text-label-sm text-on-surface-variant dark:text-outline-variant">Get text messages for urgent orders</p>
              </div>
              <button onClick={() => setSmsNotify(!smsNotify)} className={toggleClass(smsNotify)}>
                <div className={dotClass(smsNotify)} />
              </button>
            </div>
            <div className="flex items-center justify-between py-2">
              <div>
                <span className="font-label-lg text-label-lg text-on-surface dark:text-primary-fixed">New Order Alerts</span>
                <p className="text-label-sm text-on-surface-variant dark:text-outline-variant">Notify when a new order is placed</p>
              </div>
              <button onClick={() => setOrderAlerts(!orderAlerts)} className={toggleClass(orderAlerts)}>
                <div className={dotClass(orderAlerts)} />
              </button>
            </div>
            <div className="flex items-center justify-between py-2">
              <div>
                <span className="font-label-lg text-label-lg text-on-surface dark:text-primary-fixed">Message Alerts</span>
                <p className="text-label-sm text-on-surface-variant dark:text-outline-variant">Notify when a buyer sends a message</p>
              </div>
              <button onClick={() => setMessageAlerts(!messageAlerts)} className={toggleClass(messageAlerts)}>
                <div className={dotClass(messageAlerts)} />
              </button>
            </div>
          </div>
        </div>

        <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-surface-container-high dark:bg-surface-dim dark:border-surface-container">
          <div className="p-4 space-y-3">
            <h2 className="font-headline-md text-headline-md text-on-surface dark:text-primary-fixed flex items-center gap-2">
              <Shield size={20} />
              Security
            </h2>
            <div className="flex items-center justify-between py-2">
              <div>
                <span className="font-label-lg text-label-lg text-on-surface dark:text-primary-fixed">Two-Factor Auth</span>
                <p className="text-label-sm text-on-surface-variant dark:text-outline-variant">Extra layer of security for your account</p>
              </div>
              <button onClick={() => setTwoFactor(!twoFactor)} className={toggleClass(twoFactor)}>
                <div className={dotClass(twoFactor)} />
              </button>
            </div>
            <div className="flex items-center gap-3 py-2">
              <span className="font-label-lg text-label-lg text-on-surface dark:text-primary-fixed">Password</span>
              <span className="ml-auto text-label-sm text-on-surface-variant dark:text-outline-variant">Last changed 3 months ago</span>
            </div>
            <div className="flex items-center gap-3 py-2">
              <span className="font-label-lg text-label-lg text-on-surface dark:text-primary-fixed">Devices</span>
              <span className="ml-auto text-label-sm text-on-surface-variant dark:text-outline-variant">2 active sessions</span>
            </div>
          </div>
        </div>

        <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-surface-container-high dark:bg-surface-dim dark:border-surface-container">
          <div className="p-4">
            <h2 className="font-headline-md text-headline-md text-on-surface dark:text-primary-fixed mb-4">Payment Details</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between py-2">
                <span className="font-label-lg text-label-lg text-on-surface dark:text-primary-fixed">Mobile Money</span>
                <span className="text-label-sm text-on-surface-variant dark:text-outline-variant">0755 123 456 (MTN)</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="font-label-lg text-label-lg text-on-surface dark:text-primary-fixed">Bank Account</span>
                <span className="text-label-sm text-on-surface-variant dark:text-outline-variant">UG3210001234567890</span>
              </div>
            </div>
          </div>
        </div>

        <button
          onClick={() => { auth.logout(); navigate("/login") }}
          className="w-full flex items-center justify-center gap-3 py-4 rounded-xl bg-surface-container-lowest shadow-sm border border-surface-container-high text-on-surface-variant hover:bg-error/5 hover:text-error transition-colors dark:bg-surface-dim dark:border-surface-container dark:text-outline-variant dark:hover:text-error"
        >
          <LogOut size={20} />
          <span className="font-label-lg text-label-lg">Sign Out</span>
        </button>
      </div>
    </div>
  )
}
