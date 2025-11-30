// Server-side authentication utilities
// This file contains auth functions that run on the server and can access the database

import { createDbConnection } from './db-config';
import { User } from './server-db';

type UserWithPassword = User & { password?: string };

export interface AuthUser {
  id: number;
  username: string;
  email: string;
  full_name: string;
  role: "superadmin" | "admin" | "customer";
}

// Rate limiting for login attempts
const loginAttempts = new Map<string, { count: number; lastAttempt: number }>();
const MAX_LOGIN_ATTEMPTS = 5;
const LOCKOUT_DURATION = 15 * 60 * 1000; // 15 minutes

export class AuthError extends Error {
  constructor(
    message: string,
    public code: string,
  ) {
    super(message);
    this.name = "AuthError";
  }
}

export const serverAuth = {
  // Login function with rate limiting - SERVER SIDE ONLY
  login: async (username: string, password: string): Promise<AuthUser> => {
    // Input validation
    if (!username || !password) {
      throw new AuthError("Username and password are required", "MISSING_CREDENTIALS");
    }

    // Sanitize input
    const sanitizedUsername = username.trim().toLowerCase();

    // Check rate limiting
    const attemptKey = sanitizedUsername;
    const attempts = loginAttempts.get(attemptKey);
    const now = Date.now();

    if (attempts && attempts.count >= MAX_LOGIN_ATTEMPTS) {
      const timeSinceLastAttempt = now - attempts.lastAttempt;
      if (timeSinceLastAttempt < LOCKOUT_DURATION) {
        const remainingTime = Math.ceil((LOCKOUT_DURATION - timeSinceLastAttempt) / 60000);
        throw new AuthError(`Too many login attempts. Please try again in ${remainingTime} minutes.`, "RATE_LIMITED");
      } else {
        // Reset attempts after lockout period
        loginAttempts.delete(attemptKey);
      }
    }

    try {
      // Find user from database (case-insensitive username)
      const connection = await createDbConnection();
      const [rows] = await connection.execute(
        'SELECT id, username, email, password, full_name, role FROM users WHERE (username = ? OR email = ?) AND password = ?',
        [sanitizedUsername, sanitizedUsername, password]
      );
      await connection.end();

      const results = rows as UserWithPassword[];
      const user = results[0];

      if (!user) {
        // Record failed attempt
        const currentAttempts = loginAttempts.get(attemptKey) || { count: 0, lastAttempt: 0 };
        loginAttempts.set(attemptKey, {
          count: currentAttempts.count + 1,
          lastAttempt: now,
        });

        throw new AuthError("Invalid username or password", "INVALID_CREDENTIALS");
      }

      // Clear failed attempts on successful login
      loginAttempts.delete(attemptKey);

      // Return user without password
      const { password: _, ...authUser } = user;
      return {
        id: authUser.id,
        username: authUser.username,
        email: authUser.email,
        full_name: authUser.full_name,
        role: authUser.role as "superadmin" | "admin" | "customer"
      };
    } catch (error) {
      // Record failed attempt
      const currentAttempts = loginAttempts.get(attemptKey) || { count: 0, lastAttempt: 0 };
      loginAttempts.set(attemptKey, {
        count: currentAttempts.count + 1,
        lastAttempt: now,
      });

      throw new AuthError("Database error occurred during login", "DATABASE_ERROR");
    }
  },

  // Validate session - SERVER SIDE ONLY
  validateSession: async (token: string): Promise<AuthUser | null> => {
    try {
      // In production, validate JWT token properly
      const payload = JSON.parse(atob(token));

      // Check if token is expired
      if (payload.exp && Date.now() > payload.exp) {
        return null;
      }

      // Check if user exists in database
      const connection = await createDbConnection();
      const [rows] = await connection.execute(
        'SELECT id, username, email, full_name, role FROM users WHERE id = ?',
        [payload.userId]
      );
      await connection.end();

      const results = rows as User[];
      const user = results[0];

      if (user) {
        return {
          id: user.id,
          username: user.username,
          email: user.email,
          full_name: user.full_name,
          role: user.role as "superadmin" | "admin" | "customer"
        };
      }
      return null;
    } catch {
      return null;
    }
  },

  // Create session token (24-hour expiry, with separate inactivity timeout on client-side)
  createSession: (user: AuthUser): string => {
    // In production, create proper JWT token
    const payload = {
      userId: user.id,
      username: user.username,
      role: user.role,
      exp: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
    };
    return btoa(JSON.stringify(payload));
  },

  // Check if user has required role
  hasRole: (user: AuthUser, requiredRole: string): boolean => {
    const roleHierarchy = {
      customer: 1,
      admin: 2,
      superadmin: 3,
    };

    const userLevel = roleHierarchy[user.role] || 0;
    const requiredLevel = roleHierarchy[requiredRole as keyof typeof roleHierarchy] || 0;

    return userLevel >= requiredLevel;
  },
};

// Utility function to parse cookies
export function parseCookies(cookieHeader: string | null): Record<string, string> {
  if (!cookieHeader) return {};

  const cookies: Record<string, string> = {};
  const items = cookieHeader.split(';');

  items.forEach(item => {
    const [name, value] = item.trim().split('=');
    if (name && value) {
      cookies[name] = decodeURIComponent(value);
    }
  });

  return cookies;
}