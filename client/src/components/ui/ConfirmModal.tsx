import { AlertTriangle, X } from "lucide-react"

interface ConfirmModalProps {
  open: boolean
  title: string
  message: string
  confirmLabel?: string
  onConfirm: () => void
  onCancel: () => void
  loading?: boolean
}

export function ConfirmModal({ open, title, message, confirmLabel = "Delete", onConfirm, onCancel, loading }: ConfirmModalProps) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="bg-surface-container-lowest rounded-2xl shadow-xl w-full max-w-sm dark:bg-surface-dim">
        <div className="flex items-center justify-between p-6 border-b border-outline-variant/30 dark:border-surface-container">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-error-container/30 text-error flex items-center justify-center">
              <AlertTriangle size={20} />
            </div>
            <h2 className="font-headline-md text-headline-md text-on-surface dark:text-primary-fixed">{title}</h2>
          </div>
          <button onClick={onCancel} className="text-on-surface-variant hover:text-on-surface dark:text-outline-variant dark:hover:text-primary-fixed">
            <X size={24} />
          </button>
        </div>
        <div className="p-6">
          <p className="text-body-md text-on-surface-variant dark:text-outline-variant">{message}</p>
        </div>
        <div className="flex justify-end gap-3 p-6 border-t border-outline-variant/30 dark:border-surface-container">
          <button
            onClick={onCancel}
            className="px-6 py-3 rounded-xl font-label-lg text-label-lg border border-outline-variant text-on-surface-variant hover:bg-surface-container transition-colors dark:border-outline dark:text-outline-variant dark:hover:bg-surface-container"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="px-6 py-3 rounded-xl font-label-lg text-label-lg bg-error text-on-error hover:bg-error/90 transition-colors disabled:opacity-50"
          >
            {loading ? "Deleting..." : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
