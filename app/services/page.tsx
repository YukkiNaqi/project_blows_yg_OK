"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, MapPin, Phone, Mail, CheckCircle } from "lucide-react"
import { serviceTypes, type ServiceType } from "@/lib/services"
import { ServiceBookingForm } from "@/components/services/service-booking-form"

export default function ServicesPage() {
  const [selectedService, setSelectedService] = useState<ServiceType | null>(null)
  const [showBookingForm, setShowBookingForm] = useState(false)

  const handleBookService = (service: ServiceType) => {
    setSelectedService(service)
    setShowBookingForm(true)
  }

  const handleBookingComplete = () => {
    setShowBookingForm(false)
    setSelectedService(null)
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary/10 via-primary/5 to-background py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-6 text-balance">Layanan Profesional BLOWS</h1>
              <p className="text-xl text-muted-foreground mb-8 text-balance">
                Tim teknisi berpengalaman siap membantu kebutuhan jaringan bisnis Anda
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Phone className="h-5 w-5" />
                  <span>088229157588</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Mail className="h-5 w-5" />
                  <span>BlowsSystem@gmail.com</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="h-5 w-5" />
                  <span>Jakarta Timur</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Services Grid */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Layanan Kami</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto text-balance">
                Solusi lengkap untuk semua kebutuhan infrastruktur jaringan Anda
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {serviceTypes.map((service) => (
                <Card key={service.id} className="group hover:shadow-lg transition-all duration-300">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      {service.name}
                      <Badge variant="secondary" className="ml-2">
                        {service.duration}
                      </Badge>
                    </CardTitle>
                    <CardDescription className="text-sm">{service.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <p className="text-2xl font-bold text-primary">
                          Rp {service.base_price.toLocaleString("id-ID")}
                        </p>
                        <p className="text-sm text-muted-foreground">Mulai dari</p>
                      </div>
                      <Clock className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <Button
                      onClick={() => handleBookService(service)}
                      className="w-full group-hover:bg-primary/90 transition-colors"
                    >
                      Pesan Layanan
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Mengapa Memilih BLOWS?</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  title: "Teknisi Bersertifikat",
                  description: "Tim profesional dengan sertifikasi internasional",
                },
                {
                  title: "Garansi Layanan",
                  description: "Jaminan kualitas untuk semua pekerjaan",
                },
                {
                  title: "Respon Cepat",
                  description: "Layanan darurat 24/7 untuk klien prioritas",
                },
                {
                  title: "Harga Kompetitif",
                  description: "Tarif terjangkau dengan kualitas premium",
                },
              ].map((feature, index) => (
                <div key={index} className="text-center">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground text-balance">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Booking Form Modal */}
      {showBookingForm && selectedService && (
        <ServiceBookingForm
          service={selectedService}
          onClose={() => setShowBookingForm(false)}
          onComplete={handleBookingComplete}
        />
      )}
    </div>
  )
}
