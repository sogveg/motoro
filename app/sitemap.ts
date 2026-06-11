import type { MetadataRoute } from "next"
import { createClient } from "@supabase/supabase-js"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://motoro.no"

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${baseUrl}/biler`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/forsikring`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/garanti`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/selge-bil`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/kontakt`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
  ]

  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseAnonKey) return staticRoutes

    const supabase = createClient(supabaseUrl, supabaseAnonKey)
    const { data: cars } = await supabase
      .from("cars")
      .select("id, updated_at")
      .eq("status", "active")

    const carRoutes: MetadataRoute.Sitemap = (cars ?? []).map((car) => ({
      url: `${baseUrl}/biler/${car.id}`,
      lastModified: car.updated_at ? new Date(car.updated_at) : new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    }))

    return [...staticRoutes, ...carRoutes]
  } catch {
    return staticRoutes
  }
}
