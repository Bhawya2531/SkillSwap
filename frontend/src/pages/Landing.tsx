import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { motion } from "framer-motion"
import {
  ArrowRight,
  Repeat2,
  Users,
  MessageCircle,
  Sparkles,
  Code2,
  Palette,
  Camera,
  Guitar,
  ChefHat,
  Dumbbell,
  Video,
  Brush,
} from "lucide-react"

const skillIcons = [
  { icon: Code2, label: "Java" },
  { icon: Sparkles, label: "Python" },
  { icon: Palette, label: "UI/UX Design" },
  { icon: Brush, label: "Graphic Design" },
  { icon: Camera, label: "Photography" },
  { icon: Video, label: "Video Editing" },
  { icon: Guitar, label: "Guitar" },
  { icon: ChefHat, label: "Baking" },
  { icon: Dumbbell, label: "Fitness" },
]

const steps = [
  {
    title: "Create your profile",
    description: "List the skills you can teach and the ones you're eager to learn.",
    icon: Users,
  },
  {
    title: "Find your match",
    description: "Browse and search for people whose skills complement yours.",
    icon: Repeat2,
  },
  {
    title: "Start the exchange",
    description: "Message each other, agree on a swap, and start learning together.",
    icon: MessageCircle,
  },
]

export default function Landing() {
  return (
    <div className="relative overflow-hidden">
      {/* Hero */}
      <section className="relative bg-hero-gradient">
        <div className="container flex flex-col items-center py-24 text-center sm:py-32">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-6 inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 text-sm text-muted-foreground"
          >
            <Sparkles className="h-3.5 w-3.5 text-violet-400" />
            No money, just skills
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="max-w-3xl text-5xl font-bold leading-tight tracking-tight sm:text-6xl md:text-7xl"
          >
            Trade skills,
            <br />
            <span className="text-gradient">not money.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-6 max-w-xl text-lg text-muted-foreground"
          >
            SkillSwap connects people who want to teach what they know for what they want to learn.
            "I teach Java and want to learn Baking" — it's that simple.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-10 flex flex-col gap-4 sm:flex-row"
          >
            <Link to="/register">
              <Button size="lg" className="group">
                Start Swapping Skills
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <Link to="/login">
              <Button size="lg" variant="secondary">
                I already have an account
              </Button>
            </Link>
          </motion.div>

          {/* Floating skill chips */}
          <div className="relative mt-24 hidden w-full max-w-4xl md:block">
            {skillIcons.map((s, i) => {
              const Icon = s.icon
              const positions = [
                "left-0 top-0",
                "left-1/4 -top-4",
                "left-1/2 top-2",
                "left-[68%] -top-6",
                "right-0 top-4",
                "left-8 top-24",
                "left-1/3 top-28",
                "right-16 top-28",
                "right-1/3 top-8",
              ]
              return (
                <motion.div
                  key={s.label}
                  animate={{ y: [0, -14, 0] }}
                  transition={{ duration: 5 + (i % 3), repeat: Infinity, delay: i * 0.3 }}
                  className={`absolute ${positions[i % positions.length]} hidden lg:flex`}
                >
                  <div className="flex items-center gap-2 rounded-full glass px-4 py-2 text-sm shadow-lg">
                    <Icon className="h-4 w-4 text-violet-400" />
                    {s.label}
                  </div>
                </motion.div>
              )
            })}
            <div className="h-40" />
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="container py-24">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold sm:text-4xl">How SkillSwap works</h2>
          <p className="mt-4 text-muted-foreground">Three simple steps to your next skill.</p>
        </div>

        <div className="mt-16 grid gap-6 sm:grid-cols-3">
          {steps.map((step, i) => {
            const Icon = step.icon
            return (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <Card className="h-full">
                  <CardContent className="p-8">
                    <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 to-fuchsia-600 shadow-lg shadow-violet-600/20">
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold">{step.title}</h3>
                    <p className="mt-2 text-sm text-muted-foreground">{step.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </div>
      </section>

      {/* Skills grid */}
      <section className="container py-24">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold sm:text-4xl">Skills people are swapping</h2>
          <p className="mt-4 text-muted-foreground">From code to cake — everyone has something to teach.</p>
        </div>

        <div className="mt-14 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
          {skillIcons.map((s, i) => {
            const Icon = s.icon
            return (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: i * 0.04 }}
                whileHover={{ scale: 1.05, y: -4 }}
              >
                <Card className="flex flex-col items-center justify-center gap-3 p-6 text-center">
                  <Icon className="h-7 w-7 text-violet-400" />
                  <span className="text-sm font-medium">{s.label}</span>
                </Card>
              </motion.div>
            )
          })}
        </div>
      </section>

      {/* CTA */}
      <section className="container pb-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <Card className="relative overflow-hidden bg-gradient-to-br from-violet-600/20 via-fuchsia-600/10 to-transparent">
            <CardContent className="flex flex-col items-center gap-6 p-16 text-center">
              <h2 className="text-3xl font-bold sm:text-4xl">Ready to trade your skills?</h2>
              <p className="max-w-lg text-muted-foreground">
                Join SkillSwap today and turn what you know into what you want to learn.
              </p>
              <Link to="/register">
                <Button size="lg" className="group">
                  Join SkillSwap Free
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </motion.div>
      </section>
    </div>
  )
}
