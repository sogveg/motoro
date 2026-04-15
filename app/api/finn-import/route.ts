import { NextRequest, NextResponse } from "next/server"

// Helper: extract a specification value from Finn HTML
function extractSpec(html: string, label: string): string | null {
  const dtDdRegex = new RegExp(
    `>${label}<[^>]*>\\s*(?:<[^>]*>)*\\s*([^<]+)`,
    "i"
  )
  const dtDdMatch = html.match(dtDdRegex)
  if (dtDdMatch?.[1]?.trim()) return dtDdMatch[1].trim()

  const concatRegex = new RegExp(`${label}\\s*([A-Za-z0-9ÆØÅæøå][A-Za-z0-9ÆØÅæøå\\s\\-\\.]+)`, "i")
  const concatMatch = html.match(concatRegex)
  if (concatMatch?.[1]?.trim()) return concatMatch[1].trim()

  return null
}

// Helper: extract description text
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
  if (descMatch?.[1]) {
    return descMatch[1].trim().substring(0, 2000)
  }

  const fallbackMatch = plainText.match(
    /(?:Nyttige lenker.*?)([\s\S]{50,}?)(?:Spesifikasjoner|Utstyr)/i
  )
  if (fallbackMatch?.[1]) {
    return fallbackMatch[1].trim().substring(0, 2000)
  }

  return ""
}

export async function POST(request: NextRequest) {
  const { finncode } = await request.json()

  if (!finncode) {
    return NextResponse.json({ error: "Finnkode er paakrevd" }, { status: 400 })
  }

  try {
    const urls = [
      `https://www.finn.no/mobility/item/${finncode}`,
      `https://www.finn.no/car/used/ad.html?finnkode=${finncode}`,
    ]

    let html = ""
    let fetched = false

    for (const url of urls) {
      try {
        const response = await fetch(url, {
          headers: {
            "User-Agent":
              "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
            "Accept-Language": "no,nb;q=0.9,en;q=0.8",
          },
          redirect: "follow",
        })
        if (response.ok) {
          html = await response.text()
          fetched = true
          break
        }
      } catch {
        continue
      }
    }

    if (!fetched || !html) {
      return NextResponse.json({ error: "Kunne ikke hente annonse fra Finn.no" }, { status: 404 })
    }

    // Parse meta tags
    const getMetaContent = (property: string): string | null => {
      const regex = new RegExp(
        `<meta\\s+(?:property|name)=["']${property}["']\\s+content=["']([^"']*)["']`,
        "i"
      )
      const altRegex = new RegExp(
        `<meta\\s+content=["']([^"']*)["']\\s+(?:property|name)=["']${property}["']`,
        "i"
      )
      const match = html.match(regex) || html.match(altRegex)
      return match ? match[1] : null
    }

    const title = getMetaContent("og:title") || ""
    const ogImage = getMetaContent("og:image") || ""

    // Merke og modell
    const brand =
      extractSpec(html, "Merke") ||
      (title.match(/^([A-Za-zÆØÅæøå\-]+)\s/) || [])[1] ||
      ""

    const model =
      extractSpec(html, "Modell(?!år)") ||
      (title.match(/^[A-Za-zÆØÅæøå\-]+\s+(.+?)(?:\s+\d{4}|\s*-\s*|,|$)/) || [])[1]?.trim() ||
      ""

    // År
    const yearStr = extractSpec(html, "Modellår")
    const year = yearStr
      ? parseInt(yearStr)
      : parseInt((title.match(/(\d{4})/) || [])[1] || `${new Date().getFullYear()}`)

    // Kilometerstand
    const mileageStr = extractSpec(html, "Kilometerstand")
    let mileage = 0
    if (mileageStr) {
      mileage = parseInt(mileageStr.replace(/[^\d]/g, "")) || 0
    } else {
      const kmMatch = html.match(/([\d\s]+)\s*km/i)
      if (kmMatch) mileage = parseInt(kmMatch[1].replace(/\s/g, "")) || 0
    }

    // Pris
    const priceStr = extractSpec(html, "Totalpris") || extractSpec(html, "Pris")
    let price = 0
    if (priceStr) {
      price = parseInt(priceStr.replace(/[^\d]/g, "")) || 0
    } else {
      const priceMatch = html.match(/([\d\s]+)\s*kr/i)
      if (priceMatch) price = parseInt(priceMatch[1].replace(/\s/g, "")) || 0
    }

    // Drivstoff
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

    // Girkasse
    const gearboxSpec = extractSpec(html, "Girkasse")
    let gearbox = "Manuell"
    if (gearboxSpec) {
      gearbox = gearboxSpec.toLowerCase().includes("automat") ? "Automat" : "Manuell"
    }

    // Regnr
    const regnr = extractSpec(html, "Registreringsnummer") || ""
    const cleanRegnr = regnr.split(/\s/)[0] || ""

    // Farge
    const color = extractSpec(html, "Farge") || ""

    // Beskrivelse
    const description = extractDescription(html)

    // --- Nye felt ---

    // Effekt (hk)
    const powerStr = extractSpec(html, "Effekt")
    let power: number | null = null
    if (powerStr) {
      const powerNum = parseInt(powerStr.replace(/[^\d]/g, ""))
      if (powerNum > 0) power = powerNum
    }

    // Hjuldrift
    const driveSpec = extractSpec(html, "Hjuldrift")
    let drive_type: string | null = null
    if (driveSpec) {
      const d = driveSpec.toLowerCase()
      if (d.includes("fire") || d.includes("4x4") || d.includes("awd")) drive_type = "Firehjulsdrift"
      else if (d.includes("bak")) drive_type = "Bakhjulsdrift"
      else if (d.includes("for")) drive_type = "Forhjulsdrift"
      else drive_type = driveSpec
    }

    // Karosseri
    const bodySpec = extractSpec(html, "Karosseri")
    let body_type: string | null = bodySpec || null

    // Antall seter
    const seatsStr = extractSpec(html, "Antall seter") || extractSpec(html, "Seter")
    let seats: number | null = null
    if (seatsStr) {
      const n = parseInt(seatsStr.replace(/[^\d]/g, ""))
      if (n > 0) seats = n
    }

    // Antall dører
    const doorsStr = extractSpec(html, "Antall dører") || extractSpec(html, "Dører")
    let doors: number | null = null
    if (doorsStr) {
      const n = parseInt(doorsStr.replace(/[^\d]/g, ""))
      if (n > 0) doors = n
    }

    // 1. gang registrert
    const firstRegSpec =
      extractSpec(html, "1\\. gang registrert") ||
      extractSpec(html, "Første registrering") ||
      extractSpec(html, "Reg\\.dato")
    const first_registration = firstRegSpec || null

    // Interiørfarge
    const interiorColorSpec = extractSpec(html, "Interiørfarge") || extractSpec(html, "Interiorfarge")
    const interior_color = interiorColorSpec || null

    // Antall eiere
    const ownersStr = extractSpec(html, "Antall eiere") || extractSpec(html, "Eiere")
    let owners: number | null = null
    if (ownersStr) {
      const n = parseInt(ownersStr.replace(/[^\d]/g, ""))
      if (n > 0) owners = n
    }

    // Neste EU-kontroll
    const nextEuSpec = extractSpec(html, "Neste EU-kontroll") || extractSpec(html, "EU-kontroll")
    const next_eu = nextEuSpec || null

    // Rekkevidde WLTP
    const rangeStr = extractSpec(html, "Rekkevidde") || extractSpec(html, "WLTP")
    let range_km: number | null = null
    if (rangeStr) {
      const n = parseInt(rangeStr.replace(/[^\d]/g, ""))
      if (n > 0) range_km = n
    }

    // Bilder
    const images: string[] = []
    if (ogImage) images.push(ogImage)
    const imgRegex = /(?:content|src)=["'](https:\/\/images\.finncdn\.no\/[^"']+)["']/gi
    let imgMatch
    while ((imgMatch = imgRegex.exec(html)) !== null) {
      if (!images.includes(imgMatch[1])) {
        images.push(imgMatch[1])
      }
    }

    return NextResponse.json({
      brand,
      model,
      year,
      mileage,
      price,
      fuel_type,
      gearbox,
      color,
      regnr: cleanRegnr,
      description,
      images: images.slice(0, 20),
      finncode,
      power,
      drive_type,
      body_type,
      seats,
      doors,
      first_registration,
      interior_color,
      owners,
      next_eu,
      range_km,
    })
  } catch {
    return NextResponse.json(
      { error: "Feil ved henting av data fra Finn.no. Sjekk finnkoden og prov igjen." },
      { status: 500 },
    )
  }
}
