import { useAuth } from "../store/auth"
import { ShieldAlert } from "lucide-react"

export function Suspended() {
  const auth = useAuth()

  return (
    <div className="min-h-screen bg-surface dark:bg-background flex items-center justify-center px-margin-mobile">
      <div className="w-full max-w-md text-center">
        <div className="w-16 h-16 rounded-full bg-error-container mx-auto flex items-center justify-center mb-6">
          <ShieldAlert size={32} className="text-error" />
        </div>
        <h1 className="font-headline-lg text-headline-lg text-on-surface dark:text-primary-fixed mb-2">
          Account Suspended
        </h1>
        <p className="font-body-md text-body-md text-on-surface-variant dark:text-outline-variant mb-8">
          Your account has been suspended. Please contact the administrator for more information.
        </p>
        {auth.email && (
          <p className="font-label-sm text-label-sm text-on-surface-variant dark:text-outline-variant mb-8">
            Reach out to your platform admin regarding: <span className="text-primary dark:text-primary-fixed">{auth.email}</span>
          </p>
        )}
        <button
          onClick={() => auth.logout()}
          className="font-label-lg text-label-lg text-primary hover:underline dark:text-primary-fixed"
        >
          Sign Out
        </button>
      </div>
    </div>
  )
}
