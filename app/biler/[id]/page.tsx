import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { CarDetail } from "@/components/car-detail"
import { VehicleJsonLd, BreadcrumbJsonLd } from "@/components/structured-data"
import type { Metadata } from "next"

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params
  const supabase = await createClient()
  const { data: car } = await supabase.from("cars").select("*").eq("id", id).single()

  if (!car) {
    return { title: "Bil ikke funnet" }
  }

  const title = `${car.brand} ${car.model} ${car.year}`
  const description = `${car.brand} ${car.model} (${car.year}) — ${car.mileage.toLocaleString("nb-NO")} km, ${car.price.toLocaleString("nb-NO")} kr. Kjøp bruktbil hos Motoro AS i Bergen.`
  const image = car.images?.[0] ?? undefined

  return {
    title,
    description,
    alternates: {
      canonical: `https://motoro.no/biler/${id}`,
    },
    openGraph: {
      title: `${title} | Motoro AS`,
      description,
      url: `https://motoro.no/biler/${id}`,
      images: image ? [{ url: image, alt: title }] : undefined,
    },
  }
}

export default async function CarDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: car } = await supabase.from("cars").select("*").eq("id", id).single()

  if (!car) {
    notFound()
  }

  return (
    <div className="min-h-screen flex flex-col">
      <VehicleJsonLd car={car} />
      <BreadcrumbJsonLd
        items={[
          { name: "Hjem", url: "https://motoro.no" },
          { name: "Biler", url: "https://motoro.no/biler" },
          { name: `${car.brand} ${car.model} ${car.year}`, url: `https://motoro.no/biler/${car.id}` },
        ]}
      />
      <Header />
      <main className="flex-1">
        <CarDetail car={car} />
      </main>
      <Footer />
    </div>
  )
}
