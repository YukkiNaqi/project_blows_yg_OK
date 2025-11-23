// Client-side authentication utilities
// This file contains auth functions that run on the client and use localStorage/cookies

export interface AuthUser {
  id: number;
  username: string;
  email: string;
  full_name: string;
  role: "superadmin" | "admin" | "customer";
}

// Utility function to clear invalid auth data
export function clearInvalidAuthData(): void {
  if (typeof window === "undefined") return;

  try {
    // Periksa apakah ada data user di localStorage
    const userStr = localStorage.getItem("auth_user");
    const token = localStorage.getItem("auth_token");

    // Jika tidak ada token, hapus data user
    if (!token) {
      localStorage.removeItem("auth_user");
      return;
    }

    // Jika ada data user tetapi tidak valid, hapus semua data
    if (userStr) {
      try {
        JSON.parse(userStr);
      } catch {
        // Data user tidak valid, hapus semua data autentikasi
        localStorage.removeItem("auth_user");
        localStorage.removeItem("auth_token");
        document.cookie = "auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
      }
    }
  } catch (error) {
    // Jika terjadi error, hapus semua data autentikasi
    localStorage.removeItem("auth_user");
    localStorage.removeItem("auth_token");
    document.cookie = "auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
  }
}

// Inactivity timer for automatic logout after 5 minutes
let inactivityTimer: NodeJS.Timeout | null = null;
const INACTIVITY_TIMEOUT = 5 * 60 * 1000; // 5 minutes in milliseconds

// Reset inactivity timer
function resetInactivityTimer() {
  if (typeof window === "undefined") return;

  // Clear existing timer
  if (inactivityTimer) {
    clearTimeout(inactivityTimer);
  }

  // Set new timer
  inactivityTimer = setTimeout(() => {
    // Logout user after inactivity
    clientAuth.clearAuth();

    // Redirect to login page (admin or regular login)
    const currentPath = window.location.pathname;
    if (currentPath.startsWith('/admin')) {
      window.location.href = '/admin/login';
    } else {
      window.location.href = '/login';
    }
  }, INACTIVITY_TIMEOUT);
}

// Initialize inactivity listeners
function initializeInactivityListeners() {
  if (typeof window === "undefined") return;

  // Reset timer on user activity
  ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click', 'keydown'].forEach(eventType => {
    document.addEventListener(eventType, resetInactivityTimer, true);
  });

  // Initialize the first timer
  resetInactivityTimer();
}

// Client-side auth utilities
export const clientAuth = {
  // Get current user from localStorage
  getCurrentUser: (): AuthUser | null => {
    if (typeof window === "undefined") return null;

    try {
      const userStr = localStorage.getItem("auth_user");
      const token = localStorage.getItem("auth_token");

      // Jika tidak ada token, hapus data user
      if (!token) {
        localStorage.removeItem("auth_user");
        return null;
      }

      // Jika ada data user, validasi
      if (userStr) {
        const user = JSON.parse(userStr);
        // Di produksi, kita akan memvalidasi token dengan server
        // Untuk sekarang, kita asumsikan token valid jika ada
        return user;
      }

      return null;
    } catch {
      // Jika terjadi error, hapus data autentikasi
      localStorage.removeItem("auth_user");
      localStorage.removeItem("auth_token");
      document.cookie = "auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
      return null;
    }
  },

  // Get auth token
  getToken: (): string | null => {
    if (typeof window === "undefined") return null;

    try {
      const token = localStorage.getItem("auth_token");

      // Jika tidak ada token, hapus data user
      if (!token) {
        localStorage.removeItem("auth_user");
        return null;
      }

      // Validasi token
      const payload = JSON.parse(atob(token));

      // Periksa apakah token masih valid
      if (payload.exp && Date.now() > payload.exp) {
        // Token expired, hapus semua data autentikasi
        localStorage.removeItem("auth_user");
        localStorage.removeItem("auth_token");
        document.cookie = "auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
        return null;
      }

      return token;
    } catch {
      // Jika terjadi error, hapus data autentikasi
      localStorage.removeItem("auth_user");
      localStorage.removeItem("auth_token");
      document.cookie = "auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
      return null;
    }
  },

  // Set auth data in localStorage and cookies
  setAuth: (user: AuthUser, token: string): void => {
    if (typeof window === "undefined") return;

    // Store in localStorage for client-side access
    localStorage.setItem("auth_user", JSON.stringify(user));
    localStorage.setItem("auth_token", token);

    // Store in cookies for server-side access
    document.cookie = `auth_token=${token}; path=/; max-age=86400; SameSite=Lax`;

    // Initialize inactivity timer after setting auth
    initializeInactivityListeners();
  },

  // Clear auth data
  clearAuth: (): void => {
    if (typeof window === "undefined") return;

    // Remove from localStorage
    localStorage.removeItem("auth_user");
    localStorage.removeItem("auth_token");

    // Remove from cookies
    document.cookie = "auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";

    // Clear inactivity timer
    if (inactivityTimer) {
      clearTimeout(inactivityTimer);
      inactivityTimer = null;
    }
  },

  // Check if user is authenticated
  isAuthenticated: (): boolean => {
    return !!clientAuth.getCurrentUser();
  },

  // Check if user is admin
  isAdmin: (): boolean => {
    const user = clientAuth.getCurrentUser();
    if (!user) return false;

    const roleHierarchy = {
      customer: 1,
      admin: 2,
      superadmin: 3,
    };

    const userLevel = roleHierarchy[user.role] || 0;
    const adminLevel = roleHierarchy["admin"] || 0;

    return userLevel >= adminLevel;
  },
};