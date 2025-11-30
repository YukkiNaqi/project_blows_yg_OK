import { Network, Wrench, Headphones, Award } from "lucide-react"

const aboutPoints = [
  {
    icon: Network,
    title: "Spesialis Jaringan",
    description: "Kami fokus pada peralatan dan layanan jaringan untuk memastikan koneksi yang stabil dan aman."
  },
  {
    icon: Wrench,
    title: "Layanan Profesional",
    description: "Tim teknisi berpengalaman siap membantu instalasi, konfigurasi, dan pemeliharaan perangkat jaringan."
  },
  {
    icon: Headphones,
    title: "Dukungan 24/7",
    description: "Layanan pelanggan kami selalu siap membantu Anda kapan saja dengan solusi cepat dan efektif."
  },
  {
    icon: Award,
    title: "Kualitas Terjamin",
    description: "Produk yang kami tawarkan berasal dari brand terpercaya dengan standar kualitas internasional."
  }
]

export function AboutSection() {
  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-balance">Tentang BLOWS</h2>
            <p className="text-lg text-muted-foreground mb-6">
              BLOWS (Basic Layer Operating Widget System) adalah penyedia solusi jaringan profesional yang berbasis di Jakarta Timur.
              Dengan lebih dari 10 tahun pengalaman, kami telah melayani ratusan pelanggan dari berbagai bidang usaha,
              mulai dari UKM hingga perusahaan besar.
            </p>
            <p className="text-lg text-muted-foreground mb-8">
              Kami menyediakan peralatan jaringan berkualitas tinggi, layanan instalasi profesional, serta dukungan teknis
              yang handal untuk memastikan jaringan Anda berjalan optimal dan stabil.
            </p>

            <div className="grid grid-cols-2 gap-6">
              {aboutPoints.map((point, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="p-2 rounded-lg bg-primary/10 mt-1">
                    <point.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">{point.title}</h3>
                    <p className="text-sm text-muted-foreground">{point.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="relative h-96 rounded-xl overflow-hidden border bg-muted flex items-center justify-center">
              <div className="text-center p-4">
                <Network className="h-12 w-12 text-primary mx-auto mb-2" />
                <p className="text-muted-foreground">Instalasi jaringan profesional BLOWS</p>
              </div>
            </div>

            <div className="absolute -bottom-6 -left-6 bg-primary text-primary-foreground p-6 rounded-lg shadow-lg">
              <p className="text-3xl font-bold">10+</p>
              <p>Tahun Pengalaman</p>
            </div>

            <div className="absolute -top-6 -right-6 bg-secondary text-secondary-foreground p-6 rounded-lg shadow-lg">
              <p className="text-3xl font-bold">500+</p>
              <p>Pelanggan Terlayani</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}