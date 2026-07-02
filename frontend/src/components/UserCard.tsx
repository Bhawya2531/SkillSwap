import { Link } from "react-router-dom"
import type { UserSummary } from "@/types"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { motion } from "framer-motion"
import { MapPin } from "lucide-react"

export function UserCard({ user, index = 0 }: { user: UserSummary; index?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.05 }}
      whileHover={{ y: -4 }}
    >
      <Link to={`/users/${user.id}`}>
        <Card className="h-full transition-all hover:shadow-2xl hover:shadow-violet-900/20 hover:border-white/20 cursor-pointer">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <Avatar src={user.photoUrl} name={user.fullName} size="lg" />
              <div className="min-w-0">
                <h3 className="truncate font-semibold text-foreground">{user.fullName}</h3>
                {user.location && (
                  <p className="flex items-center gap-1 text-xs text-muted-foreground">
                    <MapPin className="h-3 w-3" /> {user.location}
                  </p>
                )}
              </div>
            </div>

            {user.bio && (
              <p className="mt-3 line-clamp-2 text-sm text-muted-foreground">{user.bio}</p>
            )}

            {user.skillsOffered.length > 0 && (
              <div className="mt-4">
                <p className="mb-1.5 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">Teaches</p>
                <div className="flex flex-wrap gap-1.5">
                  {user.skillsOffered.slice(0, 3).map((s) => (
                    <Badge key={s.id}>{s.icon} {s.name}</Badge>
                  ))}
                  {user.skillsOffered.length > 3 && (
                    <Badge variant="outline">+{user.skillsOffered.length - 3}</Badge>
                  )}
                </div>
              </div>
            )}

            {user.skillsWanted.length > 0 && (
              <div className="mt-3">
                <p className="mb-1.5 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">Wants to learn</p>
                <div className="flex flex-wrap gap-1.5">
                  {user.skillsWanted.slice(0, 3).map((s) => (
                    <Badge key={s.id} variant="wanted">{s.icon} {s.name}</Badge>
                  ))}
                  {user.skillsWanted.length > 3 && (
                    <Badge variant="outline">+{user.skillsWanted.length - 3}</Badge>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  )
}
