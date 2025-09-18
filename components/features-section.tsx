import { Network, Shield, Zap, Users, Award, Headphones } from "lucide-react"

const features = [
  {
    icon: Network,
    title: "Peralatan Berkualitas",
    description: "Produk networking dari brand terpercaya dengan standar internasional",
  },
  {
    icon: Shield,
    title: "Garansi Resmi",
    description: "Semua produk dilengkapi garansi resmi dan after-sales support",
  },
  {
    icon: Zap,
    title: "Instalasi Cepat",
    description: "Tim teknisi berpengalaman untuk instalasi dan konfigurasi profesional",
  },
  {
    icon: Users,
    title: "Konsultasi Gratis",
    description: "Konsultasi kebutuhan jaringan tanpa biaya untuk solusi terbaik",
  },
  {
    icon: Award,
    title: "Pengalaman 10+ Tahun",
    description: "Dipercaya oleh ratusan perusahaan di Jakarta dan sekitarnya",
  },
  {
    icon: Headphones,
    title: "Support 24/7",
    description: "Dukungan teknis dan customer service siap membantu kapan saja",
  },
]

export function FeaturesSection() {
  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-balance">Mengapa Memilih BLOWS?</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-balance">
            Kami berkomitmen memberikan solusi jaringan terbaik dengan layanan profesional dan produk berkualitas tinggi
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group p-6 rounded-lg border bg-card hover:shadow-lg transition-all duration-300 hover-lift animate-fade-in-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-center space-x-4 mb-4">
                <div className="p-3 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">{feature.title}</h3>
              </div>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
