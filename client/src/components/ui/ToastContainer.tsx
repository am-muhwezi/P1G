import { CheckCircle, XCircle, Info, X } from "lucide-react"
import { useToast, type ToastType } from "../../store/toast"

const styles: Record<ToastType, string> = {
  success: "bg-emerald-50 border-emerald-200 text-emerald-800 dark:bg-emerald-900/30 dark:border-emerald-700 dark:text-emerald-300",
  error: "bg-red-50 border-red-200 text-red-800 dark:bg-red-900/30 dark:border-red-700 dark:text-red-300",
  info: "bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-900/30 dark:border-blue-700 dark:text-blue-300",
}

const icons: Record<ToastType, React.ReactNode> = {
  success: <CheckCircle size={18} className="shrink-0 mt-0.5" />,
  error: <XCircle size={18} className="shrink-0 mt-0.5" />,
  info: <Info size={18} className="shrink-0 mt-0.5" />,
}

export function ToastContainer() {
  const { toasts, dismiss } = useToast()
  if (!toasts.length) return null
  return (
    <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2 max-w-sm">
      {toasts.map((t) => (
        <div
          key={`${t.id}-${t.bump}`}
          className={`flex items-start gap-3 px-4 py-3 rounded-xl shadow-lg border animate-slide-in ${styles[t.type]}`}
        >
          {icons[t.type]}
          <p className="font-label-sm text-label-sm flex-1">{t.message}</p>
          <button onClick={() => dismiss(t.id)} className="shrink-0 opacity-60 hover:opacity-100 transition-opacity">
            <X size={14} />
          </button>
        </div>
      ))}
    </div>
  )
}
