"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2, Download, X } from "lucide-react"

export default function NewCarPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const defaultTab = searchParams.get("tab") || "manual"
  const supabase = createClient()

  const [saving, setSaving] = useState(false)
  const [finnLoading, setFinnLoading] = useState(false)
  const [finncode, setFinncode] = useState("")
  const [finnError, setFinnError] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const [form, setForm] = useState({
    brand: "",
    model: "",
    year: new Date().getFullYear(),
    mileage: 0,
    price: 0,
    fuel_type: "Bensin",
    gearbox: "Manuell",
    color: "",
    description: "",
    finncode: "",
    regnr: "",
    images: [] as string[],
    status: "active",
  })

  function updateForm(field: string, value: string | number | string[]) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  async function importFromFinn() {
    setFinnLoading(true)
    setFinnError(null)

    try {
      const response = await fetch("/api/finn-import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ finncode }),
      })

      const data = await response.json()

      if (!response.ok) {
        setFinnError(data.error || "Kunne ikke importere fra Finn.no")
        setFinnLoading(false)
        return
      }

      setForm({
        ...form,
        brand: data.brand || form.brand,
        model: data.model || form.model,
        year: data.year || form.year,
        mileage: data.mileage || form.mileage,
        price: data.price || form.price,
        fuel_type: data.fuel_type || form.fuel_type,
        gearbox: data.gearbox || form.gearbox,
        color: data.color || form.color,
        description: data.description || form.description,
        finncode: data.finncode || finncode,
        regnr: data.regnr || form.regnr,
        images: data.images || form.images,
      })
    } catch {
      setFinnError("Noe gikk galt. Sjekk finnkoden og prov igjen.")
    }

    setFinnLoading(false)
  }

  async function handleSave() {
    setSaving(true)
    setError(null)

    if (!form.brand || !form.model) {
      setError("Bilmerke og modell er paakrevd")
      setSaving(false)
      return
    }

    const { error: dbError } = await supabase.from("cars").insert({
      brand: form.brand,
      model: form.model,
      year: form.year,
      mileage: form.mileage,
      price: form.price,
      fuel_type: form.fuel_type,
      gearbox: form.gearbox,
      color: form.color || null,
      description: form.description || null,
      finncode: form.finncode || null,
      regnr: form.regnr || null,
      images: form.images,
      status: form.status,
    })

    if (dbError) {
      setError("Kunne ikke lagre bilen. Prov igjen.")
      setSaving(false)
      return
    }

    router.push("/admin/biler")
    router.refresh()
  }

  function removeImage(index: number) {
    const newImages = [...form.images]
    newImages.splice(index, 1)
    updateForm("images", newImages)
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-foreground mb-8">Legg til bil</h1>

      <Tabs defaultValue={defaultTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="manual">Manuelt</TabsTrigger>
          <TabsTrigger value="finn">Importer fra Finn.no</TabsTrigger>
        </TabsList>

        <TabsContent value="finn">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Importer fra Finn.no</CardTitle>
              <CardDescription>Lim inn finnkoden for a hente data fra annonsen automatisk</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4">
                <Input
                  placeholder="F.eks. 349876543"
                  value={finncode}
                  onChange={(e) => setFinncode(e.target.value)}
                  className="max-w-xs"
                />
                <Button onClick={importFromFinn} disabled={finnLoading || !finncode} className="bg-accent hover:bg-accent/90 text-accent-foreground">
                  {finnLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Henter...
                    </>
                  ) : (
                    <>
                      <Download className="mr-2 h-4 w-4" />
                      Hent fra Finn
                    </>
                  )}
                </Button>
              </div>
              {finnError && (
                <p className="text-sm text-destructive mt-3">{finnError}</p>
              )}
              {form.brand && form.finncode && (
                <p className="text-sm text-accent mt-3">
                  Data hentet for {form.brand} {form.model}. Rediger feltene nedenfor og lagre.
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="manual">
          <div className="mb-6" />
        </TabsContent>
      </Tabs>

      {/* Car form */}
      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Bilinformasjon</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="brand">Bilmerke *</Label>
                <Input id="brand" value={form.brand} onChange={(e) => updateForm("brand", e.target.value)} placeholder="F.eks. Volkswagen" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="model">Modell *</Label>
                <Input id="model" value={form.model} onChange={(e) => updateForm("model", e.target.value)} placeholder="F.eks. Golf" />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="year">Arsmodell</Label>
                <Input id="year" type="number" value={form.year} onChange={(e) => updateForm("year", parseInt(e.target.value) || 0)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="mileage">Kilometerstand</Label>
                <Input id="mileage" type="number" value={form.mileage} onChange={(e) => updateForm("mileage", parseInt(e.target.value) || 0)} />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="price">Pris (kr)</Label>
              <Input id="price" type="number" value={form.price} onChange={(e) => updateForm("price", parseInt(e.target.value) || 0)} />
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Drivstoff</Label>
                <Select value={form.fuel_type} onValueChange={(v) => updateForm("fuel_type", v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Bensin">Bensin</SelectItem>
                    <SelectItem value="Diesel">Diesel</SelectItem>
                    <SelectItem value="Elektrisk">Elektrisk</SelectItem>
                    <SelectItem value="Hybrid">Hybrid</SelectItem>
                    <SelectItem value="Plug-in hybrid">Plug-in hybrid</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Girkasse</Label>
                <Select value={form.gearbox} onValueChange={(v) => updateForm("gearbox", v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Manuell">Manuell</SelectItem>
                    <SelectItem value="Automat">Automat</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="color">Farge</Label>
                <Input id="color" value={form.color} onChange={(e) => updateForm("color", e.target.value)} placeholder="F.eks. Sort" />
              </div>
              <div className="space-y-2">
                <Label>Status</Label>
                <Select value={form.status} onValueChange={(v) => updateForm("status", v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Aktiv</SelectItem>
                    <SelectItem value="inactive">Inaktiv</SelectItem>
                    <SelectItem value="sold">Solgt</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Detaljer</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="regnr">Regnr</Label>
                <Input id="regnr" value={form.regnr} onChange={(e) => updateForm("regnr", e.target.value)} placeholder="F.eks. AB 12345" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="finncode_input">Finnkode</Label>
                <Input id="finncode_input" value={form.finncode} onChange={(e) => updateForm("finncode", e.target.value)} placeholder="F.eks. 349876543" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Beskrivelse</Label>
              <Textarea id="description" value={form.description} onChange={(e) => updateForm("description", e.target.value)} rows={6} placeholder="Beskriv bilen..." />
            </div>

            <div className="space-y-2">
              <Label>Bilder (URL-er)</Label>
              <div className="flex gap-2">
                <Input
                  placeholder="Lim inn bilde-URL"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault()
                      const value = (e.target as HTMLInputElement).value.trim()
                      if (value) {
                        updateForm("images", [...form.images, value]);
                        (e.target as HTMLInputElement).value = ""
                      }
                    }
                  }}
                />
              </div>
              <p className="text-xs text-muted-foreground">Trykk Enter for a legge til bilde</p>

              {form.images.length > 0 && (
                <div className="grid grid-cols-3 gap-2 mt-3">
                  {form.images.map((img, i) => (
                    <div key={`img-${i}`} className="relative group">
                      <img src={img || "/placeholder.svg"} alt={`Bilde ${i + 1}`} className="w-full h-20 object-cover rounded" />
                      <button
                        type="button"
                        onClick={() => removeImage(i)}
                        className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {error && (
        <div className="mt-6 p-3 rounded-lg bg-destructive/10 text-destructive text-sm">{error}</div>
      )}

      <div className="mt-6 flex gap-4">
        <Button onClick={handleSave} disabled={saving} className="bg-accent hover:bg-accent/90 text-accent-foreground">
          {saving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Lagrer...
            </>
          ) : (
            "Lagre bil"
          )}
        </Button>
        <Button variant="outline" onClick={() => router.push("/admin/biler")}>
          Avbryt
        </Button>
      </div>
    </div>
  )
}
