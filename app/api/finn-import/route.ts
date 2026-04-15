import { NextRequest, NextResponse } from "next/server"

// Helper: extract a specification value from Finn HTML
// Finn renders specs as e.g. "MerkeVolkswagen", "DrivstoffDiesel", "RegistreringsnummerBS75993"
// in their specs section. We look for patterns like: >Label</...>...<...>Value<
function extractSpec(html: string, label: string): string | null {
  // Pattern 1: label and value in adjacent elements (common Finn layout)
  // e.g. <dt>Registreringsnummer</dt><dd>BS75993</dd>
  const dtDdRegex = new RegExp(
    `>${label}<[^>]*>\\s*(?:<[^>]*>)*\\s*([^<]+)`,
    "i"
  )
  const dtDdMatch = html.match(dtDdRegex)
  if (dtDdMatch?.[1]?.trim()) return dtDdMatch[1].trim()

  // Pattern 2: concatenated text like "RegistreringsnummerBS75993"
  const concatRegex = new RegExp(`${label}\\s*([A-Za-z0-9ÆØÅæøå][A-Za-z0-9ÆØÅæøå\\s\\-\\.]+)`, "i")
  const concatMatch = html.match(concatRegex)
  if (concatMatch?.[1]?.trim()) return concatMatch[1].trim()

  return null
}

// Helper: extract description text between "Beskrivelse" section and "Spesifikasjoner"
function extractDescription(html: string): string {
  // Remove all HTML tags to get plain text
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

  // Try to find the description section
  // Finn typically has "Beskrivelse" as a heading, followed by the ad text, then "Spesifikasjoner"
  const descMatch = plainText.match(
    /Beskrivelse\s+([\s\S]+?)(?:\s+Spesifikasjoner|\s+Utstyr\s|\s+Annonseinformasjon)/i
  )
  if (descMatch?.[1]) {
    return descMatch[1].trim().substring(0, 2000)
  }

  // Fallback: try to get text between common Finn sections
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
    // Finn.no now uses /mobility/item/ URLs
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

    // Extract brand from specs or title
    const brand =
      extractSpec(html, "Merke") ||
      (title.match(/^([A-Za-zÆØÅæøå\-]+)\s/) || [])[1] ||
      ""

    // Extract model from specs or title
    const model =
      extractSpec(html, "Modell(?!år)") ||
      (title.match(/^[A-Za-zÆØÅæøå\-]+\s+(.+?)(?:\s+\d{4}|\s*-\s*|,|$)/) || [])[1]?.trim() ||
      ""

    // Extract year from specs or title
    const yearStr = extractSpec(html, "Modellår")
    const year = yearStr
      ? parseInt(yearStr)
      : parseInt((title.match(/(\d{4})/) || [])[1] || `${new Date().getFullYear()}`)

    // Extract mileage - look for "Kilometerstand" in specs
    const mileageStr = extractSpec(html, "Kilometerstand")
    let mileage = 0
    if (mileageStr) {
      mileage = parseInt(mileageStr.replace(/[^\d]/g, "")) || 0
    } else {
      const kmMatch = html.match(/([\d\s]+)\s*km/i)
      if (kmMatch) mileage = parseInt(kmMatch[1].replace(/\s/g, "")) || 0
    }

    // Extract price - look for "Totalpris" or "Pris"
    const priceStr = extractSpec(html, "Totalpris") || extractSpec(html, "Pris")
    let price = 0
    if (priceStr) {
      price = parseInt(priceStr.replace(/[^\d]/g, "")) || 0
    } else {
      const priceMatch = html.match(/([\d\s]+)\s*kr/i)
      if (priceMatch) price = parseInt(priceMatch[1].replace(/\s/g, "")) || 0
    }

    // Extract fuel type from Spesifikasjoner
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

    // Extract gearbox from Spesifikasjoner
    const gearboxSpec = extractSpec(html, "Girkasse")
    let gearbox = "Manuell"
    if (gearboxSpec) {
      gearbox = gearboxSpec.toLowerCase().includes("automat") ? "Automat" : "Manuell"
    }

    // Extract registration number from Spesifikasjoner
    const regnr = extractSpec(html, "Registreringsnummer") || ""
    // Clean regnr - remove any trailing text like "Chassis nr" etc.
    const cleanRegnr = regnr.split(/\s/)[0] || ""

    // Extract color from specs
    const color = extractSpec(html, "Farge") || ""

    // Extract description from the Beskrivelse section
    const description = extractDescription(html)

    // Collect images
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
      images: images.slice(0, 10),
      finncode,
    })
  } catch {
    return NextResponse.json(
      { error: "Feil ved henting av data fra Finn.no. Sjekk finnkoden og prov igjen." },
      { status: 500 },
    )
  }
}
