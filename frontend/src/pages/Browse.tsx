import { useEffect, useState, useCallback } from "react"
import { motion } from "framer-motion"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { UserCard } from "@/components/UserCard"
import { skillsApi, usersApi } from "@/lib/api"
import type { Skill, UserSummary } from "@/types"
import { Search, Loader2, Users } from "lucide-react"

export default function Browse() {
  const [skills, setSkills] = useState<Skill[]>([])
  const [users, setUsers] = useState<UserSummary[]>([])
  const [query, setQuery] = useState("")
  const [selectedSkill, setSelectedSkill] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    skillsApi.getAll().then(setSkills)
  }, [])

  const fetchUsers = useCallback(() => {
    setLoading(true)
    usersApi
      .browse({ query: query || undefined, skillId: selectedSkill ?? undefined })
      .then(setUsers)
      .finally(() => setLoading(false))
  }, [query, selectedSkill])

  useEffect(() => {
    const timeout = setTimeout(fetchUsers, 300)
    return () => clearTimeout(timeout)
  }, [fetchUsers])

  return (
    <div className="container py-10">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold">Browse Skill Swappers</h1>
        <p className="mt-1 text-muted-foreground">Find people who teach what you want to learn.</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="mt-8 space-y-4"
      >
        <div className="relative">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by name or bio..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-11"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <button onClick={() => setSelectedSkill(null)}>
            <Badge variant={selectedSkill === null ? "default" : "outline"} className="cursor-pointer px-4 py-1.5">
              All Skills
            </Badge>
          </button>
          {skills.map((s) => (
            <button key={s.id} onClick={() => setSelectedSkill(s.id)}>
              <Badge variant={selectedSkill === s.id ? "default" : "outline"} className="cursor-pointer px-4 py-1.5">
                {s.icon} {s.name}
              </Badge>
            </button>
          ))}
        </div>
      </motion.div>

      <div className="mt-10">
        {loading ? (
          <div className="flex justify-center py-24">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        ) : users.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <Users className="h-10 w-10 text-muted-foreground" />
            <p className="mt-4 font-medium">No members found</p>
            <p className="mt-1 text-sm text-muted-foreground">Try a different search or skill filter.</p>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {users.map((u, i) => (
              <UserCard key={u.id} user={u} index={i} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
