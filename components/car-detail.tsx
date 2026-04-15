"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  ArrowLeft,
  Fuel,
  Gauge,
  Calendar,
  Palette,
  Settings,
  Phone,
  Mail,
  ChevronLeft,
  ChevronRight,
  Car,
  FileText,
  Check,
  ExternalLink,
} from "lucide-react"

interface CarData {
  id: string
  brand: string
  model: string
  year: number
  mileage: number
  price: number
  fuel_type: string
  gearbox: string
  color: string | null
  description: string | null
  finncode: string | null
  regnr: string | null
  images: string[]
  status: string
}

// Formater beskrivelse til lesbar tekst med avsnitt
function formatDescription(text: string): string {
  if (!text) return ""
  
  // Erstatt flere linjeskift med doble linjeskift for avsnitt
  let formatted = text
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n")
    // Behold doble linjeskift som avsnitt
    .replace(/\n{3,}/g, "\n\n")
    // Legg til avsnitt etter punktum etterfulgt av stor bokstav (ny setning som kan være avsnitt)
    .replace(/\.(\s+)([A-ZÆØÅ])/g, ".\n\n$2")
    .trim()
  
  return formatted
}

// Parse beskrivelse for å finne utstyrsliste
function parseDescription(description: string | null): {
  mainText: string
  equipment: string[]
} {
  if (!description) return { mainText: "", equipment: [] }

  // Hvis beskrivelsen er tom eller bare whitespace
  const trimmed = description.trim()
  if (!trimmed) return { mainText: "", equipment: [] }

  const equipment: string[] = []
  const mainTextParts: string[] = []

  // Sjekk om teksten inneholder inline bullet points (• på samme linje)
  // F.eks. "Utstyrsnivået er høyt: • 21" felger • Bremser • Lydanlegg. Resten av teksten her."
  if (trimmed.includes(" • ") || trimmed.includes(": •")) {
    // Split på bullet points
    const parts = trimmed.split(/\s*•\s*/)
    
    for (let i = 0; i < parts.length; i++) {
      const part = parts[i].trim()
      if (!part) continue
      
      if (i === 0) {
        // Første del er intro-tekst som "Utstyrsnivået er høyt:"
        if (part.endsWith(":")) {
          mainTextParts.push(part.slice(0, -1).trim())
        } else {
          mainTextParts.push(part)
        }
      } else if (i === parts.length - 1) {
        // Siste del kan inneholde både utstyr OG fortsettelse av tekst
        // F.eks. "Kino modus med netflix osv. Rekkevidden (WLTP) er inntil ca. 514 km..."
        // Finn første punktum etterfulgt av stor bokstav som indikerer ny setning
        const sentenceBreak = part.match(/^([^.]+(?:\.[^A-ZÆØÅ])?[^.]*?)\.(\s+[A-ZÆØÅ].+)$/s)
        if (sentenceBreak) {
          // Første del er utstyr, resten er fortsettelse av beskrivelse
          const equipmentPart = sentenceBreak[1].trim()
          const continuationPart = sentenceBreak[2].trim()
          if (equipmentPart.length > 1) {
            equipment.push(equipmentPart)
          }
          if (continuationPart) {
            mainTextParts.push(continuationPart)
          }
        } else {
          // Hele siste del er utstyr
          if (part.length > 1) {
            equipment.push(part)
          }
        }
      } else {
        // Midterste deler er utstyrselementer
        if (part.length > 1) {
          equipment.push(part)
        }
      }
    }
    
    const finalMainText = formatDescription(mainTextParts.join("\n\n"))
    return { mainText: finalMainText, equipment }
  }

  // Fallback: håndter linjebaserte bullet points
  const lines = trimmed.split(/[\n\r]+/).map((line) => line.trim()).filter(Boolean)
  const mainTextLines: string[] = []
  let inEquipmentSection = false

  for (const line of lines) {
    // Sjekk om vi er i en utstyrsseksjon
    const lowerLine = line.toLowerCase()
    if (
      lowerLine === "utstyr" ||
      lowerLine === "utstyr:" ||
      lowerLine.includes("ekstrautstyr") ||
      lowerLine.includes("standard utstyr") ||
      lowerLine.includes("tilleggsutstyr") ||
      lowerLine === "utstyrsliste" ||
      lowerLine === "utstyrsliste:"
    ) {
      inEquipmentSection = true
      continue
    }

    // Sjekk om linjen ser ut som et utstyrselement
    const startsWithBullet = /^[-•*–✓√]\s*/.test(line)
    const isEquipmentLine =
      startsWithBullet ||
      (inEquipmentSection && line.length < 80 && !line.endsWith(".") && !line.includes(":"))

    if (isEquipmentLine) {
      // Fjern bullet-tegn og trim
      const cleanedLine = line.replace(/^[-•*–✓√]\s*/, "").trim()
      if (cleanedLine && cleanedLine.length > 1) {
        equipment.push(cleanedLine)
      }
    } else {
      // Hvis vi var i utstyrsseksjon men denne linjen ikke matcher, avslutt seksjonen
      if (inEquipmentSection && (line.length > 80 || line.endsWith(".") || line.includes(":"))) {
        inEquipmentSection = false
      }
      mainTextLines.push(line)
    }
  }

  // Hvis vi ikke fant noe mainText men har beskrivelse, bruk hele beskrivelsen
  const joinedText = mainTextLines.length > 0 ? mainTextLines.join("\n\n") : (equipment.length === 0 ? trimmed : "")
  const finalMainText = formatDescription(joinedText)

  return {
    mainText: finalMainText,
    equipment,
  }
}

export function CarDetail({ car }: { car: CarData }) {
  const [currentImage, setCurrentImage] = useState(0)

  const { mainText, equipment } = parseDescription(car.description)

  const specs = [
    { icon: Calendar, label: "Årsmodell", value: car.year.toString() },
    { icon: Gauge, label: "Kilometerstand", value: `${car.mileage.toLocaleString("nb-NO")} km` },
    { icon: Fuel, label: "Drivstoff", value: car.fuel_type },
    { icon: Settings, label: "Girkasse", value: car.gearbox },
    ...(car.color ? [{ icon: Palette, label: "Farge", value: car.color }] : []),
    ...(car.regnr ? [{ icon: FileText, label: "Reg.nr", value: car.regnr }] : []),
  ]

  return (
    <div className="py-8 lg:py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <Link
          href="/biler"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Tilbake til alle biler
        </Link>

        {/* Header - mobil */}
        <div className="lg:hidden mb-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                {car.brand} {car.model}
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                {car.year} • {car.mileage.toLocaleString("nb-NO")} km • {car.fuel_type}
              </p>
            </div>
            {car.status === "sold" && (
              <Badge variant="destructive" className="text-sm shrink-0">
                Solgt
              </Badge>
            )}
          </div>
          {car.status === "sold" ? (
            <p className="text-xl font-bold text-muted-foreground line-through mt-3">
              {car.price.toLocaleString("nb-NO")} kr
            </p>
          ) : (
            <p className="text-2xl font-bold text-primary mt-3">{car.price.toLocaleString("nb-NO")} kr</p>
          )}
        </div>

        <div className="grid lg:grid-cols-5 gap-8">
          {/* Bilder - 3 kolonner */}
          <div className="lg:col-span-3">
            {car.images && car.images.length > 0 ? (
              <div>
                <div className="relative aspect-[16/10] rounded-xl overflow-hidden bg-muted shadow-sm">
                  <Image
                    src={car.images[currentImage] || "/placeholder.svg"}
                    alt={`${car.brand} ${car.model}`}
                    fill
                    sizes="(min-width: 1024px) 60vw, 100vw"
                    quality={75}
                    className={`object-cover ${car.status === "sold" ? "opacity-70" : ""}`}
                    priority
                  />
                  {car.status === "sold" && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <span className="bg-destructive text-white text-2xl font-bold px-8 py-3 rounded-md -rotate-12 shadow-lg uppercase tracking-wider">
                        Solgt
                      </span>
                    </div>
                  )}
                  {car.images.length > 1 && (
                    <>
                      <button
                        onClick={() => setCurrentImage((prev) => (prev === 0 ? car.images.length - 1 : prev - 1))}
                        className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/50 text-white rounded-full p-2.5 hover:bg-black/70 transition-colors"
                        aria-label="Forrige bilde"
                      >
                        <ChevronLeft className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => setCurrentImage((prev) => (prev === car.images.length - 1 ? 0 : prev + 1))}
                        className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/50 text-white rounded-full p-2.5 hover:bg-black/70 transition-colors"
                        aria-label="Neste bilde"
                      >
                        <ChevronRight className="h-5 w-5" />
                      </button>
                      <div className="absolute bottom-3 right-3 bg-black/60 text-white text-xs px-2 py-1 rounded">
                        {currentImage + 1} / {car.images.length}
                      </div>
                    </>
                  )}
                </div>
                {car.images.length > 1 && (
                  <div className="flex gap-2 mt-3 overflow-x-auto pb-2">
                    {car.images.map((img, i) => (
                      <button
                        key={`thumb-${i}`}
                        onClick={() => setCurrentImage(i)}
                        className={`flex-shrink-0 w-20 h-14 rounded-lg overflow-hidden border-2 transition-all ${
                          i === currentImage ? "border-accent ring-2 ring-accent/30" : "border-transparent opacity-70 hover:opacity-100"
                        }`}
                      >
                        <Image
                          src={img || "/placeholder.svg"}
                          alt={`Bilde ${i + 1}`}
                          width={80}
                          height={56}
                          quality={50}
                          sizes="80px"
                          className="object-cover w-full h-full"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="aspect-[16/10] rounded-xl bg-muted flex items-center justify-center text-muted-foreground">
                <div className="text-center">
                  <Car className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>Ingen bilder tilgjengelig</p>
                </div>
              </div>
            )}

            {/* Beskrivelse - under bilder på desktop */}
            {(mainText || (car.description && equipment.length === 0)) && (
              <Card className="mt-6 hidden lg:block">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <FileText className="h-5 w-5 text-muted-foreground" />
                    Om bilen
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="prose prose-sm max-w-none">
                    {(mainText || car.description || "").split("\n\n").map((paragraph, i) => (
                      <p key={`para-${i}`} className="text-muted-foreground leading-relaxed mb-4 last:mb-0">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Utstyrsliste - under beskrivelse på desktop */}
            {equipment.length > 0 && (
              <Card className="mt-6 hidden lg:block">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Check className="h-5 w-5 text-accent" />
                    Fremhevet utstyr
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid sm:grid-cols-2 gap-x-8 gap-y-2">
                    {equipment.map((item, i) => (
                      <div key={`equip-${i}`} className="flex items-start gap-2 py-1.5">
                        <Check className="h-4 w-4 text-accent shrink-0 mt-0.5" />
                        <span className="text-sm text-foreground">{item}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Info sidebar - 2 kolonner */}
          <div className="lg:col-span-2">
            {/* Header - desktop */}
            <div className="hidden lg:block mb-6">
              <div className="flex items-start justify-between gap-4">
                <h1 className="text-3xl font-bold text-foreground">
                  {car.brand} {car.model}
                </h1>
                {car.status === "sold" && (
                  <Badge variant="destructive" className="text-sm shrink-0">
                    Solgt
                  </Badge>
                )}
              </div>
              {car.status === "sold" ? (
                <p className="text-2xl font-bold text-muted-foreground line-through mt-3">
                  {car.price.toLocaleString("nb-NO")} kr
                </p>
              ) : (
                <p className="text-3xl font-bold text-primary mt-3">{car.price.toLocaleString("nb-NO")} kr</p>
              )}
            </div>

            {/* Kontaktknapper */}
            <Card className="mb-6">
              <CardContent className="p-4">
                <p className="text-sm text-muted-foreground mb-3">Interessert? Ta kontakt med oss:</p>
                <div className="flex flex-col gap-2">
                  <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground w-full">
                    <a href="tel:+4791135991">
                      <Phone className="h-4 w-4 mr-2" />
                      Ring 911 35 991
                    </a>
                  </Button>
                  <Button asChild size="lg" variant="outline" className="bg-transparent w-full">
                    <a href="mailto:post@motoro.no">
                      <Mail className="h-4 w-4 mr-2" />
                      Send e-post
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Spesifikasjoner */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Spesifikasjoner</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-border">
                  {specs.map((spec, index) => (
                    <div key={spec.label} className="flex items-center justify-between px-6 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center">
                          <spec.icon className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <span className="text-sm text-muted-foreground">{spec.label}</span>
                      </div>
                      <span className="text-sm font-medium text-foreground">{spec.value}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Finn.no lenke */}
            {car.finncode && (
              <Card className="mt-6 overflow-hidden border-[#0063fb]/20 bg-[#0063fb]/5">
                <a
                  href={`https://www.finn.no/car/used/ad.html?finnkode=${car.finncode}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-4 hover:bg-[#0063fb]/10 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-[#0063fb] flex items-center justify-center">
                      <span className="text-white font-bold text-sm">finn</span>
                    </div>
                    <div>
                      <p className="font-medium text-foreground group-hover:text-[#0063fb] transition-colors">Se annonsen på Finn.no</p>
                      <p className="text-xs text-muted-foreground">Finnkode: {car.finncode}</p>
                    </div>
                  </div>
                  <ExternalLink className="h-5 w-5 text-[#0063fb]" />
                </a>
              </Card>
            )}
          </div>
        </div>

        {/* Beskrivelse og utstyr - mobil */}
        <div className="lg:hidden mt-8 space-y-6">
          {(mainText || (car.description && equipment.length === 0)) && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <FileText className="h-5 w-5 text-muted-foreground" />
                  Om bilen
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose prose-sm max-w-none">
                  {(mainText || car.description || "").split("\n\n").map((paragraph, i) => (
                    <p key={`para-mobile-${i}`} className="text-muted-foreground leading-relaxed mb-4 last:mb-0">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {equipment.length > 0 && (
            <Card>
              <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Check className="h-5 w-5 text-accent" />
                    Fremhevet utstyr
                  </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-y-2">
                  {equipment.map((item, i) => (
                    <div key={`equip-mobile-${i}`} className="flex items-start gap-2 py-1">
                      <Check className="h-4 w-4 text-accent shrink-0 mt-0.5" />
                      <span className="text-sm text-foreground">{item}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
