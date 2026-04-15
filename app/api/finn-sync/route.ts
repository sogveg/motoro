import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const FINN_DEALER_URL = "https://www.finn.no/mobility/dealer/3552218/motoro-as"
const FINN_SEARCH_URLS = [
  FINN_DEALER_URL,
  "https://www.finn.no/mobility/dealer/3552218/motoro-as?page=2",
]

// Shared helpers from finn-import
function extractSpec(html: string, label: string): string | null {
  const dtDdRegex = new RegExp(`>${label}<[^>]*>\\s*(?:<[^>]*>)*\\s*([^<]+)`, "i")
  const dtDdMatch = html.match(dtDdRegex)
  if (dtDdMatch?.[1]?.trim()) return dtDdMatch[1].trim()

  const concatRegex = new RegExp(`${label}\\s*([A-Za-z0-9\u00C6\u00D8\u00C5\u00E6\u00F8\u00E5][A-Za-z0-9\u00C6\u00D8\u00C5\u00E6\u00F8\u00E5\\s\\-\\.]+)`, "i")
  const concatMatch = html.match(concatRegex)
  if (concatMatch?.[1]?.trim()) return concatMatch[1].trim()

  return null
}

function extractDescription(html: string): string {
  const plainText = html
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&#(\d+);/g, (_, num) => String.fromCharCode(parseInt(num)))
    .replace(/\s+/g, " ")

  const descMatch = plainText.match(
    /Beskrivelse\s+([\s\S]+?)(?:\s+Spesifikasjoner|\s+Utstyr\s|\s+Annonseinformasjon)/i
  )
  if (descMatch?.[1]) return descMatch[1].trim().substring(0, 2000)

  return ""
}

const fetchHeaders = {
  "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
  Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
  "Accept-Language": "no,nb;q=0.9,en;q=0.8",
}

// Extract finnkoder from a Finn dealer/search page
async function extractFinnCodes(): Promise<string[]> {
  const finnCodes: string[] = []

  for (const url of FINN_SEARCH_URLS) {
    try {
      const response = await fetch(url, { headers: fetchHeaders, redirect: "follow" })
      if (!response.ok) continue

      const html = await response.text()

      // Pattern 1: /mobility/item/NNNNNN links
      const mobilityRegex = /\/mobility\/item\/(\d{6,12})/g
      let match
      while ((match = mobilityRegex.exec(html)) !== null) {
        if (!finnCodes.includes(match[1])) finnCodes.push(match[1])
      }

      // Pattern 2: finnkode=NNNNNN in URLs
      const finnkodeRegex = /finnkode=(\d{6,12})/g
      while ((match = finnkodeRegex.exec(html)) !== null) {
        if (!finnCodes.includes(match[1])) finnCodes.push(match[1])
      }

      // Pattern 3: data-finnkode or data-id attributes
      const dataIdRegex = /data-(?:finnkode|id)=["'](\d{6,12})["']/g
      while ((match = dataIdRegex.exec(html)) !== null) {
        if (!finnCodes.includes(match[1])) finnCodes.push(match[1])
      }

      // Pattern 4: /NNNNNN links (direct ad links on Finn)
      const directRegex = /href=["'](?:https?:\/\/www\.finn\.no)?\/(\d{8,12})["']/g
      while ((match = directRegex.exec(html)) !== null) {
        if (!finnCodes.includes(match[1])) finnCodes.push(match[1])
      }

      if (finnCodes.length > 0) break // Found codes, no need to try other URLs
    } catch {
      continue
    }
  }

  return finnCodes
}

// Fetch full car data from a single Finn ad
async function fetchCarData(finncode: string) {
  const urls = [
    `https://www.finn.no/mobility/item/${finncode}`,
    `https://www.finn.no/car/used/ad.html?finnkode=${finncode}`,
  ]

  let html = ""
  for (const url of urls) {
    try {
      const response = await fetch(url, { headers: fetchHeaders, redirect: "follow" })
      if (response.ok) {
        html = await response.text()
        break
      }
    } catch {
      continue
    }
  }

  if (!html) return null

  const getMetaContent = (property: string): string | null => {
    const regex = new RegExp(`<meta\\s+(?:property|name)=["']${property}["']\\s+content=["']([^"']*)["']`, "i")
    const altRegex = new RegExp(`<meta\\s+content=["']([^"']*)["']\\s+(?:property|name)=["']${property}["']`, "i")
    const match = html.match(regex) || html.match(altRegex)
    return match ? match[1] : null
  }

  const title = getMetaContent("og:title") || ""
  const ogImage = getMetaContent("og:image") || ""

  const brand = extractSpec(html, "Merke") || (title.match(/^([A-Za-z\u00C6\u00D8\u00C5\u00E6\u00F8\u00E5\-]+)\s/) || [])[1] || ""
  const model = extractSpec(html, "Modell(?!\u00E5r)") || (title.match(/^[A-Za-z\u00C6\u00D8\u00C5\u00E6\u00F8\u00E5\-]+\s+(.+?)(?:\s+\d{4}|\s*-\s*|,|$)/) || [])[1]?.trim() || ""

  const yearStr = extractSpec(html, "Modell\u00E5r")
  const year = yearStr ? parseInt(yearStr) : parseInt((title.match(/(\d{4})/) || [])[1] || `${new Date().getFullYear()}`)

  const mileageStr = extractSpec(html, "Kilometerstand")
  let mileage = 0
  if (mileageStr) {
    mileage = parseInt(mileageStr.replace(/[^\d]/g, "")) || 0
  }

  const priceStr = extractSpec(html, "Totalpris") || extractSpec(html, "Pris")
  let price = 0
  if (priceStr) {
    price = parseInt(priceStr.replace(/[^\d]/g, "")) || 0
  }

  const fuelSpec = extractSpec(html, "Drivstoff")
  let fuel_type = "Bensin"
  if (fuelSpec) {
    const f = fuelSpec.toLowerCase()
    if (f.includes("el") && !f.includes("diesel")) fuel_type = "Elektrisk"
    else if (f.includes("plug-in") || f.includes("plugin")) fuel_type = "Plug-in hybrid"
    else if (f.includes("hybrid")) fuel_type = "Hybrid"
    else if (f.includes("diesel")) fuel_type = "Diesel"
    else if (f.includes("bensin")) fuel_type = "Bensin"
    else fuel_type = fuelSpec
  }

  const gearboxSpec = extractSpec(html, "Girkasse")
  const gearbox = gearboxSpec?.toLowerCase().includes("automat") ? "Automat" : "Manuell"

  const regnr = (extractSpec(html, "Registreringsnummer") || "").split(/\s/)[0] || ""
  const color = extractSpec(html, "Farge") || ""
  const description = extractDescription(html)

  const images: string[] = []
  const addImage = (url: string) => {
    // Normalisér URL og fjern duplikater
    const cleanUrl = url
      .replace(/\\u002F/g, "/")
      .replace(/&amp;/g, "&")
      .split("?")[0] // Fjern query params for sammenligning
    
    // Konverter til høyere oppløsning
    const highResUrl = cleanUrl
      .replace(/\/\d+x\d+\//, "/1600x1200/")
      .replace(/\/\d+x\d+c\//, "/1600x1200c/")
    
    if (!images.some(img => img.includes(cleanUrl.split("/").pop() || ""))) {
      images.push(highResUrl || cleanUrl)
    }
  }

  // Pattern 1: Finn imageIds fra __NEXT_DATA__ JSON (mest pålitelig)
  const nextDataMatch = html.match(/<script id="__NEXT_DATA__"[^>]*>([\s\S]*?)<\/script>/i)
  if (nextDataMatch) {
    try {
      const jsonData = JSON.parse(nextDataMatch[1])
      // Finn bilder i ulike steder i JSON-strukturen
      const findImages = (obj: unknown, depth = 0): void => {
        if (depth > 10 || !obj) return
        if (Array.isArray(obj)) {
          obj.forEach(item => findImages(item, depth + 1))
        } else if (typeof obj === "object" && obj !== null) {
          for (const [key, value] of Object.entries(obj)) {
            if (key === "url" && typeof value === "string" && value.includes("finncdn.no")) {
              addImage(value)
            } else if (key === "images" && Array.isArray(value)) {
              value.forEach((img: { url?: string }) => {
                if (img?.url) addImage(img.url)
              })
            } else {
              findImages(value, depth + 1)
            }
          }
        }
      }
      findImages(jsonData)
    } catch {
      // JSON parse feilet, fortsett med andre metoder
    }
  }

  // Pattern 2: Hent alle bilder fra Finn CDN via regex på hele HTML
  const allFinnImgRegex = /https:\/\/images\.finncdn\.no\/dynamic\/[^"'\s\]}>]+/gi
  let imgMatch
  while ((imgMatch = allFinnImgRegex.exec(html)) !== null) {
    addImage(imgMatch[0])
  }

  // Pattern 3: og:image som fallback
  if (images.length === 0 && ogImage) addImage(ogImage)

  // Pattern 4: Finn data-urls i img tags
  const dataUrlRegex = /data-(?:src|url|image)=["'](https:\/\/images\.finncdn\.no[^"']+)["']/gi
  while ((imgMatch = dataUrlRegex.exec(html)) !== null) {
    addImage(imgMatch[1])
  }

  return {
    brand,
    model,
    year,
    mileage,
    price,
    fuel_type,
    gearbox,
    color,
    regnr,
    description,
    images: images.slice(0, 20),
    finncode,
    status: "active",
  }
}

// POST: Manual trigger from admin dashboard
// GET: Cron job trigger (secured with CRON_SECRET)
export async function GET(request: NextRequest) {
  // Verify cron secret for automated calls
  const authHeader = request.headers.get("authorization")
  const cronSecret = process.env.CRON_SECRET

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  return runSync()
}

export async function POST(request: NextRequest) {
  // Manual trigger requires Supabase auth check
  return runSync()
}

async function runSync() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

  // Use service role key to bypass RLS
  const supabase = createClient(supabaseUrl, supabaseServiceKey)

  try {
    // Step 1: Get existing finnkoder from database
    const { data: existingCars } = await supabase
      .from("cars")
      .select("finncode")
      .not("finncode", "is", null)
      .neq("finncode", "")

    const existingFinnCodes = new Set(
      (existingCars || []).map((c) => c.finncode).filter(Boolean)
    )

    // Step 2: Get finnkoder from Finn.no dealer page
    const finnCodes = await extractFinnCodes()

    if (finnCodes.length === 0) {
      return NextResponse.json({
        message: "Ingen annonser funnet pa forhandlersiden",
        imported: 0,
        existing: existingFinnCodes.size,
      })
    }

    // Step 3: Filter out already imported cars
    const newFinnCodes = finnCodes.filter((code) => !existingFinnCodes.has(code))

    if (newFinnCodes.length === 0) {
      return NextResponse.json({
        message: "Alle annonser er allerede importert",
        imported: 0,
        total_on_finn: finnCodes.length,
        existing: existingFinnCodes.size,
      })
    }

    // Step 4: Fetch and import new cars
    const imported: string[] = []
    const errors: string[] = []

    for (const code of newFinnCodes) {
      try {
        const carData = await fetchCarData(code)
        if (carData && carData.brand) {
          const { error } = await supabase.from("cars").insert(carData)
          if (error) {
            errors.push(`${code}: ${error.message}`)
          } else {
            imported.push(`${carData.brand} ${carData.model} (${code})`)
          }
        } else {
          errors.push(`${code}: Kunne ikke hente data`)
        }
        // Small delay between requests to be polite
        await new Promise((resolve) => setTimeout(resolve, 1000))
      } catch {
        errors.push(`${code}: Feil ved import`)
      }
    }

    return NextResponse.json({
      message: `Importerte ${imported.length} nye biler`,
      imported,
      errors: errors.length > 0 ? errors : undefined,
      total_on_finn: finnCodes.length,
      already_existed: finnCodes.length - newFinnCodes.length,
    })
  } catch {
    return NextResponse.json(
      { error: "Feil ved synkronisering med Finn.no" },
      { status: 500 },
    )
  }
}
