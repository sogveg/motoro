import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Car, Plus, Eye, Archive, EyeOff, RefreshCw, CheckCircle } from "lucide-react"
import Link from "next/link"
import { FinnSyncButton } from "@/components/admin/finn-sync-button"

export default async function AdminDashboardPage() {
  const supabase = await createClient()

  const { count: totalCars } = await supabase
    .from("cars")
    .select("*", { count: "exact", head: true })

  const { count: activeCars } = await supabase
    .from("cars")
    .select("*", { count: "exact", head: true })
    .eq("status", "active")

  const { count: soldCars } = await supabase
    .from("cars")
    .select("*", { count: "exact", head: true })
    .eq("status", "sold")

  const { count: hiddenCars } = await supabase
    .from("cars")
    .select("*", { count: "exact", head: true })
    .eq("status", "hidden")

  const { data: finnCars } = await supabase
    .from("cars")
    .select("finncode")
    .not("finncode", "is", null)
    .neq("finncode", "")

  const finnImportedCount = finnCars?.length || 0

  const { data: latestImport } = await supabase
    .from("cars")
    .select("created_at, brand, model, finncode")
    .not("finncode", "is", null)
    .neq("finncode", "")
    .order("created_at", { ascending: false })
    .limit(1)
    .single()

  const stats = [
    { label: "Totalt biler", value: totalCars || 0, icon: Car },
    { label: "Aktive annonser", value: activeCars || 0, icon: Eye },
    { label: "Solgte", value: soldCars || 0, icon: Archive },
    { label: "Skjulte", value: hiddenCars || 0, icon: EyeOff },
  ]

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        <Button asChild className="bg-accent hover:bg-accent/90 text-accent-foreground">
          <Link href="/admin/biler/ny">
            <Plus className="h-4 w-4 mr-2" />
            Legg til bil
          </Link>
        </Button>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{stat.label}</CardTitle>
              <stat.icon className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-foreground">{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Finn.no Auto-Sync Status */}
      <Card className="mb-8">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <RefreshCw className="h-5 w-5 text-primary" />
              <div>
                <CardTitle>Finn.no Auto-Synkronisering</CardTitle>
                <CardDescription>Henter automatisk nye annonser fra finn.no/mobility/dealer/3552218/motoro-as</CardDescription>
              </div>
            </div>
            <FinnSyncButton />
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid sm:grid-cols-3 gap-6">
            <div className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-medium text-foreground">Status</p>
                <p className="text-sm text-muted-foreground">Aktiv - sjekker daglig kl. 09:00</p>
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">Importert fra Finn</p>
              <p className="text-sm text-muted-foreground">{finnImportedCount} biler totalt</p>
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">Siste import</p>
              <p className="text-sm text-muted-foreground">
                {latestImport
                  ? `${latestImport.brand} ${latestImport.model} - ${new Date(latestImport.created_at).toLocaleDateString("nb-NO", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}`
                  : "Ingen importerte biler enda"}
              </p>
            </div>
          </div>
          <div className="mt-4 p-3 rounded-lg bg-muted text-sm text-muted-foreground">
            <p>
              <span className="font-medium text-foreground">Kilde:</span>{" "}
              <a href="https://www.finn.no/mobility/dealer/3552218/motoro-as" target="_blank" rel="noopener noreferrer" className="underline hover:text-foreground">
                finn.no/mobility/dealer/motoro-as
              </a>{" "}
              &middot; Nye annonser importeres automatisk. Du kan ogsa synkronisere manuelt med knappen over.
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Hurtighandlinger</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-4">
          <Button asChild variant="outline">
            <Link href="/admin/biler">Se alle biler</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/admin/biler/ny">Legg til bil manuelt</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/admin/biler/ny?tab=finn">Importer fra Finn.no</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
