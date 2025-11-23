// Common authentication types and utilities
// This file provides shared interfaces and functions that don't require database access

export interface AuthUser {
  id: number;
  username: string;
  email: string;
  full_name: string;
  role: "superadmin" | "admin" | "customer";
}

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

// Role hierarchy for access control
export const roleHierarchy = {
  customer: 1,
  admin: 2,
  superadmin: 3,
};

// Function to check if user has required role
export function hasRole(user: AuthUser, requiredRole: keyof typeof roleHierarchy): boolean {
  const userLevel = roleHierarchy[user.role] || 0;
  const requiredLevel = roleHierarchy[requiredRole] || 0;

  return userLevel >= requiredLevel;
}
