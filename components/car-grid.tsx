"use client"

import Image from "next/image"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Fuel, Gauge, Calendar } from "lucide-react"
import useSWR from "swr"
import { createClient } from "@/lib/supabase/client"

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
  description: string | null
  finncode: string | null
  regnr: string | null
  images: string[]
  status: string
  created_at: string
}

async function fetchCars(): Promise<Car[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from("cars")
    .select("*")
    .in("status", ["active", "sold"])
    .order("created_at", { ascending: false })

  if (error) throw error
  return data || []
}

export function CarGrid() {
  const { data: cars, isLoading } = useSWR("cars-active", fetchCars)

  if (isLoading) {
    return (
      <div>
        <div className="flex items-center justify-between mb-6">
          <p className="text-muted-foreground">Laster biler...</p>
        </div>
        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="overflow-hidden">
              <div className="aspect-[4/3] bg-muted animate-pulse" />
              <CardContent className="p-4 space-y-3">
                <div className="h-5 bg-muted animate-pulse rounded" />
                <div className="h-4 bg-muted animate-pulse rounded w-2/3" />
                <div className="h-8 bg-muted animate-pulse rounded w-1/2" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (!cars || cars.length === 0) {
    return (
      <div>
        <div className="flex items-center justify-between mb-6">
          <p className="text-muted-foreground">
            Viser <span className="font-semibold text-foreground">0</span> biler
          </p>
        </div>
        <Card>
          <CardContent className="py-16 text-center">
            <p className="text-muted-foreground text-lg">Ingen biler tilgjengelig for oyeblikket.</p>
            <p className="text-muted-foreground text-sm mt-2">Kom tilbake snart for nye biler!</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <p className="text-muted-foreground">
          Viser <span className="font-semibold text-foreground">{cars.length}</span> biler
        </p>
      </div>

      <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
        {cars.map((car) => (
          <Link key={car.id} href={`/biler/${car.id}`} className="group">
            <Card className="overflow-hidden hover:shadow-lg transition-shadow h-full cursor-pointer">
              <div className="relative aspect-[4/3] overflow-hidden">
                {car.images && car.images.length > 0 ? (
                  <Image
                    src={car.images[0] || "/placeholder.svg"}
                    alt={`${car.brand} ${car.model}`}
                    fill
                    sizes="(min-width: 1280px) 33vw, (min-width: 640px) 50vw, 100vw"
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
                {car.color && <p className="text-sm text-muted-foreground">{car.color}</p>}

                <div className="flex flex-wrap gap-3 mt-3 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {car.year}
                  </span>
                  <span className="flex items-center gap-1">
                    <Gauge className="h-4 w-4" />
                    {car.mileage.toLocaleString("nb-NO")} km
                  </span>
                  <span className="flex items-center gap-1">
                    <Fuel className="h-4 w-4" />
                    {car.fuel_type}
                  </span>
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <span className={`text-xl font-bold ${car.status === "sold" ? "text-muted-foreground line-through" : "text-primary"}`}>
                    {car.price.toLocaleString("nb-NO")} kr
                  </span>
                  <span className={`text-sm font-medium px-3 py-1 rounded-full ${car.status === "sold" ? "bg-muted text-muted-foreground" : "bg-accent text-accent-foreground"}`}>
                    Se mer →
                  </span>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
