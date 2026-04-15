import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  CheckCircle,
  Zap,
  EyeOff,
  Shield,
  Banknote,
  FileText,
  Users,
  ArrowRight,
  MapPin,
} from "lucide-react"

import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Selge bil",
  description:
    "Selg bilen trygt hos Motoro AS i Bergen. Vi tilbyr direkte oppkjøp eller formidlingssalg for høyest mulig pris. Trygt oppgjør via klientkonto.",
  openGraph: {
    title: "Selge bil | Motoro AS",
    description: "Selg bilen trygt - enten direkte til oss eller via formidlingssalg.",
  },
  alternates: {
    canonical: "https://motoro.no/selge-bil",
  },
}

const direkteKjopFordeler = [
  { icon: Zap, text: "Rask avklaring" },
  { icon: EyeOff, text: "Ingen visninger" },
  { icon: EyeOff, text: "Ingen annonsering" },
  { icon: Banknote, text: "Oppgjør via klientkonto" },
  { icon: Shield, text: "Ingen risiko for reklamasjon mot deg" },
]

const formidlingFordeler = [
  { icon: FileText, text: "Profesjonell annonsering" },
  { icon: Users, text: "Kundehandtering og visninger" },
  { icon: FileText, text: "Kontrakt og dokumentasjon" },
  { icon: Banknote, text: "Oppgjør via klientkonto" },
  { icon: Banknote, text: "Innfrielse av eventuell restgjeld" },
  { icon: Shield, text: "Trygg og strukturert gjennomforing" },
]

const formidlingSteg = [
  {
    nummer: "1",
    tittel: "Verdivurdering",
    beskrivelse: "Vi vurderer bilens markedspotensial og avtaler strategi.",
  },
  {
    nummer: "2",
    tittel: "Annonsering og handtering",
    beskrivelse: "Vi annonserer bilen og handterer alle henvendelser.",
  },
  {
    nummer: "3",
    tittel: "Kontrakt og oppgjor",
    beskrivelse: "Full kjøpesum innbetales til klientkonto før overlevering.",
  },
  {
    nummer: "4",
    tittel: "Utbetaling",
    beskrivelse: "Restgjeld innfris og netto oppgjør overføres til deg.",
  },
]

const trygghetsPunkter = [
  {
    icon: Banknote,
    tittel: "Trygt oppgjør",
    beskrivelse: "All betaling skjer via klientkonto. Eventuell restgjeld innfris for utbetaling.",
  },
  {
    icon: FileText,
    tittel: "Ryddig dokumentasjon",
    beskrivelse: "Du mottar oppgjørsoppstilling og full dokumentasjon pa gjennomført handel.",
  },
  {
    icon: MapPin,
    tittel: "Lokal aktør i Bergen",
    beskrivelse: "Motoro AS holder til i Bergen og tilbyr en personlig og strukturert prosess.",
  },
]

export default function SelgeBilPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero */}
        <section className="bg-primary py-12 lg:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              <h1 className="text-3xl lg:text-4xl font-bold text-white text-balance">
                Selg bilen trygt - enten direkte til oss eller via formidlingssalg
              </h1>
              <p className="mt-4 text-lg text-white/80">
                Hos Motoro AS kan du velge mellom raskt oppkjøp eller formidlingssalg for høyest mulig pris. Vi sørger
                for en trygg og strukturert prosess fra start til slutt.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground">
                  <Link href="/kontakt">
                    Fa tilbud pa direkte salg
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="bg-transparent border-white text-white hover:bg-white hover:text-primary"
                >
                  <a href="#formidling">Les om formidlingssalg</a>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* To valg */}
        <section className="py-12 lg:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-2xl lg:text-3xl font-bold text-foreground">Velg det som passer deg best</h2>
              <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
                Vi tilbyr to måter a selge bilen pa - begge med trygt oppgjør.
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              {/* Alternativ 1 - Direkte kjop */}
              <Card className="border-2 hover:border-primary/50 transition-colors">
                <CardHeader>
                  <CardTitle className="text-xl">Alternativ 1: Vi kjøper bilen direkte</CardTitle>
                  <p className="text-muted-foreground mt-2">
                    Ønsker du en rask og enkel handel uten visninger og annonsering? Vi gir deg et konkret tilbud og
                    gjennomfører oppgjør raskt.
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 mb-6">
                    {direkteKjopFordeler.map((fordel, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <CheckCircle className="h-5 w-5 text-accent flex-shrink-0" />
                        <span className="text-foreground">{fordel.text}</span>
                      </div>
                    ))}
                  </div>
                  <Button asChild className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
                    <Link href="/kontakt">Be om kjopstilbud</Link>
                  </Button>
                </CardContent>
              </Card>

              {/* Alternativ 2 - Formidlingssalg */}
              <Card id="formidling" className="border-2 border-primary relative">
                <div className="absolute -top-3 left-4 bg-primary text-white text-xs font-semibold px-3 py-1 rounded-full">
                  Anbefalt for hoyest pris
                </div>
                <CardHeader className="pt-8">
                  <CardTitle className="text-xl">Alternativ 2: Formidlingssalg</CardTitle>
                  <p className="text-muted-foreground mt-2">
                    Vil du oppnå best mulig pris, men slippe jobben selv? Vi handterer hele salgsprosessen - fra
                    annonsering til oppgjør.
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 mb-6">
                    {formidlingFordeler.map((fordel, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <CheckCircle className="h-5 w-5 text-accent flex-shrink-0" />
                        <span className="text-foreground">{fordel.text}</span>
                      </div>
                    ))}
                  </div>
                  <div className="bg-muted rounded-lg p-4 mb-6">
                    <p className="text-sm text-muted-foreground">Formidlingssalg</p>
                    <p className="text-2xl font-bold text-foreground">Fra 16 990 kr</p>
                    <p className="text-xs text-muted-foreground">ink. mva</p>
                  </div>
                  <Button asChild className="w-full bg-primary hover:bg-primary/90 text-white">
                    <Link href="/kontakt">Be om vurdering av formidlingssalg</Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Hvordan foregar formidling */}
        <section className="py-12 lg:py-20 bg-muted">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-2xl lg:text-3xl font-bold text-foreground">Hvordan foregår formidling?</h2>
              <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">En enkel og trygg prosess i fire steg.</p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {formidlingSteg.map((steg) => (
                <div key={steg.nummer} className="bg-background rounded-lg p-6 text-center">
                  <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                    {steg.nummer}
                  </div>
                  <h3 className="font-semibold text-lg text-foreground mb-2">{steg.tittel}</h3>
                  <p className="text-sm text-muted-foreground">{steg.beskrivelse}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Trygghet */}
        <section className="py-12 lg:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-2xl lg:text-3xl font-bold text-foreground">Din trygghet er var prioritet</h2>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {trygghetsPunkter.map((punkt) => (
                <div key={punkt.tittel} className="text-center">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <punkt.icon className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg text-foreground mb-2">{punkt.tittel}</h3>
                  <p className="text-muted-foreground">{punkt.beskrivelse}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-12 lg:py-16 bg-primary">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-2xl lg:text-3xl font-bold text-white">Klar for a selge bilen?</h2>
            <p className="mt-4 text-white/80 max-w-2xl mx-auto">
              Ta kontakt med oss i dag for en uforpliktende vurdering.
            </p>
            <Button asChild size="lg" className="mt-8 bg-accent hover:bg-accent/90 text-accent-foreground">
              <Link href="/kontakt">
                Fa tilbud na
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
