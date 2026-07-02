import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar } from "@/components/ui/avatar"
import { notificationsApi } from "@/lib/api"
import type { AppNotification } from "@/types"
import { timeAgo, cn } from "@/lib/utils"
import { Bell, CheckCheck, Loader2, MessageCircle } from "lucide-react"

export default function Notifications() {
  const [notifications, setNotifications] = useState<AppNotification[]>([])
  const [loading, setLoading] = useState(true)

  function load() {
    setLoading(true)
    notificationsApi.getAll().then(setNotifications).finally(() => setLoading(false))
  }

  useEffect(() => {
    load()
  }, [])

  async function handleMarkRead(id: number) {
    const updated = await notificationsApi.markAsRead(id)
    setNotifications((prev) => prev.map((n) => (n.id === id ? updated : n)))
  }

  async function handleMarkAllRead() {
    await notificationsApi.markAllAsRead()
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })))
  }

  const hasUnread = notifications.some((n) => !n.isRead)

  return (
    <div className="container max-w-2xl py-10">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Notifications</h1>
          <p className="mt-1 text-muted-foreground">Stay up to date with your skill exchanges.</p>
        </div>
        {hasUnread && (
          <Button variant="secondary" size="sm" onClick={handleMarkAllRead}>
            <CheckCheck className="h-3.5 w-3.5" /> Mark all read
          </Button>
        )}
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="mt-8">
        <Card>
          <CardContent className="p-2">
            {loading ? (
              <div className="flex justify-center py-16">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              </div>
            ) : notifications.length === 0 ? (
              <div className="flex flex-col items-center py-16 text-center">
                <Bell className="h-10 w-10 text-muted-foreground" />
                <p className="mt-4 font-medium">No notifications yet</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  You'll be notified here when someone messages you.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-white/5">
                {notifications.map((n) => (
                  <button
                    key={n.id}
                    onClick={() => !n.isRead && handleMarkRead(n.id)}
                    className={cn(
                      "flex w-full items-start gap-3 rounded-xl p-4 text-left transition-colors hover:bg-white/5",
                      !n.isRead && "bg-violet-500/5"
                    )}
                  >
                    {n.actorId ? (
                      <Avatar src={n.actorPhotoUrl} name={n.actorName || "?"} size="md" />
                    ) : (
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/5">
                        <MessageCircle className="h-4 w-4 text-muted-foreground" />
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <p className={cn("text-sm", !n.isRead ? "font-medium text-foreground" : "text-foreground/80")}>
                        {n.content}
                      </p>
                      <p className="mt-1 text-xs text-muted-foreground">{timeAgo(n.createdAt)}</p>
                    </div>
                    {!n.isRead && <div className="mt-2 h-2 w-2 shrink-0 rounded-full bg-violet-400" />}
                  </button>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
