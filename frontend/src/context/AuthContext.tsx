import { createContext, useContext, useState, useEffect, useCallback } from "react"
import type { ReactNode } from "react"
import type { UserProfile } from "@/types"
import { authApi, usersApi } from "@/lib/api"

interface AuthContextValue {
  user: UserProfile | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (fullName: string, email: string, password: string) => Promise<void>
  logout: () => void
  refreshUser: () => Promise<void>
  setUser: (u: UserProfile) => void
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)

  const refreshUser = useCallback(async () => {
    const token = localStorage.getItem("skillswap_token")
    if (!token) {
      setUser(null)
      setLoading(false)
      return
    }
    try {
      const profile = await usersApi.getMe()
      setUser(profile)
      localStorage.setItem("skillswap_user", JSON.stringify(profile))
    } catch {
      localStorage.removeItem("skillswap_token")
      localStorage.removeItem("skillswap_user")
      setUser(null)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    refreshUser()
  }, [refreshUser])

  // The axios interceptor in lib/api.ts reads the JWT fresh from localStorage
  // on every request. If a different account logs in from another tab of the
  // same browser, that overwrites the shared token -- but without this
  // listener, this tab's `user` state would keep showing the OLD account
  // while its API calls silently start being authenticated as the NEW one.
  // That desync is what causes message ownership (isMe) to compute against
  // the wrong id. Re-sync `user` any time the stored token/profile changes.
  useEffect(() => {
    function handleStorageChange(e: StorageEvent) {
      if (e.key === "skillswap_token" || e.key === "skillswap_user") {
        refreshUser()
      }
    }
    window.addEventListener("storage", handleStorageChange)
    return () => window.removeEventListener("storage", handleStorageChange)
  }, [refreshUser])

  const login = async (email: string, password: string) => {
    const response = await authApi.login({ email, password })

if (!response?.token) {
  throw new Error(
    "Login response did not include a token. Check VITE_API_URL / API connectivity."
  )
}
localStorage.setItem("skillswap_token", response.token)
localStorage.setItem("skillswap_user", JSON.stringify(response.user))
setUser(response.user)
  }

  const register = async (fullName: string, email: string, password: string) => {
    const response = await authApi.register({ fullName, email, password })

if (!response?.token) {
  throw new Error(
    "Register response did not include a token. Check VITE_API_URL / API connectivity."
  )
}

localStorage.setItem("skillswap_token", response.token)
localStorage.setItem("skillswap_user", JSON.stringify(response.user))
setUser(response.user)
  }

  const logout = () => {
    localStorage.removeItem("skillswap_token")
    localStorage.removeItem("skillswap_user")
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, refreshUser, setUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used within AuthProvider")
  return ctx
}
