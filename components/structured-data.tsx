import Script from "next/script"

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
      addressLocality: "Bergen",
      addressCountry: "NO",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 60.3913,
      longitude: 5.3221,
    },
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
      description: "Etter avtale",
    },
    priceRange: "$$",
    currenciesAccepted: "NOK",
    paymentAccepted: "Cash, Credit Card, Bank Transfer",
    areaServed: {
      "@type": "City",
      name: "Bergen",
    },
    foundingDate: "2016",
    sameAs: [],
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
    <Script
      id="local-business-jsonld"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      strategy="afterInteractive"
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
    <Script
      id="website-jsonld"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      strategy="afterInteractive"
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
    <Script
      id="breadcrumb-jsonld"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      strategy="afterInteractive"
    />
  )
}
