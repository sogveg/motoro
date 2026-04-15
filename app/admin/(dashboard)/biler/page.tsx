import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"
import { AdminCarList } from "@/components/admin/admin-car-list"
import { FinnSyncButton } from "@/components/admin/finn-sync-button"

export default async function AdminBilerPage() {
  const supabase = await createClient()
  const { data: cars } = await supabase
    .from("cars")
    .select("*")
    .order("created_at", { ascending: false })

  return (
    <div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <h1 className="text-2xl font-bold text-foreground">Alle biler</h1>
        <div className="flex items-center gap-3">
          <FinnSyncButton />
          <Button asChild className="bg-accent hover:bg-accent/90 text-accent-foreground">
            <Link href="/admin/biler/ny">
              <Plus className="h-4 w-4 mr-2" />
              Legg til bil
            </Link>
          </Button>
        </div>
      </div>

      <AdminCarList cars={cars || []} />
    </div>
  )
}
