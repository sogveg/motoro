import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ContactForm } from "@/components/contact-form"
import { MapPin, Phone, Mail, Clock } from "lucide-react"

import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Kontakt oss",
  description: "Ta kontakt med Motoro AS i Bergen. Ring 911 35 991 eller send e-post til post@motoro.no. Åpent etter avtale.",
  openGraph: {
    title: "Kontakt oss | Motoro AS",
    description: "Ring 911 35 991 eller send e-post til post@motoro.no.",
  },
  alternates: {
    canonical: "https://motoro.no/kontakt",
  },
}

const contactInfo = [
  {
    icon: MapPin,
    title: "Besøksadresse",
    details: ["Ytrebygdsvegen 37", "5251 Søreidgrend"],
    link: "https://maps.google.com/?q=ytrebygdsvegen37+5251+søreidgrend",
    linkText: "Vis i kart",
  },
  {
    icon: Phone,
    title: "Telefon",
    details: ["911 35 991"],
    link: "tel:+4791135991",
    linkText: "Ring oss",
  },
  {
    icon: Mail,
    title: "E-post",
    details: ["post@motoro.no"],
    link: "mailto:post@motoro.no",
    linkText: "Send e-post",
  },
  {
    icon: Clock,
    title: "Åpningstider",
    details: ["Man-Fre: Etter avtale", "Lørdag: Etter avtale", "Søndag: Etter avtale"],
  },
]

export default function KontaktPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero */}
        <section className="bg-primary py-12 lg:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              <h1 className="text-3xl lg:text-4xl font-bold text-white">Kontakt oss</h1>
              <p className="mt-4 text-lg text-white/80">
                Har du spørsmål om våre biler eller tjenester? Ta kontakt med oss - vi hjelper deg gjerne!
              </p>
            </div>
          </div>
        </section>

        {/* Contact Info */}
        <section className="py-12 lg:py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {contactInfo.map((info) => (
                <Card key={info.title} className="text-center">
                  <CardContent className="pt-6">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                      <info.icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="font-semibold text-foreground">{info.title}</h3>
                    <div className="mt-2 space-y-1">
                      {info.details.map((detail) => (
                        <p key={detail} className="text-sm text-muted-foreground">
                          {detail}
                        </p>
                      ))}
                    </div>
                    {info.link && (
                      <a
                        href={info.link}
                        className="inline-block mt-3 text-sm font-medium text-accent hover:underline"
                        target={info.link.startsWith("http") ? "_blank" : undefined}
                        rel={info.link.startsWith("http") ? "noopener noreferrer" : undefined}
                      >
                        {info.linkText}
                      </a>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Form & Map */}
        <section className="py-12 lg:py-16 bg-muted">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Contact Form */}
              <ContactForm />

              {/* Map */}
              <div className="h-full min-h-[400px]">
                <div className="bg-secondary/30 rounded-lg h-full flex items-center justify-center relative overflow-hidden">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1970.5!2d5.3089!3d60.2883!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x463cf94d5e8f5b91%3A0x7c2f8d4e3b1a2f0c!2sYtrebygdsvegen%2037%2C%205251%20S%C3%B8reidgrend!5e0!3m2!1sno!2sno!4v1706000000000"
                    width="100%"
                    height="100%"
                    style={{ border: 0, minHeight: "400px" }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Motoro AS - Ytrebygdsvegen 37, 5251 Søreidgrend"
                    className="rounded-lg"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-12 lg:py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-foreground">Hvem er vi?</h2>
              <p className="mt-4 text-muted-foreground">Vi er klare til å hjelpe deg med ditt neste bilkjøp</p>
            </div>
            <div className="max-w-sm mx-auto">
              <Card className="text-center">
                <CardContent className="pt-6">
                  <div className="w-24 h-24 rounded-full bg-secondary mx-auto mb-4 overflow-hidden">
                    <img
                      src="/images/vegard-sognefest.jpg"
                      alt="Vegard Sognefest"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="font-semibold text-foreground">Vegard Sognefest</h3>
                  <p className="text-sm text-muted-foreground">Daglig leder</p>
                  <a href="tel:+4791135991" className="text-sm text-accent hover:underline mt-2 inline-block">
                    911 35 991
                  </a>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-12 lg:py-16 bg-primary">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-2xl lg:text-3xl font-bold text-white">Ta kontakt for visning</h2>
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                asChild
                size="lg"
                variant="outline"
                className="bg-transparent border-white text-white hover:bg-white hover:text-primary"
              >
                <a href="tel:+4791135991">Ring 911 35 991</a>
              </Button>
              <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground">
                <a href="mailto:post@motoro.no">Send e-post</a>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
