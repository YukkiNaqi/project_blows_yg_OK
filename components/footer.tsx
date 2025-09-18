import Link from "next/link"
import { Mail, Phone, MapPin, Clock } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-muted/50 border-t">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">B</span>
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-lg leading-none">BLOWS</span>
                <span className="text-xs text-muted-foreground leading-none">Network Solutions</span>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              Basic Layer Operating Widget System - Penyedia solusi jaringan terpercaya untuk kebutuhan bisnis Anda.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="font-semibold">Menu Utama</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/products" className="text-muted-foreground hover:text-primary transition-colors">
                  Produk
                </Link>
              </li>
              <li>
                <Link href="/services" className="text-muted-foreground hover:text-primary transition-colors">
                  Layanan
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-muted-foreground hover:text-primary transition-colors">
                  Tentang Kami
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-muted-foreground hover:text-primary transition-colors">
                  Kontak
                </Link>
              </li>
            </ul>
          </div>

          {/* Product Categories */}
          <div className="space-y-4">
            <h3 className="font-semibold">Kategori Produk</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/products?category=router"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Router
                </Link>
              </li>
              <li>
                <Link
                  href="/products?category=switch"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Switch
                </Link>
              </li>
              <li>
                <Link
                  href="/products?category=kabel"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Kabel LAN
                </Link>
              </li>
              <li>
                <Link
                  href="/products?category=access-point"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Access Point
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="font-semibold">Hubungi Kami</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-start space-x-2">
                <MapPin className="h-4 w-4 mt-0.5 text-primary" />
                <div>
                  <p className="text-muted-foreground">
                    Jakarta Timur, Kel. Cipayung
                    <br />
                    Kec. Ciracas, dekat SMAN 64
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-primary" />
                <span className="text-muted-foreground">088229157588</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-primary" />
                <span className="text-muted-foreground">BlowsSystem@gmail.com</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-primary" />
                <span className="text-muted-foreground">Senin - Sabtu: 08:00 - 17:00</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; 2024 BLOWS - Basic Layer Operating Widget System. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
