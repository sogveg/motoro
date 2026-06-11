export function LocalBusinessJsonLd() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "AutoDealer",
    name: "Motoro AS",
    description:
      "Motoro AS tilbyr kvalitetsbruktbiler i alle prisklasser i Bergen. Forsikring og garanti på alle våre biler.",
    url: "https://motoro.no",
    telephone: "+4791135991",
    email: "post@motoro.no",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Ytrebygdsvegen 37",
      addressLocality: "Søreidgrend",
      postalCode: "5251",
      addressRegion: "Bergen",
      addressCountry: "NO",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 60.3913,
      longitude: 5.3221,
    },
    priceRange: "$$",
    currenciesAccepted: "NOK",
    paymentAccepted: "Cash, Credit Card, Bank Transfer",
    areaServed: {
      "@type": "City",
      name: "Bergen",
    },
    foundingDate: "2016",
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Bruktbiler",
      itemListElement: [
        {
          "@type": "OfferCatalog",
          name: "Bruktbiler i alle prisklasser",
        },
      ],
    },
    makesOffer: [
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Bilforsikring",
          description: "Forsikring gjennom Gjensidige ved kjøp av bil",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Bilgaranti",
          description: "Garanti gjennom Fragus, fra 6 til 36 måneder",
        },
      },
    ],
  }

  return (
    <script
      id="local-business-jsonld"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
}

export function WebsiteJsonLd() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Motoro AS",
    url: "https://motoro.no",
    potentialAction: {
      "@type": "SearchAction",
      target: "https://motoro.no/biler?search={search_term_string}",
      "query-input": "required name=search_term_string",
    },
  }

  return (
    <script
      id="website-jsonld"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
}

export function BreadcrumbJsonLd({ items }: { items: { name: string; url: string }[] }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  }

  return (
    <script
      id="breadcrumb-jsonld"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
}

interface CarJsonLdData {
  id: string
  brand: string
  model: string
  year: number
  mileage: number
  price: number
  fuel_type: string
  gearbox: string
  color: string | null
  description: string | null
  body_type: string | null
  drive_type: string | null
  doors: number | null
  seats: number | null
  power: number | null
  images: string[]
  status: string
}

export function VehicleJsonLd({ car }: { car: CarJsonLdData }) {
  const jsonLd: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Car",
    name: `${car.brand} ${car.model} ${car.year}`,
    url: `https://motoro.no/biler/${car.id}`,
    brand: {
      "@type": "Brand",
      name: car.brand,
    },
    model: car.model,
    vehicleModelDate: car.year.toString(),
    mileageFromOdometer: {
      "@type": "QuantitativeValue",
      value: car.mileage,
      unitCode: "KMT",
    },
    fuelType: car.fuel_type,
    vehicleTransmission: car.gearbox,
    offers: {
      "@type": "Offer",
      price: car.price,
      priceCurrency: "NOK",
      availability:
        car.status === "active"
          ? "https://schema.org/InStock"
          : "https://schema.org/SoldOut",
      seller: {
        "@type": "AutoDealer",
        name: "Motoro AS",
        url: "https://motoro.no",
        telephone: "+4791135991",
      },
    },
  }

  if (car.color) jsonLd.color = car.color
  if (car.body_type) jsonLd.bodyType = car.body_type
  if (car.drive_type) jsonLd.driveWheelConfiguration = car.drive_type
  if (car.doors) jsonLd.numberOfDoors = car.doors
  if (car.seats) jsonLd.seatingCapacity = car.seats
  if (car.description) jsonLd.description = car.description.substring(0, 500)
  if (car.images?.[0]) jsonLd.image = car.images[0]
  if (car.power) {
    jsonLd.vehicleEngine = {
      "@type": "EngineSpecification",
      enginePower: {
        "@type": "QuantitativeValue",
        value: car.power,
        unitCode: "HRW",
      },
    }
  }

  return (
    <script
      id="vehicle-jsonld"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
}
