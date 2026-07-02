import type { Skill } from "@/types"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"

interface SkillMultiSelectProps {
  skills: Skill[]
  selectedIds: number[]
  onToggle: (id: number) => void
  variant?: "default" | "wanted"
}

export function SkillMultiSelect({ skills, selectedIds, onToggle, variant = "default" }: SkillMultiSelectProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {skills.map((skill) => {
        const active = selectedIds.includes(skill.id)
        return (
          <motion.button
            key={skill.id}
            type="button"
            whileTap={{ scale: 0.95 }}
            onClick={() => onToggle(skill.id)}
            className={cn(
              "flex items-center gap-1.5 rounded-full border px-3.5 py-2 text-sm font-medium transition-all",
              active
                ? variant === "wanted"
                  ? "border-pink-400/40 bg-pink-500/20 text-pink-100 shadow-md shadow-pink-500/10"
                  : "border-violet-400/40 bg-violet-500/20 text-violet-100 shadow-md shadow-violet-500/10"
                : "border-white/10 bg-white/[0.02] text-muted-foreground hover:border-white/20 hover:bg-white/5"
            )}
          >
            <span>{skill.icon}</span>
            {skill.name}
          </motion.button>
        )
      })}
    </div>
  )
}
