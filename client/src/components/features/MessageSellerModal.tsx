import { useState } from "react"
import { MessageCircle, X } from "lucide-react"

interface MessageSellerModalProps {
  open: boolean
  sellerName: string
  listingTitle: string
  onSend: (body: string) => Promise<void>
  onClose: () => void
}

export function MessageSellerModal({ open, sellerName, listingTitle, onSend, onClose }: MessageSellerModalProps) {
  const [body, setBody] = useState("")
  const [sending, setSending] = useState(false)

  if (!open) return null

  const handleSend = async () => {
    const trimmed = body.trim()
    if (!trimmed) return
    setSending(true)
    try {
      await onSend(trimmed)
      setBody("")
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={onClose}>
      <div className="bg-surface-container-lowest rounded-2xl shadow-xl w-full max-w-sm dark:bg-surface-dim" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-6 border-b border-outline-variant/30 dark:border-surface-container">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary-container/30 text-primary flex items-center justify-center dark:bg-primary-fixed/20 dark:text-primary-fixed">
              <MessageCircle size={20} />
            </div>
            <h2 className="font-headline-md text-headline-md text-on-surface dark:text-primary-fixed">Message {sellerName}</h2>
          </div>
          <button onClick={onClose} className="text-on-surface-variant hover:text-on-surface dark:text-outline-variant dark:hover:text-primary-fixed">
            <X size={24} />
          </button>
        </div>
        <div className="p-6">
          <p className="text-label-sm text-on-surface-variant dark:text-outline-variant mb-2">About: {listingTitle}</p>
          <textarea
            autoFocus
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder={`Hi, is this still available?`}
            rows={4}
            className="w-full px-4 py-3 bg-warm-beige border-none rounded-xl focus:ring-2 focus:ring-primary text-body-md resize-none dark:bg-surface-container dark:text-primary-fixed dark:placeholder:text-outline"
          />
        </div>
        <div className="flex justify-end gap-3 p-6 border-t border-outline-variant/30 dark:border-surface-container">
          <button
            onClick={onClose}
            className="px-6 py-3 rounded-xl font-label-lg text-label-lg border border-outline-variant text-on-surface-variant hover:bg-surface-container transition-colors dark:border-outline dark:text-outline-variant dark:hover:bg-surface-container"
          >
            Cancel
          </button>
          <button
            onClick={handleSend}
            disabled={sending || !body.trim()}
            className="px-6 py-3 rounded-xl font-label-lg text-label-lg bg-primary text-on-primary hover:bg-primary/90 transition-colors disabled:opacity-50 dark:bg-primary-fixed dark:text-on-primary-fixed"
          >
            {sending ? "Sending..." : "Send"}
          </button>
        </div>
      </div>
    </div>
  )
}
