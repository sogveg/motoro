import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { CarFilters } from "@/components/car-filters"
import { CarGrid } from "@/components/car-grid"

import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Bruktbiler til salgs",
  description: "Se vårt utvalg av kvalitetsbruktbiler i alle prisklasser. Finn din neste bil hos Motoro AS i Bergen. Alle biler EU-godkjent.",
  openGraph: {
    title: "Bruktbiler til salgs | Motoro AS",
    description: "Se vårt utvalg av kvalitetsbruktbiler i alle prisklasser i Bergen.",
  },
  alternates: {
    canonical: "https://motoro.no/biler",
  },
}

export default function BilerPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero */}
        <section className="bg-primary py-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl lg:text-4xl font-bold text-white">Våre biler</h1>
            <p className="mt-2 text-white/80">Finn din neste bil hos oss</p>
          </div>
        </section>

        {/* Cars Section */}
        <section className="py-8 lg:py-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-4 gap-8">
              <aside className="lg:col-span-1">
                <CarFilters />
              </aside>
              <div className="lg:col-span-3">
                <CarGrid />
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
