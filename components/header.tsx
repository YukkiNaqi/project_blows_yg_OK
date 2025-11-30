"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  Network,
  Menu,
  X,
  ShoppingBag,
  User,
  Search
} from "lucide-react"
import { useState, useEffect } from "react"
import { CartDrawer } from "@/components/cart/cart-drawer"

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  // Menangani scroll untuk efek header
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })

    // Cleanup event listener
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  return (
    <header className={`fixed w-full z-50 transition-all duration-300 ${
      isScrolled
        ? "bg-cyan-800/80 backdrop-blur-lg shadow-lg py-2"
        : "bg-cyan-600/90 backdrop-blur-sm py-4"
    }`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="p-2 rounded-lg bg-cyan-500 group-hover:bg-cyan-400 transition-colors">
              <Network className="h-6 w-6 text-white" />
            </div>
            <div className="flex flex-col items-start -ml-2">
              <span className="text-xl font-bold text-white group-hover:text-cyan-200 transition-colors">
                BLOWS
              </span>
              <span className="text-xs text-cyan-100">
                Basic Layer Operating Widget System
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            <Link
              href="/"
              className="px-4 py-2 rounded-lg text-white hover:bg-cyan-500 hover:text-white transition-all duration-300 transform hover:scale-105"
            >
              Beranda
            </Link>
            <Link
              href="/products"
              className="px-4 py-2 rounded-lg text-white hover:bg-cyan-500 hover:text-white transition-all duration-300 transform hover:scale-105"
            >
              Produk
            </Link>
            <Link
              href="/services"
              className="px-4 py-2 rounded-lg text-white hover:bg-cyan-500 hover:text-white transition-all duration-300 transform hover:scale-105"
            >
              Layanan
            </Link>
            <Link
              href="/about"
              className="px-4 py-2 rounded-lg text-white hover:bg-cyan-500 hover:text-white transition-all duration-300 transform hover:scale-105"
            >
              Tentang
            </Link>
            <Link
              href="/contact"
              className="px-4 py-2 rounded-lg text-white hover:bg-cyan-500 hover:text-white transition-all duration-300 transform hover:scale-105"
            >
              Kontak
            </Link>
          </nav>

          {/* Action Buttons */}
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="icon" className="relative">
              <Search className="h-5 w-5 text-foreground" />
            </Button>
            <Button variant="ghost" size="icon" className="relative" asChild>
              <Link href="/login">
                <User className="h-5 w-5 text-foreground" />
              </Link>
            </Button>
            <CartDrawer />
            <Button 
              variant="ghost" 
              size="icon" 
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <X className="h-5 w-5 text-foreground" />
              ) : (
                <Menu className="h-5 w-5 text-foreground" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 py-4 border-t bg-background">
            <nav className="flex flex-col space-y-2">
              <Link
                href="/"
                className="px-4 py-3 rounded-lg text-white hover:bg-cyan-500 hover:text-white transition-all duration-300"
                onClick={() => setIsMenuOpen(false)}
              >
                Beranda
              </Link>
              <Link
                href="/products"
                className="px-4 py-3 rounded-lg text-white hover:bg-cyan-500 hover:text-white transition-all duration-300"
                onClick={() => setIsMenuOpen(false)}
              >
                Produk
              </Link>
              <Link
                href="/services"
                className="px-4 py-3 rounded-lg text-white hover:bg-cyan-500 hover:text-white transition-all duration-300"
                onClick={() => setIsMenuOpen(false)}
              >
                Layanan
              </Link>
              <Link
                href="/about"
                className="px-4 py-3 rounded-lg text-white hover:bg-cyan-500 hover:text-white transition-all duration-300"
                onClick={() => setIsMenuOpen(false)}
              >
                Tentang
              </Link>
              <Link
                href="/contact"
                className="px-4 py-3 rounded-lg text-white hover:bg-cyan-500 hover:text-white transition-all duration-300"
                onClick={() => setIsMenuOpen(false)}
              >
                Kontak
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}