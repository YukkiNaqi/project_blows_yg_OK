"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Network, Wifi, Router } from "lucide-react"
import Link from "next/link"
import { dbDirect } from "@/lib/server-db"

// Gunakan data produk terbaru dari database untuk hero section
const heroSlides = [
  {
    title: "Solusi Jaringan Terpercaya",
    subtitle: "Peralatan networking berkualitas tinggi untuk bisnis Anda",
    description:
      "Router, Switch, Kabel LAN, dan perangkat jaringan lainnya dari brand terpercaya dengan harga kompetitif.",
    icon: Router,
    cta: "Lihat Produk",
    ctaLink: "/products",
  },
  {
    title: "Layanan Instalasi Profesional",
    subtitle: "Tim ahli siap membantu setup jaringan Anda",
    description:
      "Dari konsultasi hingga instalasi lengkap, kami menyediakan layanan jaringan end-to-end untuk kebutuhan bisnis.",
    icon: Network,
    cta: "Pesan Layanan",
    ctaLink: "/services",
  },
  {
    title: "Support & Maintenance",
    subtitle: "Dukungan teknis dan pemeliharaan berkelanjutan",
    description:
      "Jaminan kualitas dengan layanan after-sales dan maintenance rutin untuk menjaga performa jaringan optimal.",
    icon: Wifi,
    cta: "Hubungi Kami",
    ctaLink: "/contact",
  },
]

export function DynamicHeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length)
  }

  const SlideIcon = heroSlides[currentSlide].icon;

  return (
    <section className="relative h-[600px] overflow-hidden bg-gradient-to-br from-primary/5 to-secondary/5">
      <div className="absolute inset-0 bg-muted flex items-center justify-center">
        <div className="text-center">
          <SlideIcon className="h-24 w-24 text-primary/20 mx-auto mb-4" />
          <p className="text-2xl text-muted-foreground">Gambar produk {heroSlides[currentSlide].title.toLowerCase()}</p>
        </div>
      </div>

      <div className="relative z-10 container mx-auto px-4 h-full flex items-center">
        <div className="max-w-2xl text-white">
          <div className="animate-fade-in-up">
            <h1 className="text-4xl md:text-6xl font-bold mb-4 text-balance">{heroSlides[currentSlide].title}</h1>
            <p className="text-xl md:text-2xl mb-4 text-balance opacity-90">{heroSlides[currentSlide].subtitle}</p>
            <p className="text-lg mb-8 text-balance opacity-80 max-w-xl">{heroSlides[currentSlide].description}</p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild size="lg" className="bg-primary hover:bg-primary/90">
                <Link href={heroSlides[currentSlide].ctaLink}>{heroSlides[currentSlide].cta}</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="bg-white/10 border-white/20 text-white hover:bg-white/20"
              >
                <Link href="/about">Tentang BLOWS</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-white/20 text-white hover:bg-white/30 transition-colors"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-white/20 text-white hover:bg-white/30 transition-colors"
      >
        <ChevronRight className="h-6 w-6" />
      </button>

      {/* Slide Indicators */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex space-x-2">
        {heroSlides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition-colors ${index === currentSlide ? "bg-white" : "bg-white/50"}`}
          />
        ))}
      </div>
    </section>
  )
}