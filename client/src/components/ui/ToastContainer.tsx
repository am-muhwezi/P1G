import { CheckCircle, XCircle, X } from "lucide-react"
import { useToast } from "../../store/toast"

export function ToastContainer() {
  const { toasts, dismiss } = useToast()
  if (!toasts.length) return null
  return (
    <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2 max-w-sm">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`flex items-start gap-3 px-4 py-3 rounded-xl shadow-lg border animate-slide-in ${
            t.type === "success"
              ? "bg-emerald-50 border-emerald-200 text-emerald-800 dark:bg-emerald-900/30 dark:border-emerald-700 dark:text-emerald-300"
              : "bg-red-50 border-red-200 text-red-800 dark:bg-red-900/30 dark:border-red-700 dark:text-red-300"
          }`}
        >
          {t.type === "success" ? <CheckCircle size={18} className="shrink-0 mt-0.5" /> : <XCircle size={18} className="shrink-0 mt-0.5" />}
          <p className="font-label-sm text-label-sm flex-1">{t.message}</p>
          <button onClick={() => dismiss(t.id)} className="shrink-0 opacity-60 hover:opacity-100 transition-opacity">
            <X size={14} />
          </button>
        </div>
      ))}
    </div>
  )
}
