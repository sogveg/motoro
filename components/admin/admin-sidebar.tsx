"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Car, LayoutDashboard, LogOut, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"

const navItems = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Alle biler", href: "/admin/biler", icon: Car },
  { name: "Legg til bil", href: "/admin/biler/ny", icon: Plus },
]

export function AdminSidebar({ userEmail }: { userEmail: string }) {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push("/admin/login")
    router.refresh()
  }

  return (
    <aside className="fixed inset-y-0 left-0 z-50 hidden lg:flex w-64 flex-col bg-primary text-primary-foreground">
      <div className="p-6 border-b border-primary-foreground/10">
        <Image
          src="/images/logo-sidestilt-tekst-og-logo.gif"
          alt="Motoro AS"
          width={140}
          height={40}
          className="bg-white rounded p-2"
        />
        <p className="text-xs text-primary-foreground/60 mt-2">Administrasjon</p>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                isActive
                  ? "bg-primary-foreground/15 text-primary-foreground font-medium"
                  : "text-primary-foreground/70 hover:bg-primary-foreground/10 hover:text-primary-foreground"
              }`}
            >
              <item.icon className="h-4 w-4" />
              {item.name}
            </Link>
          )
        })}
      </nav>

      <div className="p-4 border-t border-primary-foreground/10">
        <p className="text-xs text-primary-foreground/60 mb-3 truncate">{userEmail}</p>
        <Button
          onClick={handleLogout}
          variant="outline"
          size="sm"
          className="w-full bg-transparent border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10"
        >
          <LogOut className="h-4 w-4 mr-2" />
          Logg ut
        </Button>
      </div>
    </aside>
  )
}
