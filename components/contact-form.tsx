"use client"

import React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CheckCircle, Loader2 } from "lucide-react"

const FORMSPREE_URL = "https://formspree.io/f/mykwjpjr"

const yearOptions = Array.from({ length: 2026 - 1990 + 1 }, (_, i) => (2026 - i).toString())

export function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [subject, setSubject] = useState("")
  const [yearModel, setYearModel] = useState("")
  const [serviceFollowed, setServiceFollowed] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    const formData = new FormData(e.currentTarget)
    formData.append("subject", subject)

    if (subject === "selge") {
      formData.append("arsmodell", yearModel)
      formData.append("service_fulgt", serviceFollowed ? "Ja" : "Nei")
    }

    try {
      const response = await fetch(FORMSPREE_URL, {
        method: "POST",
        body: formData,
        headers: {
          Accept: "application/json",
        },
      })

      if (response.ok) {
        setIsSubmitted(true)
      } else {
        setError("Noe gikk galt. Vennligst prøv igjen senere.")
      }
    } catch {
      setError("Kunne ikke sende meldingen. Sjekk internettforbindelsen din.")
    }

    setIsSubmitting(false)
  }

  if (isSubmitted) {
    return (
      <Card>
        <CardContent className="pt-12 pb-12 text-center">
          <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="h-8 w-8 text-accent" />
          </div>
          <h3 className="text-xl font-semibold text-foreground mb-2">Takk for din henvendelse!</h3>
          <p className="text-muted-foreground">Vi har mottatt meldingen din og svarer deg så snart som mulig.</p>
          <Button onClick={() => { setIsSubmitted(false); setSubject(""); }} variant="outline" className="mt-6">
            Send en ny melding
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Send oss en melding</CardTitle>
        <CardDescription>Vi svarer vanligvis innen en virkedag</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Navn *</Label>
              <Input id="name" name="name" placeholder="Ola Nordmann" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Telefon</Label>
              <Input id="phone" name="phone" type="tel" placeholder="123 45 678" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">E-post *</Label>
            <Input id="email" name="email" type="email" placeholder="ola@eksempel.no" required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="subject">Emne</Label>
            <Select value={subject} onValueChange={setSubject}>
              <SelectTrigger id="subject">
                <SelectValue placeholder="Velg emne" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="biler">{"Spørsmål om våre biler"}</SelectItem>
                <SelectItem value="forsikring">Forsikring</SelectItem>
                <SelectItem value="garanti">Garanti</SelectItem>
                <SelectItem value="selge">Selge bil</SelectItem>
                <SelectItem value="annet">Annet</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Biler - ekstra felt */}
          {subject === "biler" && (
            <div className="space-y-4 rounded-lg border border-border p-4">
              <p className="text-sm font-medium text-foreground">Informasjon om bilen</p>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="bilmerke">Bilmerke</Label>
                  <Input id="bilmerke" name="bilmerke" placeholder="F.eks. Volkswagen" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="biltype">Biltype</Label>
                  <Input id="biltype" name="biltype" placeholder="F.eks. Golf" />
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="finnkode">Finnkode</Label>
                  <Input id="finnkode" name="finnkode" placeholder="F.eks. 123456789" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="regnr_biler">Regnr</Label>
                  <Input id="regnr_biler" name="regnr" placeholder="F.eks. AB 12345" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="message_biler">Melding</Label>
                <Textarea id="message_biler" name="message" placeholder="Skriv din melding her..." rows={4} />
              </div>
            </div>
          )}

          {/* Garanti - ekstra felt */}
          {subject === "garanti" && (
            <div className="space-y-4 rounded-lg border border-border p-4">
              <p className="text-sm font-medium text-foreground">Garantihenvendelse</p>
              <div className="space-y-2">
                <Label htmlFor="regnr_garanti">Regnr *</Label>
                <Input id="regnr_garanti" name="regnr" placeholder="F.eks. AB 12345" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="feil_dato">Dato for oppdaget feil *</Label>
                <Input id="feil_dato" name="feil_dato" type="date" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="feil_beskrivelse">Beskriv feilen *</Label>
                <Textarea id="feil_beskrivelse" name="feil_beskrivelse" placeholder="Beskriv feilen du har oppdaget..." rows={4} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="message_garanti">Annen melding</Label>
                <Textarea id="message_garanti" name="message" placeholder="Eventuell tilleggsinformasjon..." rows={3} />
              </div>
            </div>
          )}

          {/* Selge bil - ekstra felt */}
          {subject === "selge" && (
            <div className="space-y-4 rounded-lg border border-border p-4">
              <p className="text-sm font-medium text-foreground">Informasjon om bilen du vil selge</p>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="regnr_selge">Regnr *</Label>
                  <Input id="regnr_selge" name="regnr" placeholder="F.eks. AB 12345" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bilmerke_selge">Bilmerke *</Label>
                  <Input id="bilmerke_selge" name="bilmerke" placeholder="F.eks. Volvo" required />
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="modell_selge">Modell *</Label>
                  <Input id="modell_selge" name="modell" placeholder="F.eks. XC60" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="arsmodell_selge">Arsmodell *</Label>
                  <Select value={yearModel} onValueChange={setYearModel}>
                    <SelectTrigger id="arsmodell_selge">
                      <SelectValue placeholder="Velg arsmodell" />
                    </SelectTrigger>
                    <SelectContent>
                      {yearOptions.map((year) => (
                        <SelectItem key={year} value={year}>
                          {year}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Checkbox
                  id="service_fulgt"
                  checked={serviceFollowed}
                  onCheckedChange={(checked) => setServiceFollowed(checked === true)}
                />
                <Label htmlFor="service_fulgt" className="cursor-pointer">Service fulgt?</Label>
              </div>
              <div className="space-y-2">
                <Label htmlFor="utstyr_selge">Utstyr som er verdt a nevne</Label>
                <Textarea id="utstyr_selge" name="utstyr" placeholder="F.eks. skinninteriror, navigasjon, hengerfeste..." rows={3} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="message_selge">Annen melding</Label>
                <Textarea id="message_selge" name="message" placeholder="Eventuell tilleggsinformasjon..." rows={3} />
              </div>
            </div>
          )}

          {/* Forsikring og Annet - standard meldingsfelt */}
          {(subject === "forsikring" || subject === "annet" || subject === "") && (
            <div className="space-y-2">
              <Label htmlFor="message_standard">Melding *</Label>
              <Textarea id="message_standard" name="message" placeholder="Skriv din melding her..." rows={5} required />
            </div>
          )}

          {error && (
            <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
              {error}
            </div>
          )}

          <Button
            type="submit"
            className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sender...
              </>
            ) : (
              "Send melding"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
