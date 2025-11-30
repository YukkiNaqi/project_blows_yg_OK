import Link from "next/link"
import { Network, MapPin, Phone, Mail, Clock } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-cyan-800 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex flex-col items-center mb-4">
              <div className="p-2 rounded-lg bg-cyan-600">
                <Network className="h-6 w-6 text-white" />
              </div>
              <div className="flex flex-col items-center mt-2">
                <span className="text-xl font-bold text-white">BLOWS</span>
                <span className="text-xs text-cyan-100">
                  Basic Layer Operating Widget System
                </span>
              </div>
            </div>
            <p className="text-sm text-cyan-100 mb-4">
              Basic Layer Operating Widget System - Solusi jaringan terpercaya dengan peralatan berkualitas dan layanan profesional sejak 2015.
            </p>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold text-cyan-200 mb-4">Kontak Kami</h3>
            <ul className="space-y-2">
              <li className="flex items-start space-x-2">
                <MapPin className="h-4 w-4 mt-0.5 text-cyan-300 flex-shrink-0" />
                <span className="text-sm text-cyan-100">Jl. Jati No.123, Jakarta Timur, DKI Jakarta</span>
              </li>
              <li className="flex items-start space-x-2">
                <Phone className="h-4 w-4 mt-0.5 text-cyan-300 flex-shrink-0" />
                <span className="text-sm text-cyan-100">+62 21 1234 5678</span>
              </li>
              <li className="flex items-start space-x-2">
                <Mail className="h-4 w-4 mt-0.5 text-cyan-300 flex-shrink-0" />
                <span className="text-sm text-cyan-100">info@blows.id</span>
              </li>
              <li className="flex items-start space-x-2">
                <Clock className="h-4 w-4 mt-0.5 text-cyan-300 flex-shrink-0" />
                <span className="text-sm text-cyan-100">Senin - Sabtu: 08:00 - 17:00 WIB</span>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold text-cyan-200 mb-4">Tautan Cepat</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-sm text-white hover:text-cyan-300 transition-colors duration-300">
                  Beranda
                </Link>
              </li>
              <li>
                <Link href="/products" className="text-sm text-white hover:text-cyan-300 transition-colors duration-300">
                  Produk
                </Link>
              </li>
              <li>
                <Link href="/services" className="text-sm text-white hover:text-cyan-300 transition-colors duration-300">
                  Layanan
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-sm text-white hover:text-cyan-300 transition-colors duration-300">
                  Tentang Kami
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-sm text-white hover:text-cyan-300 transition-colors duration-300">
                  Kontak
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-semibold text-cyan-200 mb-4">Layanan Kami</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/services" className="text-sm text-white hover:text-cyan-300 transition-colors duration-300">
                  Instalasi Jaringan
                </Link>
              </li>
              <li>
                <Link href="/services" className="text-sm text-white hover:text-cyan-300 transition-colors duration-300">
                  Maintenance & Support
                </Link>
              </li>
              <li>
                <Link href="/services" className="text-sm text-white hover:text-cyan-300 transition-colors duration-300">
                  Konsultasi Jaringan
                </Link>
              </li>
              <li>
                <Link href="/services" className="text-sm text-white hover:text-cyan-300 transition-colors duration-300">
                  Konfigurasi Perangkat
                </Link>
              </li>
              <li>
                <Link href="/services" className="text-sm text-white hover:text-cyan-300 transition-colors duration-300">
                  Troubleshooting
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-cyan-700 mt-8 pt-8 text-center text-sm text-cyan-200">
          <p>© {new Date().getFullYear()} BLOWS - Basic Layer Operating Widget System. Hak Cipta Dilindungi.</p>
        </div>
      </div>
    </footer>
  )
}