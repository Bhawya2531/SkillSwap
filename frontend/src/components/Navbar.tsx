import { Link, useLocation, useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import { useAuth } from "@/context/AuthContext"
import { Avatar } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { notificationsApi } from "@/lib/api"
import { Bell, LayoutDashboard, LogOut, MessageCircle, Search, Repeat2 } from "lucide-react"
import { motion } from "framer-motion"

export function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    if (!user) return
    const fetchCount = () => {
      notificationsApi.getUnreadCount().then((r) => setUnreadCount(r.count)).catch(() => {})
    }
    fetchCount()
    const interval = setInterval(fetchCount, 15000)
    return () => clearInterval(interval)
  }, [user, location.pathname])

  const handleLogout = () => {
    logout()
    navigate("/")
  }

  const navLinks = [
    { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { to: "/browse", label: "Browse", icon: Search },
    { to: "/messages", label: "Messages", icon: MessageCircle },
  ]

  return (
    <nav className="sticky top-0 z-40 border-b border-white/5 glass-strong">
      <div className="container flex h-16 items-center justify-between">
        <Link to={user ? "/dashboard" : "/"} className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-fuchsia-600 shadow-lg shadow-violet-600/30">
            <Repeat2 className="h-5 w-5 text-white" />
          </div>
          <span className="text-lg font-bold tracking-tight">SkillSwap</span>
        </Link>

        {user ? (
          <div className="flex items-center gap-1 sm:gap-2">
            {navLinks.map((link) => {
              const Icon = link.icon
              const active = location.pathname === link.to
              return (
                <Link key={link.to} to={link.to}>
                  <Button
                    variant={active ? "secondary" : "ghost"}
                    size="sm"
                    className="hidden sm:inline-flex"
                  >
                    <Icon className="h-4 w-4" />
                    {link.label}
                  </Button>
                  <Button variant={active ? "secondary" : "ghost"} size="icon" className="sm:hidden">
                    <Icon className="h-4 w-4" />
                  </Button>
                </Link>
              )
            })}

            <Link to="/notifications" className="relative">
              <Button variant="ghost" size="icon">
                <Bell className="h-4 w-4" />
              </Button>
              {unreadCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-gradient-to-br from-pink-500 to-rose-500 text-[10px] font-bold text-white"
                >
                  {unreadCount > 9 ? "9+" : unreadCount}
                </motion.span>
              )}
            </Link>

            <Link to="/profile" className="ml-1">
              <Avatar src={user.photoUrl} name={user.fullName} size="sm" />
            </Link>

            <Button variant="ghost" size="icon" onClick={handleLogout} title="Log out">
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Link to="/login">
              <Button variant="ghost">Log in</Button>
            </Link>
            <Link to="/register">
              <Button>Get Started</Button>
            </Link>
          </div>
        )}
      </div>
    </nav>
  )
}
