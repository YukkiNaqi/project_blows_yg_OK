import { Star, Quote } from "lucide-react"

const testimonials = [
  {
    id: 1,
    name: "Ahmad Santoso",
    company: "CV. Mitra Jaya Abadi",
    role: "IT Manager",
    content: "Layanan BLOWS sangat profesional. Mereka membantu kami menginstal jaringan baru untuk kantor 50 karyawan dalam waktu singkat. Kualitas peralatan juga sangat baik.",
    rating: 5,
    image: "/placeholder.svg"
  },
  {
    id: 2,
    name: "Sri Lestari",
    company: "PT. Global Teknologi Indonesia",
    role: "Direktur Operasional",
    content: "Kami telah menggunakan produk BLOWS selama lebih dari 2 tahun. Peralatan tetap berfungsi dengan baik dan dukungan teknisnya sangat responsif.",
    rating: 5,
    image: "/placeholder.svg"
  },
  {
    id: 3,
    name: "Muhammad Fauzi",
    company: "Warung Internet FauziNet",
    role: "Pemilik",
    content: "Harga produk BLOWS sangat kompetitif dibandingkan kompetitor, tapi kualitasnya tidak perlu diragukan lagi. Kami selalu merekomendasikan BLOWS ke klien kami.",
    rating: 5,
    image: "/placeholder.svg"
  }
]

export function TestimonialsSection() {
  return (
    <section className="py-16 bg-gradient-to-br from-primary/5 to-secondary/5">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-balance">Apa Kata Mereka?</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-balance">
            Pengalaman pelanggan dengan produk dan layanan BLOWS
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <div 
              key={testimonial.id} 
              className="p-6 rounded-lg border bg-card shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    className={`h-5 w-5 ${i < testimonial.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} 
                  />
                ))}
              </div>
              
              <div className="flex items-start space-x-4">
                <Quote className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                <p className="text-muted-foreground italic">"{testimonial.content}"</p>
              </div>
              
              <div className="mt-6">
                <p className="font-semibold">{testimonial.name}</p>
                <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                <p className="text-sm text-muted-foreground">{testimonial.company}</p>
              </div>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <div className="inline-flex items-center space-x-8 py-4 px-8 bg-card rounded-lg border">
            <div className="text-center">
              <p className="text-3xl font-bold text-primary">500+</p>
              <p className="text-muted-foreground">Pelanggan Terpuaskan</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-primary">10+</p>
              <p className="text-muted-foreground">Tahun Pengalaman</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-primary">98%</p>
              <p className="text-muted-foreground">Kepuasan Pelanggan</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}