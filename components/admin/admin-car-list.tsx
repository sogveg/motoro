"use client"

import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Pencil, Trash2, Eye, EyeOff, RotateCcw } from "lucide-react"
import Link from "next/link"

interface Car {
  id: string
  brand: string
  model: string
  year: number
  mileage: number
  price: number
  fuel_type: string
  gearbox: string
  color: string | null
  finncode: string | null
  regnr: string | null
  images: string[]
  status: string
  created_at: string
}

export function AdminCarList({ cars }: { cars: Car[] }) {
  const supabase = createClient()
  const router = useRouter()

  async function setStatus(id: string, newStatus: string) {
    await supabase.from("cars").update({ status: newStatus }).eq("id", id)
    router.refresh()
  }

  async function deleteCar(id: string) {
    if (!confirm("Er du sikker pa at du vil slette denne bilen?")) return
    await supabase.from("cars").delete().eq("id", id)
    router.refresh()
  }

  function toggleStatus(id: string, currentStatus: string) {
    const newStatus = currentStatus === "active" ? "inactive" : "active"
    setStatus(id, newStatus)
  }

  function markSold(id: string) {
    setStatus(id, "sold")
  }

  if (cars.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <p className="text-muted-foreground">Ingen biler lagt til enna.</p>
          <Button asChild className="mt-4 bg-accent hover:bg-accent/90 text-accent-foreground">
            <Link href="/admin/biler/ny">Legg til din forste bil</Link>
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {cars.map((car) => (
        <Card key={car.id}>
          <CardContent className="py-4">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-4">
                {car.images && car.images.length > 0 ? (
                  <img
                    src={car.images[0] || "/placeholder.svg"}
                    alt={`${car.brand} ${car.model}`}
                    className="w-20 h-14 object-cover rounded"
                  />
                ) : (
                  <div className="w-20 h-14 bg-muted rounded flex items-center justify-center text-xs text-muted-foreground">
                    Ingen bilde
                  </div>
                )}
                <div>
                  <h3 className="font-semibold text-foreground">
                    {car.brand} {car.model} ({car.year})
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {car.mileage.toLocaleString("nb-NO")} km | {car.fuel_type} | {car.gearbox}
                    {car.regnr && ` | ${car.regnr}`}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <p className="font-bold text-foreground text-lg">
                  {car.price.toLocaleString("nb-NO")} kr
                </p>
                <Badge
                  variant={car.status === "active" ? "default" : car.status === "sold" ? "destructive" : "outline"}
                >
                  {car.status === "active" ? "Aktiv" : car.status === "sold" ? "Solgt" : "Skjult"}
                </Badge>
              </div>

              <div className="flex items-center gap-2">
                {car.status === "active" && (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setStatus(car.id, "sold")}
                      title="Merk som solgt"
                    >
                      Solgt
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setStatus(car.id, "hidden")}
                      title="Skjul annonse"
                    >
                      <EyeOff className="h-4 w-4" />
                    </Button>
                  </>
                )}
                {car.status === "sold" && (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setStatus(car.id, "active")}
                      title="Merk som aktiv igjen"
                    >
                      <RotateCcw className="h-4 w-4 mr-1" />
                      Aktiver
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setStatus(car.id, "hidden")}
                      title="Skjul annonse"
                    >
                      <EyeOff className="h-4 w-4" />
                    </Button>
                  </>
                )}
                {car.status === "hidden" && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setStatus(car.id, "active")}
                    title="Vis annonse igjen"
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    Vis igjen
                  </Button>
                )}
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/admin/biler/${car.id}`}>
                    <Pencil className="h-4 w-4" />
                  </Link>
                </Button>
                <Button variant="outline" size="sm" onClick={() => deleteCar(car.id)} className="text-destructive hover:text-destructive">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
