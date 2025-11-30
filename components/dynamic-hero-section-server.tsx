import { dbDirect, type Product } from "@/lib/server-db"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Network, Wifi, Router } from "lucide-react"
import Link from "next/link"
import { HeroCarousel } from "./hero-carousel"

// Data produk untuk hero section - menggunakan produk dari database
async function getHeroProducts(): Promise<Array<{ 
  title: string; 
  subtitle: string; 
  description: string; 
  icon: any; 
  cta: string; 
  ctaLink: string;
  product?: Product;
}>> {
  try {
    const products = await dbDirect.products.findAll();
    const featuredProducts = products.slice(0, 3); // Ambil 3 produk pertama
    
    return [
      {
        title: "Solusi Jaringan Terpercaya",
        subtitle: "Peralatan networking berkualitas tinggi untuk bisnis Anda",
        description: "Router, Switch, Kabel LAN, dan perangkat jaringan lainnya dari brand terpercaya dengan harga kompetitif.",
        icon: Router,
        cta: "Lihat Produk",
        ctaLink: "/products",
        product: featuredProducts[0] // Router
      },
      {
        title: "Layanan Instalasi Profesional",
        subtitle: "Tim ahli siap membantu setup jaringan Anda",
        description: "Dari konsultasi hingga instalasi lengkap, kami menyediakan layanan jaringan end-to-end untuk kebutuhan bisnis.",
        icon: Network,
        cta: "Pesan Layanan",
        ctaLink: "/services",
        product: featuredProducts[1] // Switch
      },
      {
        title: "Support & Maintenance",
        subtitle: "Dukungan teknis dan pemeliharaan berkelanjutan",
        description: "Jaminan kualitas dengan layanan after-sales dan maintenance rutin untuk menjaga performa jaringan optimal.",
        icon: Wifi,
        cta: "Hubungi Kami",
        ctaLink: "/contact",
        product: featuredProducts[2] // Access Point
      }
    ];
  } catch (error) {
    // Jika gagal mengambil dari database, gunakan data default
    return [
      {
        title: "Solusi Jaringan Terpercaya",
        subtitle: "Peralatan networking berkualitas tinggi untuk bisnis Anda",
        description: "Router, Switch, Kabel LAN, dan perangkat jaringan lainnya dari brand terpercaya dengan harga kompetitif.",
        icon: Router,
        cta: "Lihat Produk",
        ctaLink: "/products",
      },
      {
        title: "Layanan Instalasi Profesional",
        subtitle: "Tim ahli siap membantu setup jaringan Anda",
        description: "Dari konsultasi hingga instalasi lengkap, kami menyediakan layanan jaringan end-to-end untuk kebutuhan bisnis.",
        icon: Network,
        cta: "Pesan Layanan",
        ctaLink: "/services",
      },
      {
        title: "Support & Maintenance",
        subtitle: "Dukungan teknis dan pemeliharaan berkelanjutan",
        description: "Jaminan kualitas dengan layanan after-sales dan maintenance rutin untuk menjaga performa jaringan optimal.",
        icon: Wifi,
        cta: "Hubungi Kami",
        ctaLink: "/contact",
      }
    ];
  }
}

export async function DynamicHeroSection() {
  const slides = await getHeroProducts();
  
  return (
    <HeroCarousel slides={slides} />
  );
}