import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { parseCookies } from '@/lib/server-auth'

// Daftar route yang memerlukan autentikasi
const protectedRoutes = ['/admin']

// Daftar route yang memerlukan role admin
const adminRoutes = ['/admin']

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Cek apakah route saat ini adalah route yang dilindungi
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route))
  const isAdminRoute = adminRoutes.some(route => pathname.startsWith(route))

  // Jika bukan route yang dilindungi, lanjutkan
  if (!isProtectedRoute) {
    return NextResponse.next()
  }

  // Dapatkan token dari cookies
  const cookies = parseCookies(request.headers.get('cookie'))
  const token = cookies.auth_token

  // Jika tidak ada token, redirect ke halaman login
  if (!token) {
    const loginUrl = isAdminRoute ? '/admin/login' : '/login'
    return NextResponse.redirect(new URL(loginUrl, request.url))
  }

  // Untuk route admin, kita perlu memvalidasi token dan role
  if (isAdminRoute) {
    // Di sini seharusnya kita memvalidasi token dan memeriksa role
    // Karena ini adalah mock implementation, kita hanya memeriksa keberadaan token
    // Dalam produksi, kita akan memvalidasi JWT dan memeriksa claims
    try {
      // Parse token untuk mendapatkan informasi user
      const payload = JSON.parse(atob(token))

      // Periksa apakah token masih valid
      if (payload.exp && Date.now() > payload.exp) {
        // Token expired
        const loginUrl = '/admin/login'
        return NextResponse.redirect(new URL(loginUrl, request.url))
      }

      // Periksa apakah user memiliki role yang sesuai
      // Karena tidak bisa mengakses database secara async di middleware,
      // kita hanya memvalidasi struktur token dan role claim
      if (payload.role !== 'admin' && payload.role !== 'superadmin') {
        // Tidak memiliki akses admin
        return NextResponse.redirect(new URL('/', request.url))
      }
    } catch (error) {
      // Token tidak valid
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }
  }

  return NextResponse.next()
}

// Konfigurasi matcher untuk middleware
export const config = {
  matcher: [
    /*
     * Mengecualikan file dengan ekstensi statis
     * Mengecualikan route API dan _next
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}