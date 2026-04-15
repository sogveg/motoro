import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, Shield, Wrench, Car, Clock, ArrowRight } from "lucide-react"

import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Bilgaranti",
  description: "Garanti gjennom Fragus på alle våre bruktbiler. GoSafe Basic, Premium og Complete - opptil 36 måneders dekning hos Motoro AS i Bergen.",
  openGraph: {
    title: "Bilgaranti | Motoro AS",
    description: "Garanti gjennom Fragus - opptil 36 måneders dekning på bruktbiler.",
  },
  alternates: {
    canonical: "https://motoro.no/garanti",
  },
}

const guaranteePackages = [
  {
    name: "GoSafe Basic",
    duration: "6 måneder",
    price: "Inkludert",
    description: "Følger med alle våre bruktbiler",
    features: ["Begrenset dekkning", "Se vilkår for detaljer", "Gjelder fra leveringsdato"],
    termsUrl: "https://fragus.com/media/crzlqfg5/01_gosafe-basic_2602.pdf",
  },
  {
    name: "GoSafe Premium",
    duration: "6-36 måneder",
    price: "Tillegg",
    description: "Ved kjøp av bil hos oss",
    features: ["Utvidet dekningsomfang", "Motor og girkasse", "Elektroniske komponenter", "Kontakt oss for pris"],
    termsUrl: "https://fragus.com/media/dmhbtddv/02_gosafe-premium_2602.pdf",
  },
  {
    name: "GoSafe Complete",
    duration: "6-36 måneder",
    price: "Tillegg",
    description: "For ekstra trygghet",
    features: [
      "Alt i 12 måneders garanti",
      "Utvidet komponentdekning",
      "Lengre beskyttelsesperiode",
      "Kontakt oss for pris",
    ],
    popular: true,
    termsUrl: "https://fragus.com/media/dctpwuyc/03_gosafe-complete_2602.pdf",
  },
  
]

const coverageAreas = [
  { icon: Car, title: "Motor", description: "Komplett dekning av motor og tilhørende komponenter" },
  { icon: Wrench, title: "Girkasse", description: "Manuell og automatgirkasse med tilhørende deler" },
  { icon: Shield, title: "Elektronikk", description: "Styreenheter, sensorer og elektriske systemer" },
  { icon: Clock, title: "Drivverk", description: "Clutch, drivaksler og differensial" },
]

export default function GarantiPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero */}
        <section className="bg-primary py-12 lg:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              <h1 className="text-3xl lg:text-4xl font-bold text-white">Garanti</h1>
              <p className="mt-4 text-lg text-white/80">
                Vi leverer garanti gjennom Fragus. Ved kjøp hos oss har du mulighet til å kjøpe utvidet garanti fra 12-36 måneder. 
                Se{" "}
                <a href="https://fragus.com" target="_blank" rel="noopener noreferrer" className="underline hover:text-white">
                  fragus.com
                </a>{" "}
                for mer informasjon.
              </p>
            </div>
          </div>
        </section>

        <section className="py-12 lg:py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-2xl font-bold text-foreground">Kjøp bil med trygghet</h2>
              <p className="mt-4 text-muted-foreground">
                Alle biler vi selger gjennomgår en grundig kontroll før salg og leveres med 6 måneders garanti. Du kan
                velge å utvide garantien for enda mer trygghet i bilkjøpet.
              </p>
            </div>
          </div>
        </section>

        {/* Coverage Areas */}
        <section className="py-12 lg:py-16 bg-muted">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-foreground">Hva kan dekkes av garantien?</h2>
              <p className="mt-4 text-muted-foreground">Utvidet garanti kan dekke viktige komponenter i bilen</p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {coverageAreas.map((area) => (
                <Card key={area.title} className="bg-white text-center">
                  <CardContent className="pt-6">
                    <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                      <area.icon className="h-7 w-7 text-primary" />
                    </div>
                    <h3 className="font-semibold text-lg text-foreground">{area.title}</h3>
                    <p className="text-muted-foreground text-sm mt-2">{area.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Guarantee Packages */}
        <section className="py-12 lg:py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-foreground">Utvalgte garantialternativer</h2>
              <p className="mt-4 text-muted-foreground">Velg garantinivået som passer for deg</p>
            </div>
            <div className="flex flex-wrap justify-center gap-8">
              {guaranteePackages.map((pkg, index) => (
                <Card
                  key={`${pkg.name}-${pkg.duration}`}
                  className={`relative w-full max-w-sm ${pkg.popular ? "border-2 border-accent shadow-lg" : "border-border"}`}
                >
                  {pkg.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <span className="bg-accent text-accent-foreground text-sm font-semibold px-4 py-1.5 rounded-full">
                        Mest valgt
                      </span>
                    </div>
                  )}
                  <CardHeader className="text-center pb-4">
                    <CardTitle className="text-xl">{pkg.name}</CardTitle>
                    <CardDescription className="text-2xl font-bold text-primary">{pkg.duration}</CardDescription>
                    <p className="text-base font-medium text-accent mt-2">{pkg.price}</p>
                    <p className="text-sm text-muted-foreground">{pkg.description}</p>
                  </CardHeader>
                  <CardContent className="pt-2">
                    <ul className="space-y-3">
                      {pkg.features.map((feature) => (
                        <li key={feature} className="flex items-start gap-3">
                          <CheckCircle className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
                          <span className="text-sm text-foreground">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    {pkg.termsUrl && (
                      <a
                        href={pkg.termsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block w-full mt-5 text-center text-sm text-accent underline hover:text-accent/80"
                      >
                        Se vilkår (PDF)
                      </a>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="py-12 lg:py-16 bg-muted">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-2xl font-bold text-foreground mb-8 text-center">Ofte stilte spørsmål</h2>
              <div className="space-y-6">
                <div className="bg-white p-6 rounded-lg">
                  <h3 className="font-semibold text-foreground">Hva dekkes ikke av garantien?</h3>
                  <p className="mt-2 text-muted-foreground text-sm">
                    Slitedeler som bremseklosser, dekk, lyspærer og viskere er ikke dekket. Normal slitasje og skader
                    forårsaket av feil bruk omfattes heller ikke. Se vilkår for fullstendig oversikt.
                  </p>
                </div>
                <div className="bg-white p-6 rounded-lg">
                  <h3 className="font-semibold text-foreground">Hvor kan jeg få utført reparasjoner?</h3>
                  <p className="mt-2 text-muted-foreground text-sm">
                    Dersom du har garanti gjennom Fragus, må du kontakte dem FØR reparasjonen utføres. Dersom du ikke
                    har dette, må garantireparasjoner godkjennes av Motoro AS før arbeidet påbegynnes. Ta kontakt med
                    oss på telefon eller e-post for å få godkjenning og anvisning til godkjent verksted.
                  </p>
                </div>
                <div className="bg-white p-6 rounded-lg">
                  <h3 className="font-semibold text-foreground">Kan jeg overføre garantien ved salg?</h3>
                  <p className="mt-2 text-muted-foreground text-sm">
                    Ja, garantien følger bilen og kan overføres til ny eier dersom bilen selges i garantiperioden.
                    Dersom bilen selges til forhandler vil garantien falle bort.
                  </p>
                </div>
                <div className="bg-white p-6 rounded-lg">
                  <h3 className="font-semibold text-foreground">Hvor finner jeg garantivilkårene?</h3>
                  <p className="mt-2 text-muted-foreground text-sm">
                    Fullstendige garantivilkår utleveres ved kjøp av bil. Du kan også kontakte oss for å få tilsendt
                    vilkårene på forhånd.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-12 lg:py-16 bg-primary">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-2xl lg:text-3xl font-bold text-white">Klar for en trygg bilhandel?</h2>
            <p className="mt-4 text-white/80 max-w-2xl mx-auto">
              Se vårt utvalg av kvalitetskontrollerte biler med 6 måneders garanti.
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
