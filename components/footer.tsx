import Link from "next/link"
import Image from "next/image"
import { MapPin, Phone, Mail } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="mb-4">
              <Image
                src="/images/logo-sidestilt-tekst-og-logo.gif"
                alt="Motoro AS Logo"
                width={160}
                height={45}
                className="object-contain bg-white rounded p-2"
              />
            </div>
            <p className="text-primary-foreground/80 text-sm">
              Din bilforhandler i Bergen. Vi tilbyr biler i alle prisklasser med forsikring og garanti.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Hurtiglenker</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/biler" className="text-primary-foreground/80 hover:text-white transition-colors text-sm">
                  Våre biler
                </Link>
              </li>
              <li>
                <Link
                  href="/forsikring"
                  className="text-primary-foreground/80 hover:text-white transition-colors text-sm"
                >
                  Forsikring
                </Link>
              </li>
              <li>
                <Link href="/garanti" className="text-primary-foreground/80 hover:text-white transition-colors text-sm">
                  Garanti
                </Link>
              </li>
              <li>
                <Link
                  href="/selge-bil"
                  className="text-primary-foreground/80 hover:text-white transition-colors text-sm"
                >
                  Selge bil
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Kontakt oss</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-primary-foreground/80">
                  Ytrebygdsvegen 37
                  <br />
                  5251 Søreidgrend
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-5 w-5 flex-shrink-0" />
                <a
                  href="tel:+4791135991"
                  className="text-sm text-primary-foreground/80 hover:text-white transition-colors"
                >
                  911 35 991
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-5 w-5 flex-shrink-0" />
                <a
                  href="mailto:post@motoro.no"
                  className="text-sm text-primary-foreground/80 hover:text-white transition-colors"
                >
                  post@motoro.no
                </a>
              </li>
            </ul>
          </div>

          {/* Opening Hours */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Åpningstider</h3>
            <p className="text-sm text-primary-foreground/80">Etter avtale</p>
          </div>
        </div>

        <div className="border-t border-primary-foreground/20 mt-8 pt-8 flex flex-col sm:flex-row items-center justify-between gap-2 text-sm text-primary-foreground/60">
          <p>&copy; {new Date().getFullYear()} Motoro AS. Org.nr: 937 066 872. Alle rettigheter reservert.</p>
          <Link href="/admin/login" className="hover:text-white transition-colors">
            Admin
          </Link>
        </div>
      </div>
    </footer>
  )
}
