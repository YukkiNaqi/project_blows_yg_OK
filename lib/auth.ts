// Mock authentication - in production, use proper JWT and bcrypt
export interface AuthUser {
  id: number
  username: string
  email: string
  full_name: string
  role: "superadmin" | "admin" | "customer"
}

// Mock user database with the specified admin credentials
const mockUsers = [
  {
    id: 1,
    username: "Agungsaputra",
    email: "agung@blows.com",
    password: "12345678910", // In production, this would be hashed
    full_name: "Agung Saputra",
    phone: "088229157588",
    role: "superadmin" as const,
    created_at: "2024-01-01T00:00:00Z",
  },
  {
    id: 2,
    username: "admin",
    email: "admin@blows.com",
    password: "admin123",
    full_name: "Admin BLOWS",
    phone: "088229157588",
    role: "admin" as const,
    created_at: "2024-01-01T00:00:00Z",
  },
]

// Rate limiting for login attempts
const loginAttempts = new Map<string, { count: number; lastAttempt: number }>()
const MAX_LOGIN_ATTEMPTS = 5
const LOCKOUT_DURATION = 15 * 60 * 1000 // 15 minutes

export class AuthError extends Error {
  constructor(
    message: string,
    public code: string,
  ) {
    super(message)
    this.name = "AuthError"
  }
}

export const auth = {
  // Login function with rate limiting
  login: async (username: string, password: string): Promise<AuthUser> => {
    // Input validation
    if (!username || !password) {
      throw new AuthError("Username and password are required", "MISSING_CREDENTIALS")
    }

    // Sanitize input
    const sanitizedUsername = username.trim().toLowerCase()

    // Check rate limiting
    const attemptKey = sanitizedUsername
    const attempts = loginAttempts.get(attemptKey)
    const now = Date.now()

    if (attempts && attempts.count >= MAX_LOGIN_ATTEMPTS) {
      const timeSinceLastAttempt = now - attempts.lastAttempt
      if (timeSinceLastAttempt < LOCKOUT_DURATION) {
        const remainingTime = Math.ceil((LOCKOUT_DURATION - timeSinceLastAttempt) / 60000)
        throw new AuthError(`Too many login attempts. Please try again in ${remainingTime} minutes.`, "RATE_LIMITED")
      } else {
        // Reset attempts after lockout period
        loginAttempts.delete(attemptKey)
      }
    }

    // Find user (case-insensitive username)
    const user = mockUsers.find(
      (u) => u.username.toLowerCase() === sanitizedUsername || u.email.toLowerCase() === sanitizedUsername,
    )

    if (!user || user.password !== password) {
      // Record failed attempt
      const currentAttempts = loginAttempts.get(attemptKey) || { count: 0, lastAttempt: 0 }
      loginAttempts.set(attemptKey, {
        count: currentAttempts.count + 1,
        lastAttempt: now,
      })

      throw new AuthError("Invalid username or password", "INVALID_CREDENTIALS")
    }

    // Clear failed attempts on successful login
    loginAttempts.delete(attemptKey)

    // Return user without password
    const { password: _, ...authUser } = user
    return authUser as AuthUser
  },

  // Validate session (mock implementation)
  validateSession: async (token: string): Promise<AuthUser | null> => {
    try {
      // In production, validate JWT token
      const payload = JSON.parse(atob(token))
      const user = mockUsers.find((u) => u.id === payload.userId)
      if (user) {
        const { password: _, ...authUser } = user
        return authUser as AuthUser
      }
      return null
    } catch {
      return null
    }
  },

  // Create session token (mock implementation)
  createSession: (user: AuthUser): string => {
    // In production, create proper JWT token
    const payload = {
      userId: user.id,
      username: user.username,
      role: user.role,
      exp: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
    }
    return btoa(JSON.stringify(payload))
  },

  // Check if user has required role
  hasRole: (user: AuthUser, requiredRole: string): boolean => {
    const roleHierarchy = {
      customer: 1,
      admin: 2,
      superadmin: 3,
    }

    const userLevel = roleHierarchy[user.role] || 0
    const requiredLevel = roleHierarchy[requiredRole as keyof typeof roleHierarchy] || 0

    return userLevel >= requiredLevel
  },

  // Logout
  logout: (): void => {
    // Clear session storage
    if (typeof window !== "undefined") {
      localStorage.removeItem("auth_token")
      localStorage.removeItem("auth_user")
    }
  },
}

// Client-side auth utilities
export const clientAuth = {
  // Get current user from localStorage
  getCurrentUser: (): AuthUser | null => {
    if (typeof window === "undefined") return null

    try {
      const userStr = localStorage.getItem("auth_user")
      return userStr ? JSON.parse(userStr) : null
    } catch {
      return null
    }
  },

  // Get auth token
  getToken: (): string | null => {
    if (typeof window === "undefined") return null
    return localStorage.getItem("auth_token")
  },

  // Set auth data
  setAuth: (user: AuthUser, token: string): void => {
    if (typeof window === "undefined") return

    localStorage.setItem("auth_user", JSON.stringify(user))
    localStorage.setItem("auth_token", token)
  },

  // Clear auth data
  clearAuth: (): void => {
    if (typeof window === "undefined") return

    localStorage.removeItem("auth_user")
    localStorage.removeItem("auth_token")
  },

  // Check if user is authenticated
  isAuthenticated: (): boolean => {
    return !!clientAuth.getCurrentUser()
  },

  // Check if user is admin
  isAdmin: (): boolean => {
    const user = clientAuth.getCurrentUser()
    return user ? auth.hasRole(user, "admin") : false
  },
}
