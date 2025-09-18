"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import Link from "next/link"

const slides = [
  {
    title: "Solusi Jaringan Terpercaya",
    subtitle: "Peralatan networking berkualitas tinggi untuk bisnis Anda",
    description:
      "Router, Switch, Kabel LAN, dan perangkat jaringan lainnya dari brand terpercaya dengan harga kompetitif.",
    image: "/tp-link-router.jpg",
    cta: "Lihat Produk",
    ctaLink: "/products",
  },
  {
    title: "Layanan Instalasi Profesional",
    subtitle: "Tim ahli siap membantu setup jaringan Anda",
    description:
      "Dari konsultasi hingga instalasi lengkap, kami menyediakan layanan jaringan end-to-end untuk kebutuhan bisnis.",
    image: "/network-switch.png",
    cta: "Pesan Layanan",
    ctaLink: "/services",
  },
  {
    title: "Support & Maintenance",
    subtitle: "Dukungan teknis dan pemeliharaan berkelanjutan",
    description:
      "Jaminan kualitas dengan layanan after-sales dan maintenance rutin untuk menjaga performa jaringan optimal.",
    image: "/ubiquiti-access-point.jpg",
    cta: "Hubungi Kami",
    ctaLink: "/contact",
  },
]

export function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
  }

  return (
    <section className="relative h-[600px] overflow-hidden bg-gradient-to-br from-primary/5 to-secondary/5">
      <div className="absolute inset-0">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? "opacity-100" : "opacity-0"
            }`}
          >
            <div className="absolute inset-0 bg-black/20" />
            <img src={slide.image || "/placeholder.svg"} alt={slide.title} className="h-full w-full object-cover" />
          </div>
        ))}
      </div>

      <div className="relative z-10 container mx-auto px-4 h-full flex items-center">
        <div className="max-w-2xl text-white">
          <div className="animate-fade-in-up">
            <h1 className="text-4xl md:text-6xl font-bold mb-4 text-balance">{slides[currentSlide].title}</h1>
            <p className="text-xl md:text-2xl mb-4 text-balance opacity-90">{slides[currentSlide].subtitle}</p>
            <p className="text-lg mb-8 text-balance opacity-80 max-w-xl">{slides[currentSlide].description}</p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild size="lg" className="bg-primary hover:bg-primary/90">
                <Link href={slides[currentSlide].ctaLink}>{slides[currentSlide].cta}</Link>
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
        {slides.map((_, index) => (
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
