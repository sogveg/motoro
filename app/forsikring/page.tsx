import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle, Shield, Clock, Headphones, ArrowRight } from "lucide-react"

import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Bilforsikring",
  description: "Bilforsikring gjennom Gjensidige ved kjøp av bil hos Motoro AS i Bergen. Konkurransedyktige priser og enkel registrering.",
  openGraph: {
    title: "Bilforsikring | Motoro AS",
    description: "Bilforsikring gjennom Gjensidige ved kjøp av bil hos oss.",
  },
  alternates: {
    canonical: "https://motoro.no/forsikring",
  },
}

const benefits = [
  {
    icon: Shield,
    title: "Trygg dekning",
    description: "Forsikring gjennom Gjensidige - et av Norges ledende forsikringsselskaper.",
  },
  {
    icon: Clock,
    title: "Rask skadeoppgjør",
    description: "Effektiv saksbehandling når uhellet først er ute.",
  },
  {
    icon: Headphones,
    title: "Personlig service",
    description: "Vi hjelper deg med valg av riktig forsikring.",
  },
]

export default function ForsikringPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero */}
        <section className="bg-primary py-12 lg:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              <h1 className="text-3xl lg:text-4xl font-bold text-white">Bilforsikring</h1>
              <p className="mt-4 text-lg text-white/80">
                Vi leverer forsikring gjennom Gjensidige ved kjøp av bil hos oss.
              </p>
            </div>
          </div>
        </section>

        {/* Benefits */}
        <section className="py-12 lg:py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-3 gap-8">
              {benefits.map((benefit) => (
                <div key={benefit.title} className="flex gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <benefit.icon className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-foreground">{benefit.title}</h3>
                    <p className="text-muted-foreground text-sm mt-1">{benefit.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-12 lg:py-16 bg-muted">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-foreground">Forsikring gjennom Gjensidige</h2>
              <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
                Ved kjøp av bil hos oss kan du tegne forsikring gjennom Gjensidige.
              </p>
            </div>
            <div className="max-w-3xl mx-auto">
              <Card className="border-2 border-primary">
                <CardContent className="pt-6">
                  <div className="text-center mb-6">
                    <h3 className="text-2xl font-bold text-primary">Gjensidige Bilforsikring</h3>
                    <p className="text-muted-foreground mt-2">Tilgjengelig ved kjøp av bil hos oss</p>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-foreground">Ansvarsforsikring</span>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-foreground">Delkasko</span>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-foreground">Fullkasko</span>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-foreground">Brann og tyveri</span>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-foreground">Glasskader</span>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-foreground">Veihjelp 24/7</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-12 lg:py-16 bg-primary">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-2xl lg:text-3xl font-bold text-white">Interessert i bil med forsikring?</h2>
            <p className="mt-4 text-white/80 max-w-2xl mx-auto">
              Se vårt utvalg av biler, og få et forsikringstilbud gjennom Gjensidige når du kjøper hos oss.
            </p>
            <Button asChild size="lg" className="mt-8 bg-accent hover:bg-accent/90 text-accent-foreground">
              <Link href="/biler">
                Se våre biler
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
