import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import { useAuth } from "@/context/AuthContext"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { messagesApi, notificationsApi } from "@/lib/api"
import type { Conversation, AppNotification } from "@/types"
import { timeAgo } from "@/lib/utils"
import { MessageCircle, Bell, Search, Pencil, ArrowRight } from "lucide-react"

export default function Dashboard() {
  const { user } = useAuth()
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [notifications, setNotifications] = useState<AppNotification[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([messagesApi.getConversations(), notificationsApi.getAll()])
      .then(([conv, notifs]) => {
        setConversations(conv)
        setNotifications(notifs.slice(0, 5))
      })
      .finally(() => setLoading(false))

    // Real-time-ish unread indicator: keep the Recent Chats unread badges
    // fresh in the background without a full page reload.
    const interval = setInterval(() => {
      messagesApi.getConversations().then(setConversations).catch(() => {})
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  if (!user) return null

  return (
    <div className="container py-10">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-3xl font-bold">Welcome back, {user.fullName.split(" ")[0]} 👋</h1>
        <p className="mt-1 text-muted-foreground">Here's what's happening with your skill exchanges.</p>
      </motion.div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Profile summary */}
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
          <Card className="h-full">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <h2 className="font-semibold">Your Profile</h2>
                <Link to="/profile">
                  <Button variant="ghost" size="sm">
                    <Pencil className="h-3.5 w-3.5" /> Edit
                  </Button>
                </Link>
              </div>

              <div className="mt-4 flex items-center gap-3">
                <Avatar src={user.photoUrl} name={user.fullName} size="lg" />
                <div>
                  <p className="font-medium">{user.fullName}</p>
                  <p className="text-sm text-muted-foreground">{user.location || "No location set"}</p>
                </div>
              </div>

              <p className="mt-4 line-clamp-3 text-sm text-muted-foreground">
                {user.bio || "You haven't added a bio yet. Tell others about yourself!"}
              </p>

              <div className="mt-5">
                <p className="mb-1.5 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">Teaches</p>
                <div className="flex flex-wrap gap-1.5">
                  {user.skillsOffered.length > 0 ? (
                    user.skillsOffered.map((s) => <Badge key={s.id}>{s.icon} {s.name}</Badge>)
                  ) : (
                    <span className="text-sm text-muted-foreground">None added yet</span>
                  )}
                </div>
              </div>

              <div className="mt-3">
                <p className="mb-1.5 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">Wants to learn</p>
                <div className="flex flex-wrap gap-1.5">
                  {user.skillsWanted.length > 0 ? (
                    user.skillsWanted.map((s) => <Badge key={s.id} variant="wanted">{s.icon} {s.name}</Badge>)
                  ) : (
                    <span className="text-sm text-muted-foreground">None added yet</span>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Recent conversations */}
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card className="h-full">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <h2 className="flex items-center gap-2 font-semibold">
                  <MessageCircle className="h-4 w-4 text-violet-400" /> Recent Chats
                </h2>
                <Link to="/messages" className="text-sm text-violet-400 hover:text-violet-300">
                  View all
                </Link>
              </div>

              <div className="mt-4 space-y-1">
                {loading ? (
                  <p className="text-sm text-muted-foreground">Loading...</p>
                ) : conversations.length === 0 ? (
                  <div className="py-6 text-center">
                    <p className="text-sm text-muted-foreground">No conversations yet.</p>
                    <Link to="/browse">
                      <Button variant="secondary" size="sm" className="mt-3">
                        Find someone to swap with
                      </Button>
                    </Link>
                  </div>
                ) : (
                  conversations.slice(0, 5).map((c) => (
                    <Link
                      key={c.partnerId}
                      to={`/messages?with=${c.partnerId}`}
                      className="flex items-center gap-3 rounded-xl p-2.5 transition-colors hover:bg-white/5"
                    >
                      <Avatar src={c.partnerPhotoUrl} name={c.partnerName} size="sm" />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between">
                          <p className="truncate text-sm font-medium">{c.partnerName}</p>
                          <span className="shrink-0 text-xs text-muted-foreground">{timeAgo(c.lastMessageAt)}</span>
                        </div>
                        <p className="truncate text-xs text-muted-foreground">{c.lastMessage}</p>
                      </div>
                      {c.unreadCount > 0 && (
                        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-violet-500 text-[10px] font-bold text-white">
                          {c.unreadCount}
                        </span>
                      )}
                    </Link>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Notifications + quick actions */}
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <h2 className="flex items-center gap-2 font-semibold">
                  <Bell className="h-4 w-4 text-violet-400" /> Notifications
                </h2>
                <Link to="/notifications" className="text-sm text-violet-400 hover:text-violet-300">
                  View all
                </Link>
              </div>

              <div className="mt-4 space-y-3">
                {loading ? (
                  <p className="text-sm text-muted-foreground">Loading...</p>
                ) : notifications.length === 0 ? (
                  <p className="py-4 text-center text-sm text-muted-foreground">No notifications yet.</p>
                ) : (
                  notifications.map((n) => (
                    <div key={n.id} className="flex gap-2.5">
                      <div className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${n.isRead ? "bg-transparent" : "bg-violet-400"}`} />
                      <div className="min-w-0">
                        <p className="line-clamp-2 text-sm text-foreground/90">{n.content}</p>
                        <p className="text-xs text-muted-foreground">{timeAgo(n.createdAt)}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          <Link to="/browse">
            <Card className="group cursor-pointer bg-gradient-to-br from-violet-600/20 to-fuchsia-600/10 transition-all hover:from-violet-600/30">
              <CardContent className="flex items-center justify-between p-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-fuchsia-600">
                    <Search className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="font-medium">Browse Skills</p>
                    <p className="text-xs text-muted-foreground">Find your next swap</p>
                  </div>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1" />
              </CardContent>
            </Card>
          </Link>
        </motion.div>
      </div>
    </div>
  )
}
