import Link from "next/link"
import Image from "next/image"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Shield, Car, Leaf, CheckCircle, ArrowRight, Phone } from "lucide-react"
import { createClient } from "@/lib/supabase/server"

const features = [
  {
    icon: Shield,
    title: "Garanti",
    description: "Alle vare biler kan leveres med inntil 3 års garanti for din trygghet.",
  },
  {
    icon: Car,
    title: "Kvalitetsbiler",
    description: "Nøye utvalgte biler som gjennomgår grundig kontroll.",
  },
  {
    icon: Leaf,
    title: "Miljøvennlig",
    description: "Bruktbiler er et bærekraftig valg for miljøet.",
  },
]

export default async function HomePage() {
  const supabase = await createClient()
  const { data: featuredCars } = await supabase
    .from("cars")
    .select("*")
    .in("status", ["active", "sold"])
    .order("created_at", { ascending: false })
    .limit(3)

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden min-h-[520px] lg:min-h-[620px] flex items-center">
          {/* Background image */}
          <div className="absolute inset-0">
            <Image
              src="/hero-bg.jpg"
              alt=""
              fill
              sizes="100vw"
              quality={80}
              className="object-cover object-center"
              priority
            />
            {/* Gradient overlay: mørk venstre for tekst, lysere mot høyre */}
            <div className="absolute inset-0 bg-gradient-to-r from-primary/90 via-primary/70 to-primary/30" />
            {/* Ekstra gradient fra bunn for lesbarhet */}
            <div className="absolute inset-0 bg-gradient-to-t from-primary/60 via-transparent to-transparent" />
          </div>

          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 sm:py-28 lg:py-36 w-full">
            <div className="max-w-xl lg:max-w-2xl">
              <div className="text-white">
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight text-balance">
                  Finn din neste bil hos Motoro AS
                </h1>
                <p className="mt-4 sm:mt-6 text-base sm:text-lg text-white/80 leading-relaxed">
                  Kvalitetsbruktbiler i alle prisklasser i Bergen. Velkommen til en hyggelig og trygg bilhandel.
                </p>
                <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row gap-3 sm:gap-4">
                  <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground">
                    <Link href="/biler">
                      Se våre biler
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                  <Button
                    asChild
                    size="lg"
                    variant="outline"
                    className="bg-transparent border-white text-white hover:bg-white hover:text-primary"
                  >
                    <Link href="/kontakt">Kontakt oss</Link>
                  </Button>
                </div>

                <div className="mt-6 flex items-center gap-3">
                  <a
                    href="tel:+4791135991"
                    className="flex items-center gap-2 text-white/70 text-sm hover:text-white transition-colors"
                  >
                    <Phone className="h-4 w-4" />
                    911 35 991
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 lg:py-24 bg-muted">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-foreground">Hvorfor velge Motoro AS?</h2>
              <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
                Vi selger gode, kvalitetssikrede bruktbiler til riktig pris, og sørger for en trygg og ryddig handel hele veien.
              </p>
            </div>
            <div className="grid grid-cols-3 gap-3 sm:gap-6">
              {features.map((feature) => (
                <Card key={feature.title} className="bg-white border-0 shadow-sm hover:shadow-md transition-shadow">
                  <CardContent className="pt-4 sm:pt-6 p-3 sm:p-6">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-primary/10 flex items-center justify-center mb-3 sm:mb-4">
                      <feature.icon className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                    </div>
                    <h3 className="font-semibold text-sm sm:text-lg text-foreground mb-1 sm:mb-2">{feature.title}</h3>
                    <p className="text-muted-foreground text-xs sm:text-sm hidden sm:block">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Cars Section */}
        <section className="py-16 lg:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-12 gap-4">
              <div>
                <h2 className="text-3xl font-bold text-foreground">Utvalgte biler</h2>
                <p className="mt-2 text-muted-foreground">Se noen av vare nyeste biler</p>
              </div>
              <Button
                asChild
                variant="outline"
                className="border-primary text-primary hover:bg-primary hover:text-white bg-transparent"
              >
                <Link href="/biler">
                  Se alle biler
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>

            {featuredCars && featuredCars.length > 0 ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {featuredCars.map((car) => (
                  <Link key={car.id} href={`/biler/${car.id}`} className="group">
                    <Card className="overflow-hidden hover:shadow-lg transition-shadow h-full cursor-pointer">
                      <div className="relative aspect-[4/3] overflow-hidden">
                        {car.images && car.images.length > 0 ? (
                          <Image
                            src={car.images[0] || "/placeholder.svg"}
                            alt={`${car.brand} ${car.model}`}
                            fill
                            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                            quality={70}
                            className={`object-cover group-hover:scale-105 transition-transform duration-300 ${car.status === "sold" ? "opacity-70" : ""}`}
                          />
                        ) : (
                          <div className="w-full h-full bg-muted flex items-center justify-center text-muted-foreground">
                            Ingen bilde
                          </div>
                        )}
                        {car.status === "sold" && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <span className="bg-destructive text-white text-lg font-bold px-6 py-2 rounded-md -rotate-12 shadow-lg uppercase tracking-wider">
                              Solgt
                            </span>
                          </div>
                        )}
                      </div>
                      <CardContent className="p-4">
                        <h3 className="font-semibold text-lg text-foreground group-hover:text-primary transition-colors">
                          {car.brand} {car.model}
                        </h3>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                          <span>{car.year}</span>
                          <span>{"•"}</span>
                          <span>{car.mileage.toLocaleString("nb-NO")} km</span>
                        </div>
                        <div className="mt-4 flex items-center justify-between">
                          <span className="text-xl font-bold text-primary">
                            {car.price.toLocaleString("nb-NO")} kr
                          </span>
                          <span className="text-sm font-medium px-3 py-1 rounded-full bg-accent text-accent-foreground">
                            Se mer →
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="py-12 text-center">
                  <p className="text-muted-foreground">Ingen biler lagt ut enna. Kom tilbake snart!</p>
                </CardContent>
              </Card>
            )}
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-12 lg:py-24 bg-secondary/30">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="bg-primary rounded-2xl p-6 sm:p-8 lg:p-12 text-center">
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">Vil du selge bilen din?</h2>
              <p className="text-white/80 max-w-2xl mx-auto mb-8">
                Vi kjøper. Få et uforpliktende tilbud i dag og opplev en enkel salgsprosess.
              </p>
              <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground">
                <Link href="/selge-bil">
                  Fa verdivurdering
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Trust Badges */}
        <section className="py-8 sm:py-12 border-t border-border">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row flex-wrap justify-center items-center gap-4 sm:gap-8 lg:gap-16">
              <div className="flex items-center gap-2 text-muted-foreground">
                <CheckCircle className="h-5 w-5 text-accent shrink-0" />
                <span className="text-sm font-medium">Trygg bilhandel</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <CheckCircle className="h-5 w-5 text-accent shrink-0" />
                <span className="text-sm font-medium">Over 5 års erfaring</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <CheckCircle className="h-5 w-5 text-accent shrink-0" />
                <span className="text-sm font-medium">Lokalt i Bergen</span>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
