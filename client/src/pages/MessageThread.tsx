import { useState, useEffect, useRef } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { api } from "../lib/api"
import { formatDate, type ConversationDetail } from "../lib/data"
import { useAuth } from "../store/auth"
import { useMessages } from "../store/messages"
import { useToast } from "../store/toast"
import { ChevronLeft, Send, Package } from "lucide-react"

export function MessageThread() {
  const { conversationId } = useParams()
  const navigate = useNavigate()
  const auth = useAuth()
  const toast = useToast((s) => s.toast)
  const lastEvent = useMessages((s) => s.lastEvent)
  const [conversation, setConversation] = useState<ConversationDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [draft, setDraft] = useState("")
  const [sending, setSending] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  const fetchThread = () => {
    if (!conversationId) return Promise.resolve()
    return api.get(`/api/messages/${conversationId}`).then(setConversation)
  }

  useEffect(() => {
    setLoading(true)
    fetchThread()
      .catch(() => setConversation(null))
      .finally(() => setLoading(false))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conversationId])

  useEffect(() => {
    if (lastEvent?.conversationId === conversationId) {
      fetchThread().catch(() => { /* keep showing last known state */ })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lastEvent])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [conversation?.messages.length])

  const handleSend = async () => {
    const body = draft.trim()
    if (!body || !conversationId) return
    setSending(true)
    try {
      const message = await api.post(`/api/messages/${conversationId}/reply`, { body })
      setConversation((prev) => prev ? { ...prev, messages: [...prev.messages, message], lastMessage: body } : prev)
      setDraft("")
    } catch (err) {
      toast(err instanceof Error ? err.message : "Failed to send message", "error")
    } finally {
      setSending(false)
    }
  }

  if (loading) {
    return <div className="text-center py-12 text-on-surface-variant font-body-md dark:text-outline-variant">Loading conversation...</div>
  }

  if (!conversation) {
    return <div className="text-center py-12 text-on-surface-variant font-body-md dark:text-outline-variant">Conversation not found.</div>
  }

  const otherPartyName = auth.role === "buyer" ? conversation.sellerName : conversation.buyerName

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] lg:h-[calc(100vh-6rem)] max-w-2xl mx-auto pb-4">
      <div className="flex items-center gap-3 mb-4">
        <button
          onClick={() => navigate(`/${auth.role}/messages`)}
          className="text-on-surface-variant hover:text-on-surface dark:text-outline-variant dark:hover:text-primary-fixed"
        >
          <ChevronLeft size={22} />
        </button>
        <div>
          <p className="font-label-lg text-label-lg text-on-surface dark:text-primary-fixed">{otherPartyName}</p>
          {conversation.listingTitle && (
            <p className="flex items-center gap-1 text-label-sm text-on-surface-variant dark:text-outline-variant">
              <Package size={12} /> {conversation.listingTitle}
            </p>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto space-y-3 mb-4 px-1">
        {conversation.messages.map((m) => {
          const isMine = m.senderId === auth.userId
          return (
            <div key={m.id} className={`flex ${isMine ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[75%] rounded-xl px-4 py-2.5 ${
                  isMine
                    ? "bg-primary text-on-primary dark:bg-primary-fixed dark:text-on-primary-fixed"
                    : "bg-surface-container-lowest border border-surface-container-high text-on-surface dark:bg-surface-dim dark:border-surface-container dark:text-primary-fixed"
                }`}
              >
                <p className="text-body-md font-body-md whitespace-pre-wrap break-words">{m.body}</p>
                <p className={`text-[11px] mt-1 ${isMine ? "text-on-primary/70 dark:text-on-primary-fixed/70" : "text-on-surface-variant dark:text-outline-variant"}`}>
                  {formatDate(m.createdAt)}
                </p>
              </div>
            </div>
          )
        })}
        <div ref={bottomRef} />
      </div>

      <div className="flex items-end gap-2 border-t border-outline-variant/20 dark:border-surface-container pt-3">
        <textarea
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault()
              handleSend()
            }
          }}
          placeholder="Type a message..."
          rows={1}
          className="flex-1 px-4 py-3 bg-warm-beige border-none rounded-xl focus:ring-2 focus:ring-primary text-body-md resize-none dark:bg-surface-dim dark:text-primary-fixed dark:placeholder:text-outline"
        />
        <button
          onClick={handleSend}
          disabled={sending || !draft.trim()}
          className="p-3 rounded-xl bg-primary text-on-primary hover:bg-primary/90 transition-colors disabled:opacity-50 dark:bg-primary-fixed dark:text-on-primary-fixed"
        >
          <Send size={20} />
        </button>
      </div>
    </div>
  )
}
