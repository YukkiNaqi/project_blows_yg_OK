"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { clientAuth, type AuthUser } from "@/lib/auth"

interface AuthGuardProps {
  children: React.ReactNode
  requireAuth?: boolean
  requireAdmin?: boolean
  fallback?: React.ReactNode
}

export function AuthGuard({ children, requireAuth = false, requireAdmin = false, fallback }: AuthGuardProps) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const checkAuth = () => {
      const currentUser = clientAuth.getCurrentUser()
      setUser(currentUser)
      setIsLoading(false)

      if (requireAuth && !currentUser) {
        router.push("/login")
        return
      }

      if (requireAdmin && (!currentUser || !clientAuth.isAdmin())) {
        router.push("/admin/login")
        return
      }
    }

    checkAuth()
  }, [requireAuth, requireAdmin, router])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (requireAuth && !user) {
    return fallback || null
  }

  if (requireAdmin && (!user || !clientAuth.isAdmin())) {
    return fallback || null
  }

  return <>{children}</>
}
