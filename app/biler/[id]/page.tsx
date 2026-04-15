import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { CarDetail } from "@/components/car-detail"

export default async function CarDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: car } = await supabase.from("cars").select("*").eq("id", id).single()

  if (!car) {
    notFound()
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <CarDetail car={car} />
      </main>
      <Footer />
    </div>
  )
}
