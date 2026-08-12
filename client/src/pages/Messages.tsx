import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { api } from "../lib/api"
import { formatDate, type Conversation } from "../lib/data"
import { useAuth } from "../store/auth"
import { MessageCircle, AlertCircle, Package } from "lucide-react"

export function Messages() {
  const navigate = useNavigate()
  const auth = useAuth()
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    setLoading(true)
    setError("")
    api.get("/api/messages")
      .then(setConversations)
      .catch(() => setError("Failed to load messages."))
      .finally(() => setLoading(false))
  }, [])

  const otherPartyName = (c: Conversation) => (auth.role === "buyer" ? c.sellerName : c.buyerName)

  return (
    <div className="pb-24">
      <div className="mb-6">
        <h1 className="font-headline-lg text-headline-lg text-on-surface dark:text-primary-fixed mb-1">Messages</h1>
        <p className="text-on-surface-variant font-body-md text-body-md dark:text-outline-variant">
          Conversations with {auth.role === "buyer" ? "sellers" : "buyers"}
        </p>
      </div>

      {loading ? (
        <div className="text-center py-12 text-on-surface-variant font-body-md dark:text-outline-variant">Loading messages...</div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center py-20">
          <AlertCircle size={48} className="text-error mb-4" />
          <p className="text-on-surface-variant font-body-lg text-body-lg dark:text-outline-variant">{error}</p>
        </div>
      ) : conversations.length === 0 ? (
        <div className="bg-surface-container-lowest rounded-xl p-12 shadow-sm border border-surface-container-high dark:bg-surface-dim dark:border-surface-container flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 rounded-full bg-primary-container/30 flex items-center justify-center text-primary mb-4 dark:bg-primary-fixed/20 dark:text-primary-fixed">
            <MessageCircle size={32} />
          </div>
          <h2 className="font-headline-md text-headline-md text-on-surface mb-2 dark:text-primary-fixed">No Messages Yet</h2>
          <p className="text-on-surface-variant font-body-md text-body-md max-w-sm dark:text-outline-variant">
            {auth.role === "buyer"
              ? "Message a seller from a listing to start a conversation."
              : "Conversations buyers start with you will show up here."}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {conversations.map((c) => (
            <div
              key={c.id}
              onClick={() => navigate(`/${auth.role}/messages/${c.id}`)}
              className="bg-surface-container-lowest rounded-xl p-5 shadow-sm border border-surface-container-high dark:bg-surface-dim dark:border-surface-container cursor-pointer hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-1">
                <p className="font-label-lg text-label-lg text-on-surface dark:text-primary-fixed">{otherPartyName(c)}</p>
                <div className="flex items-center gap-2">
                  <span className="text-label-sm text-on-surface-variant dark:text-outline-variant">{formatDate(c.lastMessageAt)}</span>
                  {c.unreadCount > 0 && (
                    <span className="inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full bg-primary text-on-primary text-[11px] font-bold dark:bg-primary-fixed dark:text-on-primary-fixed">
                      {c.unreadCount}
                    </span>
                  )}
                </div>
              </div>
              {c.listingTitle && (
                <p className="flex items-center gap-1 text-label-sm text-on-surface-variant dark:text-outline-variant mb-1">
                  <Package size={12} /> {c.listingTitle}
                </p>
              )}
              <p className={`text-body-md font-body-md truncate ${c.unreadCount > 0 ? "text-on-surface dark:text-primary-fixed font-semibold" : "text-on-surface-variant dark:text-outline-variant"}`}>
                {c.lastMessage}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
