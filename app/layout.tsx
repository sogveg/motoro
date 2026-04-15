import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import Script from "next/script"
import { Analytics } from "@vercel/analytics/next"
import { LocalBusinessJsonLd, WebsiteJsonLd } from "@/components/structured-data"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  metadataBase: new URL("https://motoro.no"),
  title: {
    default: "Motoro AS | Bruktbiler i Bergen",
    template: "%s | Motoro AS",
  },
  description:
    "Motoro AS tilbyr kvalitetsbruktbiler i alle prisklasser i Bergen. Forsikring og garanti på alle våre biler.",
  keywords: [
    "bruktbiler",
    "Bergen",
    "bilforhandler",
    "bruktbilsalg",
    "bilforsikring",
    "bruktbil Bergen",
    "kjøpe bil Bergen",
    "bilgaranti",
    "Motoro",
  ],
  authors: [{ name: "Motoro AS" }],
  creator: "Motoro AS",
  publisher: "Motoro AS",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "nb_NO",
    url: "https://motoro.no",
    siteName: "Motoro AS",
    title: "Motoro AS | Bruktbiler i Bergen",
    description:
      "Motoro AS tilbyr kvalitetsbruktbiler i alle prisklasser i Bergen. Forsikring og garanti på alle våre biler.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Motoro AS - Din bruktbilforhandler i Bergen",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Motoro AS | Bruktbiler i Bergen",
    description:
      "Motoro AS tilbyr kvalitetsbruktbiler i alle prisklasser i Bergen. Forsikring og garanti.",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-code",
  },
  alternates: {
    canonical: "https://motoro.no",
  },
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="no">
      <head>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-ZJCTCQC186"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-ZJCTCQC186');
          `}
        </Script>
        <LocalBusinessJsonLd />
        <WebsiteJsonLd />
      </head>
      <body className={`font-sans antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
