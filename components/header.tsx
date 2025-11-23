"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Menu, User, Phone, Mail, LogOut, Settings } from "lucide-react"
import { clientAuth, type AuthUser } from "@/lib/client-auth"
import { CartDrawer } from "@/components/cart/cart-drawer"
import { motion } from "framer-motion"

export function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const [user, setUser] = useState<AuthUser | null>(null)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    // Periksa apakah user benar-benar terautentikasi
    const currentUser = clientAuth.getCurrentUser()
    if (currentUser) {
      // Validasi token
      const token = clientAuth.getToken()
      if (token) {
        // Di produksi, kita akan memvalidasi token dengan server
        // Untuk sekarang, kita asumsikan token valid jika ada
        setUser(currentUser)
      } else {
        // Jika tidak ada token, hapus data user dari localStorage
        clientAuth.clearAuth()
        setUser(null)
      }
    } else {
      setUser(null)
    }
  }, [])

  const handleLogout = () => {
    clientAuth.clearAuth()
    setUser(null)
    router.push("/")
  }

  const navigation = [
    { name: "Beranda", href: "/" },
    { name: "Produk", href: "/products" },
    { name: "Layanan", href: "/services" },
    { name: "Tentang Kami", href: "/about" },
    { name: "Kontak", href: "/contact" },
  ]

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <motion.div
              className="h-8 w-8 rounded bg-primary flex items-center justify-center"
              whileHover={{
                scale: 1.1,
                rotate: 5,
                transition: { duration: 0.2 }
              }}
              whileTap={{ scale: 0.9 }}
            >
              <span className="text-primary-foreground font-bold text-sm">B</span>
            </motion.div>
            <div className="flex flex-col">
              <motion.span
                className="font-bold text-lg leading-none"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                BLOWS
              </motion.span>
              <motion.span
                className="text-xs text-muted-foreground leading-none"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                Network Solutions
              </motion.span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <motion.div
                  key={item.name}
                  whileHover={{ y: -3 }}
                  whileTap={{ scale: 0.98 }}
                  className="relative"
                >
                  <Link
                    href={item.href}
                    className={`text-sm font-medium transition-colors ${isActive ? 'text-primary' : 'text-foreground hover:text-primary'}`}
                  >
                    <span className="relative z-10 px-3 py-2">{item.name}</span>
                  </Link>
                  {isActive && (
                    <motion.div
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full"
                      layoutId="navbarIndicator"
                      initial={false}
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                  <motion.div
                    className="absolute bottom-0 left-1/4 right-1/4 h-px bg-transparent"
                    initial={false}
                    animate={{
                      backgroundColor: isActive ? 'var(--primary)' : 'transparent',
                    }}
                    transition={{ duration: 0.3 }}
                  />
                </motion.div>
              );
            })}
          </nav>

          {/* Contact Info & Actions */}
          <div className="hidden lg:flex items-center space-x-4">
            <motion.div
              className="flex items-center space-x-2 text-sm text-muted-foreground"
              whileHover={{ x: 5 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              <Phone className="h-4 w-4" />
              <span>088229157588</span>
            </motion.div>

            <CartDrawer />

            {user ? (
              <DropdownMenu>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">
                      <User className="h-4 w-4 mr-2" />
                      {user.full_name}
                    </Button>
                  </DropdownMenuTrigger>
                </motion.div>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>
                    <User className="h-4 w-4 mr-2" />
                    Profil
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Settings className="h-4 w-4 mr-2" />
                    Pengaturan
                  </DropdownMenuItem>
                  {clientAuth.isAdmin() && (
                    <DropdownMenuItem asChild>
                      <Link href="/admin">
                        <Settings className="h-4 w-4 mr-2" />
                        Admin Panel
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button asChild size="sm">
                  <Link href="/login">
                    <User className="h-4 w-4 mr-2" />
                    Login
                  </Link>
                </Button>
              </motion.div>
            )}
          </div>

          {/* Mobile Menu */}
          <div className="flex items-center space-x-2 md:hidden">
            <CartDrawer />
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <SheetTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Menu className="h-4 w-4" />
                  </Button>
                </SheetTrigger>
              </motion.div>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <nav className="flex flex-col space-y-4 mt-6">
                  {navigation.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                      <motion.div
                        key={item.name}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.2, delay: 0.1 * navigation.indexOf(item) }}
                        whileHover={{ x: 5 }}
                      >
                        <Link
                          href={item.href}
                          className={`text-lg font-medium transition-colors ${isActive ? 'text-primary' : 'text-foreground hover:text-primary'}`}
                          onClick={() => setIsOpen(false)}
                        >
                          {item.name}
                        </Link>
                      </motion.div>
                    );
                  })}
                  <div className="pt-4 border-t">
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-4">
                      <Phone className="h-4 w-4" />
                      <span>088229157588</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-4">
                      <Mail className="h-4 w-4" />
                      <span>BlowsSystem@gmail.com</span>
                    </div>

                    {user ? (
                      <div className="space-y-2">
                        <p className="text-sm font-medium">Halo, {user.full_name}</p>
                        {clientAuth.isAdmin() && (
                          <Button asChild variant="outline" className="w-full bg-transparent">
                            <Link href="/admin">Admin Panel</Link>
                          </Button>
                        )}
                        <Button onClick={handleLogout} variant="outline" className="w-full bg-transparent">
                          <LogOut className="h-4 w-4 mr-2" />
                          Logout
                        </Button>
                      </div>
                    ) : (
                      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                        <Button asChild className="w-full">
                          <Link href="/login">
                            <User className="h-4 w-4 mr-2" />
                            Login
                          </Link>
                        </Button>
                      </motion.div>
                    )}
                  </div>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  )
}
