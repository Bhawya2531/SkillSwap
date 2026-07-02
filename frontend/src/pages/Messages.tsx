import { useEffect, useRef, useState, useCallback } from "react"
import { useSearchParams } from "react-router-dom"
import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Avatar } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { messagesApi, usersApi, getApiErrorMessage } from "@/lib/api"
import { useAuth } from "@/context/AuthContext"
import type { Conversation, Message, UserSummary } from "@/types"
import { timeAgo, cn } from "@/lib/utils"
import { toast } from "sonner"
import { Send, MessageCircle, Loader2 } from "lucide-react"

export default function Messages() {
  const { user } = useAuth()
  const [searchParams, setSearchParams] = useSearchParams()
  const partnerIdParam = searchParams.get("with")

  const [conversations, setConversations] = useState<Conversation[]>([])
  const [activePartnerId, setActivePartnerId] = useState<number | null>(
    partnerIdParam ? Number(partnerIdParam) : null
  )
  const [activePartner, setActivePartner] = useState<UserSummary | null>(null)
  const [chatMessages, setChatMessages] = useState<Message[]>([])
  const [draft, setDraft] = useState("")
  const [loadingConvos, setLoadingConvos] = useState(true)
  const [loadingChat, setLoadingChat] = useState(false)
  const [sending, setSending] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  const activePartnerIdRef = useRef<number | null>(activePartnerId)

  useEffect(() => {
    activePartnerIdRef.current = activePartnerId
  }, [activePartnerId])

  // Silent refresh: updates conversation list (last message + unread badges)
  // without toggling the loading spinner, so it can be polled in the background.
  const refreshConversations = useCallback(() => {
    return messagesApi.getConversations().then(setConversations)
  }, [])

  const loadConversations = useCallback(() => {
    refreshConversations().finally(() => setLoadingConvos(false))
  }, [refreshConversations])

  useEffect(() => {
    loadConversations()
    // Real-time-ish unread indicator: poll the conversation list so a new
    // incoming message's unread badge / preview shows up without a manual reload.
    const interval = setInterval(refreshConversations, 4000)
    return () => clearInterval(interval)
    // Re-runs whenever the authenticated user changes (e.g. a different
    // account logs in from another tab and this tab re-syncs), so stale
    // conversation data from a previous identity is never shown.
  }, [loadConversations, refreshConversations, user?.id])

  const loadChat = useCallback(
    (partnerId: number, opts: { silent?: boolean } = {}) => {
      if (!opts.silent) setLoadingChat(true)
      return Promise.all([messagesApi.getConversation(partnerId), usersApi.getById(partnerId)])
        .then(([msgs, partner]) => {
          setChatMessages(msgs)
          setActivePartner(partner)
        })
        .catch(() => {
          if (!opts.silent) toast.error("Could not load conversation")
        })
        .finally(() => {
          if (!opts.silent) setLoadingChat(false)
        })
    },
    []
  )

  useEffect(() => {
    if (!activePartnerId) return

    // Opening a chat marks its messages as read on the backend. Reflect that
    // in the conversation list immediately instead of waiting for the next poll.
    setConversations((prev) =>
      prev.map((c) => (c.partnerId === activePartnerId ? { ...c, unreadCount: 0 } : c))
    )

    loadChat(activePartnerId).then(() => refreshConversations())

    // Poll the open chat for new incoming messages while it's active, and
    // keep marking them read (backend does this on every GET).
    const interval = setInterval(() => {
      if (activePartnerIdRef.current === activePartnerId) {
        loadChat(activePartnerId, { silent: true }).then(() => refreshConversations())
      }
    }, 4000)
    return () => clearInterval(interval)
  }, [activePartnerId, loadChat, refreshConversations, user?.id])

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" })
  }, [chatMessages])

  function selectConversation(partnerId: number) {
    setActivePartnerId(partnerId)
    setSearchParams({ with: String(partnerId) })
  }

  async function handleSend(e: React.FormEvent) {
    e.preventDefault()
    if (!activePartnerId || !draft.trim()) return
    setSending(true)
    try {
      const sent = await messagesApi.send(activePartnerId, draft.trim())
      setChatMessages((prev) => [...prev, sent])
      setDraft("")
      refreshConversations()
    } catch (err) {
      toast.error(getApiErrorMessage(err, "Could not send message"))
    } finally {
      setSending(false)
    }
  }

  if (!user) return null

  return (
    <div className="container py-10">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold">Messages</h1>
        <p className="mt-1 text-muted-foreground">Your private conversations with other members.</p>
      </motion.div>

      <div className="mt-8 grid gap-5 lg:grid-cols-[340px_1fr]" style={{ height: "70vh" }}>
        {/* Conversation list */}
        <Card className="flex flex-col overflow-hidden">
          <div className="border-b border-white/5 p-4">
            <h2 className="font-semibold">Conversations</h2>
          </div>
          <div className="flex-1 overflow-y-auto scrollbar-thin p-2">
            {loadingConvos ? (
              <div className="flex justify-center py-10">
                <Loader2 className="h-5 w-5 animate-spin text-primary" />
              </div>
            ) : conversations.length === 0 ? (
              <div className="flex flex-col items-center py-10 text-center">
                <MessageCircle className="h-8 w-8 text-muted-foreground" />
                <p className="mt-3 text-sm text-muted-foreground">No conversations yet</p>
              </div>
            ) : (
              conversations.map((c) => (
                <button
                  key={c.partnerId}
                  onClick={() => selectConversation(c.partnerId)}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-xl p-3 text-left transition-colors",
                    activePartnerId === c.partnerId ? "bg-white/10" : "hover:bg-white/5"
                  )}
                >
                  <Avatar src={c.partnerPhotoUrl} name={c.partnerName} size="md" />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <p className="truncate text-sm font-medium">{c.partnerName}</p>
                      <span className="shrink-0 text-[11px] text-muted-foreground">{timeAgo(c.lastMessageAt)}</span>
                    </div>
                    <p className="truncate text-xs text-muted-foreground">{c.lastMessage}</p>
                  </div>
                  {c.unreadCount > 0 && (
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-violet-500 text-[10px] font-bold text-white">
                      {c.unreadCount}
                    </span>
                  )}
                </button>
              ))
            )}
          </div>
        </Card>

        {/* Chat panel */}
        <Card className="flex flex-col overflow-hidden">
          {!activePartnerId ? (
            <div className="flex flex-1 flex-col items-center justify-center text-center">
              <MessageCircle className="h-10 w-10 text-muted-foreground" />
              <p className="mt-4 font-medium">Select a conversation</p>
              <p className="mt-1 text-sm text-muted-foreground">Choose a chat from the list to start messaging.</p>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-3 border-b border-white/5 p-4">
                {activePartner && (
                  <>
                    <Avatar src={activePartner.photoUrl} name={activePartner.fullName} size="md" />
                    <div>
                      <p className="font-medium">{activePartner.fullName}</p>
                      {activePartner.location && (
                        <p className="text-xs text-muted-foreground">{activePartner.location}</p>
                      )}
                    </div>
                  </>
                )}
              </div>

              <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto scrollbar-thin p-5">
                {loadingChat ? (
                  <div className="flex justify-center py-10">
                    <Loader2 className="h-5 w-5 animate-spin text-primary" />
                  </div>
                ) : (
                  chatMessages.map((m) => {
                    // Ownership is decided strictly by comparing the message's
                    // senderId to the authenticated user's id (from /users/me,
                    // which is resolved server-side from the JWT) -- never by name.
                    const isMe = Number(m.senderId) === Number(user.id)
                    return (
                      <motion.div
                        key={m.id}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={cn("flex", isMe ? "justify-end" : "justify-start")}
                      >
                        <div
                          className={cn(
                            "max-w-[75%] rounded-2xl px-4 py-2.5 text-sm",
                            isMe
                              ? "bg-gradient-to-br from-violet-600 to-fuchsia-600 text-white"
                              : "glass text-foreground/90"
                          )}
                        >
                          <p className="whitespace-pre-wrap break-words">{m.content}</p>
                          <p className={cn("mt-1 text-[10px]", isMe ? "text-white/70" : "text-muted-foreground")}>
                            {timeAgo(m.sentAt)}
                          </p>
                        </div>
                      </motion.div>
                    )
                  })
                )}
              </div>

              <form onSubmit={handleSend} className="flex items-end gap-2 border-t border-white/5 p-4">
                <Textarea
                  placeholder="Type a message..."
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  rows={1}
                  className="min-h-[44px] flex-1"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault()
                      handleSend(e)
                    }
                  }}
                />
                <Button type="submit" size="icon" disabled={sending || !draft.trim()}>
                  {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                </Button>
              </form>
            </>
          )}
        </Card>
      </div>
    </div>
  )
}
