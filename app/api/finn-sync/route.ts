import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const FINN_SEARCH_URLS = [
  "https://www.finn.no/mobility/dealer/3552218/motoro-as",
  "https://www.finn.no/mobility/dealer/3552218/motoro-as?page=2",
  "https://www.finn.no/mobility/dealer/3552218/motoro-as?page=3",
]

const fetchHeaders = {
  "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
  Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
  "Accept-Language": "no,nb;q=0.9,en;q=0.8",
}

function extractSpec(html: string, label: string): string | null {
  const dtDdRegex = new RegExp(`>${label}<[^>]*>\\s*(?:<[^>]*>)*\\s*([^<]+)`, "i")
  const dtDdMatch = html.match(dtDdRegex)
  if (dtDdMatch?.[1]?.trim()) return dtDdMatch[1].trim()

  const concatRegex = new RegExp(`${label}\\s*([A-Za-z0-9ÆØÅæøå][A-Za-z0-9ÆØÅæøå\\s\\-\\.]+)`, "i")
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

async function extractFinnCodes(): Promise<string[]> {
  const finnCodes: string[] = []

  for (const url of FINN_SEARCH_URLS) {
    try {
      const response = await fetch(url, { headers: fetchHeaders, redirect: "follow" })
      if (!response.ok) continue

      const html = await response.text()
      let foundOnThisPage = 0

      const patterns = [
        /\/mobility\/item\/(\d{6,12})/g,
        /finnkode=(\d{6,12})/g,
        /data-(?:finnkode|id)=["'](\d{6,12})["']/g,
        /href=["'](?:https?:\/\/www\.finn\.no)?\/(\d{8,12})["']/g,
      ]

      for (const regex of patterns) {
        let match
        while ((match = regex.exec(html)) !== null) {
          if (!finnCodes.includes(match[1])) {
            finnCodes.push(match[1])
            foundOnThisPage++
          }
        }
      }

      // If page returned nothing, stop paginating
      if (foundOnThisPage === 0) break
    } catch {
      continue
    }
  }

  return finnCodes
}

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

  const brand = extractSpec(html, "Merke") || (title.match(/^([A-Za-zÆØÅæøå\-]+)\s/) || [])[1] || ""
  const model = extractSpec(html, "Modell(?!år)") || (title.match(/^[A-Za-zÆØÅæøå\-]+\s+(.+?)(?:\s+\d{4}|\s*-\s*|,|$)/) || [])[1]?.trim() || ""

  const yearStr = extractSpec(html, "Modellår")
  const year = yearStr ? parseInt(yearStr) : parseInt((title.match(/(\d{4})/) || [])[1] || `${new Date().getFullYear()}`)

  const mileageStr = extractSpec(html, "Kilometerstand")
  const mileage = mileageStr ? parseInt(mileageStr.replace(/[^\d]/g, "")) || 0 : 0

  const priceStr = extractSpec(html, "Totalpris") || extractSpec(html, "Pris")
  const price = priceStr ? parseInt(priceStr.replace(/[^\d]/g, "")) || 0 : 0

  const fuelSpec = extractSpec(html, "Drivstoff")
  let fuel_type = "Bensin"
  if (fuelSpec) {
    const f = fuelSpec.toLowerCase()
    if (f.includes("el") && !f.includes("diesel")) fuel_type = "Elektrisk"
    else if (f.includes("plug-in") || f.includes("plugin")) fuel_type = "Plug-in hybrid"
    else if (f.includes("hybrid")) fuel_type = "Hybrid"
    else if (f.includes("diesel")) fuel_type = "Diesel"
    else fuel_type = fuelSpec
  }

  const gearboxSpec = extractSpec(html, "Girkasse")
  const gearbox = gearboxSpec?.toLowerCase().includes("automat") ? "Automat" : "Manuell"
  const regnr = (extractSpec(html, "Registreringsnummer") || "").split(/\s/)[0] || ""
  const color = extractSpec(html, "Farge") || ""
  const description = extractDescription(html)

  const powerStr = extractSpec(html, "Effekt")
  const power = powerStr ? parseInt(powerStr.replace(/[^\d]/g, "")) || null : null

  const driveSpec = extractSpec(html, "Hjuldrift")
  let drive_type: string | null = null
  if (driveSpec) {
    const d = driveSpec.toLowerCase()
    if (d.includes("fire") || d.includes("4x4") || d.includes("awd")) drive_type = "Firehjulsdrift"
    else if (d.includes("bak")) drive_type = "Bakhjulsdrift"
    else if (d.includes("for")) drive_type = "Forhjulsdrift"
    else drive_type = driveSpec
  }

  const body_type = extractSpec(html, "Karosseri") || null

  const seatsStr = extractSpec(html, "Antall seter") || extractSpec(html, "Seter")
  const seats = seatsStr ? parseInt(seatsStr.replace(/[^\d]/g, "")) || null : null

  const doorsStr = extractSpec(html, "Antall dører") || extractSpec(html, "Dører")
  const doors = doorsStr ? parseInt(doorsStr.replace(/[^\d]/g, "")) || null : null

  const firstRegSpec = extractSpec(html, "1\\. gang registrert") || extractSpec(html, "Første registrering")
  const first_registration = firstRegSpec || null

  const interior_color = extractSpec(html, "Interiørfarge") || null

  const ownersStr = extractSpec(html, "Antall eiere") || extractSpec(html, "Eiere")
  const owners = ownersStr ? parseInt(ownersStr.replace(/[^\d]/g, "")) || null : null

  const next_eu = extractSpec(html, "Neste EU-kontroll") || null

  const rangeStr = extractSpec(html, "Rekkevidde") || extractSpec(html, "WLTP")
  const range_km = rangeStr ? parseInt(rangeStr.replace(/[^\d]/g, "")) || null : null

  // Images
  const images: string[] = []
  const addImage = (url: string) => {
    const cleanUrl = url.replace(/\\u002F/g, "/").replace(/&amp;/g, "&").split("?")[0]
    const highResUrl = cleanUrl.replace(/\/\d+x\d+\//, "/1600x1200/").replace(/\/\d+x\d+c\//, "/1600x1200c/")
    if (!images.some((img) => img.includes(cleanUrl.split("/").pop() || ""))) {
      images.push(highResUrl || cleanUrl)
    }
  }

  const nextDataMatch = html.match(/<script id="__NEXT_DATA__"[^>]*>([\s\S]*?)<\/script>/i)
  if (nextDataMatch) {
    try {
      const jsonData = JSON.parse(nextDataMatch[1])
      const findImages = (obj: unknown, depth = 0): void => {
        if (depth > 10 || !obj) return
        if (Array.isArray(obj)) {
          obj.forEach((item) => findImages(item, depth + 1))
        } else if (typeof obj === "object" && obj !== null) {
          for (const [key, value] of Object.entries(obj)) {
            if (key === "url" && typeof value === "string" && value.includes("finncdn.no")) {
              addImage(value)
            } else if (key === "images" && Array.isArray(value)) {
              value.forEach((img: { url?: string }) => { if (img?.url) addImage(img.url) })
            } else {
              findImages(value, depth + 1)
            }
          }
        }
      }
      findImages(jsonData)
    } catch { /* continue */ }
  }

  const allFinnImgRegex = /https:\/\/images\.finncdn\.no\/dynamic\/[^"'\s\]}>]+/gi
  let imgMatch
  while ((imgMatch = allFinnImgRegex.exec(html)) !== null) addImage(imgMatch[0])
  if (images.length === 0 && ogImage) addImage(ogImage)

  return {
    brand, model, year, mileage, price, fuel_type, gearbox, color, regnr,
    description, images: images.slice(0, 20), finncode, status: "active",
    power, drive_type, body_type, seats, doors, first_registration,
    interior_color, owners, next_eu, range_km,
  }
}

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization")
  const cronSecret = process.env.CRON_SECRET
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  return runSync()
}

export async function POST() {
  return runSync()
}

async function runSync() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
  const supabase = createClient(supabaseUrl, supabaseServiceKey)

  try {
    // 1. Hent alle biler med finnkode fra DB
    const { data: existingCars } = await supabase
      .from("cars")
      .select("id, finncode, status")
      .not("finncode", "is", null)
      .neq("finncode", "")

    const existingMap = new Map<string, { id: string; status: string }>(
      (existingCars || []).map((c) => [c.finncode, { id: c.id, status: c.status }])
    )

    // 2. Hent alle aktive finnkoder fra forhandlersiden
    const liveFinnCodes = new Set(await extractFinnCodes())

    const imported: string[] = []
    const updated: string[] = []
    const markedSold: string[] = []
    const errors: string[] = []

    // 3. Oppdater eller marker som solgt for eksisterende biler
    for (const [finncode, car] of existingMap.entries()) {
      if (!liveFinnCodes.has(finncode)) {
        // Ikke lenger på Finn — marker som solgt
        if (car.status !== "sold") {
          const { error } = await supabase
            .from("cars")
            .update({ status: "sold" })
            .eq("id", car.id)
          if (error) {
            errors.push(`${finncode}: ${error.message}`)
          } else {
            markedSold.push(finncode)
          }
        }
      } else {
        // Fremdeles på Finn — oppdater data
        try {
          const carData = await fetchCarData(finncode)
          if (carData && carData.brand) {
            const { error } = await supabase
              .from("cars")
              .update({
                price: carData.price,
                mileage: carData.mileage,
                description: carData.description,
                images: carData.images,
                color: carData.color,
                regnr: carData.regnr,
                power: carData.power,
                drive_type: carData.drive_type,
                body_type: carData.body_type,
                seats: carData.seats,
                doors: carData.doors,
                first_registration: carData.first_registration,
                interior_color: carData.interior_color,
                owners: carData.owners,
                next_eu: carData.next_eu,
                range_km: carData.range_km,
                status: "active",
              })
              .eq("id", car.id)
            if (error) {
              errors.push(`${finncode}: ${error.message}`)
            } else {
              updated.push(`${carData.brand} ${carData.model} (${finncode})`)
            }
          }
          await new Promise((resolve) => setTimeout(resolve, 800))
        } catch {
          errors.push(`${finncode}: Feil ved oppdatering`)
        }
      }
    }

    // 4. Importer nye biler
    const newFinnCodes = [...liveFinnCodes].filter((code) => !existingMap.has(code))
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
        await new Promise((resolve) => setTimeout(resolve, 800))
      } catch {
        errors.push(`${code}: Feil ved import`)
      }
    }

    const parts = []
    if (imported.length) parts.push(`${imported.length} nye importert`)
    if (updated.length) parts.push(`${updated.length} oppdatert`)
    if (markedSold.length) parts.push(`${markedSold.length} markert som solgt`)

    return NextResponse.json({
      message: parts.length ? parts.join(", ") : "Alt er allerede oppdatert",
      imported,
      updated,
      marked_sold: markedSold,
      total_on_finn: liveFinnCodes.size,
      errors: errors.length > 0 ? errors : undefined,
    })
  } catch {
    return NextResponse.json(
      { error: "Feil ved synkronisering med Finn.no" },
      { status: 500 }
    )
  }
}
