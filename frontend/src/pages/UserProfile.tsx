import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { usersApi, messagesApi, getApiErrorMessage } from "@/lib/api"
import type { UserSummary } from "@/types"
import { toast } from "sonner"
import { MapPin, MessageCircle, Loader2, ArrowLeft, Send } from "lucide-react"

export default function UserProfile() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [profile, setProfile] = useState<UserSummary | null>(null)
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [message, setMessage] = useState("")
  const [sending, setSending] = useState(false)

  useEffect(() => {
    if (!id) return
    setLoading(true)
    usersApi
      .getById(Number(id))
      .then(setProfile)
      .catch(() => toast.error("Could not load this profile"))
      .finally(() => setLoading(false))
  }, [id])

  async function handleSendMessage() {
    if (!profile || !message.trim()) return
    setSending(true)
    try {
      await messagesApi.send(profile.id, message.trim())
      toast.success(`Message sent to ${profile.fullName}`)
      setDialogOpen(false)
      setMessage("")
      navigate(`/messages?with=${profile.id}`)
    } catch (err) {
      toast.error(getApiErrorMessage(err, "Could not send message"))
    } finally {
      setSending(false)
    }
  }

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="container py-24 text-center">
        <p className="text-muted-foreground">User not found.</p>
      </div>
    )
  }

  return (
    <div className="container max-w-3xl py-10">
      <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="mb-4">
        <ArrowLeft className="h-4 w-4" /> Back
      </Button>

      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}>
        <Card>
          <CardContent className="p-8">
            <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:items-start sm:text-left">
              <Avatar src={profile.photoUrl} name={profile.fullName} size="xl" />
              <div className="flex-1">
                <h1 className="text-2xl font-bold">{profile.fullName}</h1>
                {profile.location && (
                  <p className="mt-1 flex items-center justify-center gap-1 text-sm text-muted-foreground sm:justify-start">
                    <MapPin className="h-3.5 w-3.5" /> {profile.location}
                  </p>
                )}
                <div className="mt-4">
                  <Button onClick={() => setDialogOpen(true)}>
                    <MessageCircle className="h-4 w-4" /> Send Message
                  </Button>
                </div>
              </div>
            </div>

            {profile.bio && (
              <div className="mt-8">
                <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">About</h2>
                <p className="text-foreground/90">{profile.bio}</p>
              </div>
            )}

            <div className="mt-8 grid gap-6 sm:grid-cols-2">
              <div>
                <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                  Teaches
                </h2>
                {profile.skillsOffered.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {profile.skillsOffered.map((s) => (
                      <Badge key={s.id}>{s.icon} {s.name}</Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No skills listed yet.</p>
                )}
              </div>

              <div>
                <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                  Wants to learn
                </h2>
                {profile.skillsWanted.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {profile.skillsWanted.map((s) => (
                      <Badge key={s.id} variant="wanted">{s.icon} {s.name}</Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No skills listed yet.</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} title={`Message ${profile.fullName}`}>
        <div className="space-y-4">
          <Textarea
            placeholder={`Hi ${profile.fullName.split(" ")[0]}, I'd love to swap skills with you...`}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={5}
            autoFocus
          />
          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSendMessage} disabled={sending || !message.trim()}>
              {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              Send
            </Button>
          </div>
        </div>
      </Dialog>
    </div>
  )
}
