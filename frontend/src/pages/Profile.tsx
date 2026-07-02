import { useEffect, useRef, useState } from "react"
import { useSearchParams } from "react-router-dom"
import { motion } from "framer-motion"
import { useAuth } from "@/context/AuthContext"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar } from "@/components/ui/avatar"
import { SkillMultiSelect } from "@/components/SkillMultiSelect"
import { skillsApi, usersApi, getApiErrorMessage } from "@/lib/api"
import type { Skill } from "@/types"
import { toast } from "sonner"
import { Camera, Loader2, Sparkles } from "lucide-react"

export default function Profile() {
  const { user, setUser } = useAuth()
  const [searchParams] = useSearchParams()
  const isOnboarding = searchParams.get("onboarding") === "1"

  const [skills, setSkills] = useState<Skill[]>([])
  const [fullName, setFullName] = useState("")
  const [bio, setBio] = useState("")
  const [location, setLocation] = useState("")
  const [photoUrl, setPhotoUrl] = useState<string | null>(null)
  const [offeredIds, setOfferedIds] = useState<number[]>([])
  const [wantedIds, setWantedIds] = useState<number[]>([])
  const [saving, setSaving] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    skillsApi.getAll().then(setSkills).catch(() => toast.error("Could not load skills"))
  }, [])

  useEffect(() => {
    if (user) {
      setFullName(user.fullName)
      setBio(user.bio || "")
      setLocation(user.location || "")
      setPhotoUrl(user.photoUrl)
      setOfferedIds(user.skillsOffered.map((s) => s.id))
      setWantedIds(user.skillsWanted.map((s) => s.id))
    }
  }, [user])

  function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Image must be smaller than 2MB")
      return
    }
    const reader = new FileReader()
    reader.onload = () => setPhotoUrl(reader.result as string)
    reader.readAsDataURL(file)
  }

  function toggleOffered(id: number) {
    setOfferedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))
  }

  function toggleWanted(id: number) {
    setWantedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    try {
      const updated = await usersApi.updateMe({
        fullName,
        bio,
        location,
        photoUrl: photoUrl || "",
        skillsOfferedIds: offeredIds,
        skillsWantedIds: wantedIds,
      })
      setUser(updated)
      toast.success("Profile updated successfully")
    } catch (err) {
      toast.error(getApiErrorMessage(err, "Could not update profile"))
    } finally {
      setSaving(false)
    }
  }

  if (!user) return null

  return (
    <div className="container max-w-3xl py-10">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        {isOnboarding && (
          <div className="mb-6 flex items-center gap-3 rounded-xl border border-violet-400/20 bg-violet-500/10 px-4 py-3 text-sm">
            <Sparkles className="h-4 w-4 shrink-0 text-violet-400" />
            Welcome! Complete your profile so others can find you for a skill swap.
          </div>
        )}

        <h1 className="text-3xl font-bold">Your Profile</h1>
        <p className="mt-1 text-muted-foreground">This is how other members will see you.</p>
      </motion.div>

      <motion.form
        onSubmit={handleSave}
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mt-8 space-y-6"
      >
        <Card>
          <CardHeader>
            <CardTitle>Basic information</CardTitle>
            <CardDescription>Your name, photo, and where you're based</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="flex items-center gap-5">
              <div className="relative">
                <Avatar src={photoUrl} name={fullName || user.fullName} size="xl" />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-violet-600 to-fuchsia-600 shadow-lg ring-2 ring-background"
                >
                  <Camera className="h-4 w-4 text-white" />
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handlePhotoChange}
                />
              </div>
              <div>
                <p className="text-sm font-medium">Profile photo</p>
                <p className="text-xs text-muted-foreground">JPG or PNG, max 2MB</p>
              </div>
            </div>

            <div>
              <Label htmlFor="fullName">Full name</Label>
              <Input id="fullName" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
            </div>

            <div>
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                placeholder="e.g. Delhi, India"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                placeholder="Tell others about yourself and your skill journey..."
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                maxLength={500}
              />
              <p className="mt-1 text-right text-xs text-muted-foreground">{bio.length}/500</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Skills I can teach</CardTitle>
            <CardDescription>Select what you're able to offer in a skill swap</CardDescription>
          </CardHeader>
          <CardContent>
            <SkillMultiSelect skills={skills} selectedIds={offeredIds} onToggle={toggleOffered} variant="default" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Skills I want to learn</CardTitle>
            <CardDescription>Select what you'd like to learn from others</CardDescription>
          </CardHeader>
          <CardContent>
            <SkillMultiSelect skills={skills} selectedIds={wantedIds} onToggle={toggleWanted} variant="wanted" />
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" size="lg" disabled={saving}>
            {saving && <Loader2 className="h-4 w-4 animate-spin" />}
            Save Profile
          </Button>
        </div>
      </motion.form>
    </div>
  )
}
