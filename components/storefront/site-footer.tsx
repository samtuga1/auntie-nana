import Image from "next/image"
import Link from "next/link"
import { Mail, MapPin, Phone } from "lucide-react"
import { FaFacebookF, FaInstagram, FaTiktok } from "react-icons/fa6"
import { SITE } from "@/lib/site"

const SHOP_LINKS = [
  { label: "All products", href: "/products" },
  { label: "Spices & Seasonings", href: "/products?category=cat_spices" },
  { label: "Powdered Foods", href: "/products?category=cat_powdered" },
  { label: "Instant Cereals", href: "/products?category=cat_cereals" },
]

const COMPANY_LINKS = [
  { label: "Our story", href: "/about" },
  { label: "Contact us", href: "/contact" },
  { label: "Wholesale enquiries", href: "/contact?subject=wholesale" },
]

export function SiteFooter() {
  return (
    <footer className="bg-[#02570e] text-white">
      <div className="mx-auto w-full max-w-6xl px-5 py-14 md:px-8 md:py-16">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
          <div>
            <div className="inline-flex overflow-hidden rounded-2xl bg-white px-3 py-2.5">
              <Image
                src="/logo.png"
                alt={SITE.brand}
                width={663}
                height={798}
                className="h-12 w-auto"
              />
            </div>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/70">
              {SITE.description}
            </p>
            <div className="mt-5 flex gap-2">
              {[
                { href: SITE.socials.instagram, icon: FaInstagram, label: "Instagram" },
                { href: SITE.socials.facebook, icon: FaFacebookF, label: "Facebook" },
                { href: SITE.socials.tiktok, icon: FaTiktok, label: "TikTok" },
              ].map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={s.label}
                  className="flex size-9 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
                >
                  <s.icon className="size-4" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold tracking-wide text-white uppercase">Shop</h3>
            <ul className="mt-4 flex flex-col gap-2.5">
              {SHOP_LINKS.map((l) => (
                <li key={l.label}>
                  <Link href={l.href} className="text-sm text-white/70 hover:text-white">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold tracking-wide text-white uppercase">Company</h3>
            <ul className="mt-4 flex flex-col gap-2.5">
              {COMPANY_LINKS.map((l) => (
                <li key={l.label}>
                  <Link href={l.href} className="text-sm text-white/70 hover:text-white">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold tracking-wide text-white uppercase">Get in touch</h3>
            <ul className="mt-4 flex flex-col gap-3">
              <li className="flex items-start gap-2.5 text-sm text-white/70">
                <MapPin className="mt-0.5 size-4 shrink-0" />
                {SITE.address}
              </li>
              <li className="flex items-start gap-2.5 text-sm text-white/70">
                <Phone className="mt-0.5 size-4 shrink-0" />
                <a href={`tel:${SITE.phone.replace(/\s/g, "")}`} className="hover:text-white">
                  {SITE.phone}
                </a>
              </li>
              <li className="flex items-start gap-2.5 text-sm text-white/70">
                <Mail className="mt-0.5 size-4 shrink-0" />
                <a href={`mailto:${SITE.email}`} className="hover:text-white">
                  {SITE.email}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-2 border-t border-white/15 pt-6 text-sm text-white/60 sm:flex-row sm:items-center sm:justify-between">
          <p>
            &copy; {new Date().getFullYear()} {SITE.company} All rights reserved.
          </p>
          <p>
            {SITE.brand}&trade; is a registered trademark of {SITE.company}
          </p>
        </div>
      </div>
    </footer>
  )
}
