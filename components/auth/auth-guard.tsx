"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { clientAuth, type AuthUser } from "@/lib/client-auth"

interface AuthGuardProps {
  children: React.ReactNode
  requireAuth?: boolean
  requireAdmin?: boolean
}

export function AuthGuard({ children, requireAuth = false, requireAdmin = false }: AuthGuardProps) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const checkAuth = () => {
      const currentUser = clientAuth.getCurrentUser()
      setIsLoading(false)

      // Validasi tambahan untuk memastikan user benar-benar terautentikasi
      if (currentUser) {
        const token = clientAuth.getToken()
        if (!token) {
          // Jika tidak ada token, hapus data user dan redirect
          clientAuth.clearAuth()
          setUser(null)
          
          if (requireAuth) {
            router.push("/login")
            return
          }
          
          if (requireAdmin) {
            router.push("/admin/login")
            return
          }
        } else {
          // Di produksi, kita akan memvalidasi token dengan server
          // Untuk sekarang, kita asumsikan token valid jika ada
          setUser(currentUser)
        }
      } else {
        setUser(null)
        
        if (requireAuth) {
          router.push("/login")
          return
        }
        
        if (requireAdmin) {
          router.push("/admin/login")
          return
        }
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

  // Jika memerlukan autentikasi dan user tidak ada, jangan render children
  if (requireAuth && !user) {
    // Redirect sudah dilakukan di useEffect, jadi kita hanya perlu return null atau fallback
    return null
  }

  // Jika memerlukan role admin dan user tidak memiliki akses admin, jangan render children
  if (requireAdmin && (!user || !clientAuth.isAdmin())) {
    // Redirect sudah dilakukan di useEffect, jadi kita hanya perlu return null atau fallback
    return null
  }

  return <>{children}</>
}
