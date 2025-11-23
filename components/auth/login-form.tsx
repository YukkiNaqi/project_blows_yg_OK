"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Eye, EyeOff, Lock, User, AlertCircle } from "lucide-react"
import { clientAuth, type AuthUser } from "@/lib/client-auth"

interface LoginFormProps {
  redirectTo?: string
  isAdminLogin?: boolean
}

export function LoginForm({ redirectTo = "/", isAdminLogin = false }: LoginFormProps) {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      // Input validation
      if (!formData.username.trim() || !formData.password) {
        throw new Error("Please fill in all fields")
      }

      // Call login API route
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: formData.username,
          password: formData.password,
          isAdminLogin
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Login failed')
      }

      if (!data.success) {
        throw new Error(data.error || 'Login failed')
      }

      const { user, token } = data;

      // Store user and token in client-side storage
      clientAuth.setAuth(user, token)

      // Redirect based on user role and context
      if (isAdminLogin || ['admin', 'superadmin'].includes(user.role)) {
        router.push("/admin")
      } else {
        router.push(redirectTo)
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (error) setError("")
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <div className="flex items-center justify-center mb-4">
          <div className="h-12 w-12 rounded bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-xl">B</span>
          </div>
        </div>
        <CardTitle className="text-2xl">{isAdminLogin ? "Admin Login" : "Login ke BLOWS"}</CardTitle>
        <CardDescription>
          {isAdminLogin ? "Masuk ke panel administrasi BLOWS" : "Masuk ke akun Anda untuk melanjutkan"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="username">Username atau Email</Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="username"
                type="text"
                placeholder={isAdminLogin ? "Masukkan username admin" : "Username atau email"}
                value={formData.username}
                onChange={(e) => handleInputChange("username", e.target.value)}
                className="pl-10"
                disabled={isLoading}
                autoComplete="username"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Masukkan password"
                value={formData.password}
                onChange={(e) => handleInputChange("password", e.target.value)}
                className="pl-10 pr-10"
                disabled={isLoading}
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                disabled={isLoading}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Memproses..." : isAdminLogin ? "Login Admin" : "Login"}
          </Button>

          {isAdminLogin && (
            <div className="mt-4 p-3 bg-muted/50 rounded-lg">
              <p className="text-sm text-muted-foreground text-center">
                <strong>Demo Credentials:</strong>
                <br />
                Username: Agungsaputra
                <br />
                Password: 123
              </p>
            </div>
          )}

          {!isAdminLogin && (
            <div className="text-center text-sm text-muted-foreground">
              Belum punya akun?{" "}
              <button type="button" className="text-primary hover:underline">
                Daftar sekarang
              </button>
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  )
}
