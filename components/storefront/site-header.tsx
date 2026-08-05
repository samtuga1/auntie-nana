"use client"

import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { Menu, ShoppingBag, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCartStore, selectCartCount } from "@/stores/cart-store"
import { NAV_LINKS, SITE } from "@/lib/site"
import { cn } from "@/lib/utils"

export function SiteHeader() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const count = useCartStore(selectCartCount)
  const hydrated = useCartStore((s) => s._hasHydrated)

  return (
    <header className="sticky top-0 z-50 border-b border-black/5 bg-white/90 backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center gap-4 px-5 md:h-20 md:px-8">
        <Link href="/" className="flex shrink-0 items-center" aria-label={`${SITE.brand} home`}>
          <Image
            src="/logo.png"
            alt={SITE.brand}
            width={663}
            height={798}
            priority
            className="h-10 w-auto md:h-12"
          />
        </Link>

        <nav className="ml-auto hidden items-center gap-1 md:flex">
          {NAV_LINKS.map((link) => {
            const active = pathname === link.href || pathname.startsWith(link.href + "/")
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  active
                    ? "bg-primary/8 text-primary"
                    : "text-foreground/70 hover:bg-muted hover:text-foreground"
                )}
              >
                {link.label}
              </Link>
            )
          })}
        </nav>

        <div className="ml-auto flex items-center gap-2 md:ml-4">
          <Link
            href="/cart"
            className="relative flex size-10 items-center justify-center rounded-lg text-foreground/70 transition-colors hover:bg-muted hover:text-foreground"
            aria-label="Cart"
          >
            <ShoppingBag className="size-5" />
            {hydrated && count > 0 && (
              <span className="absolute top-1 right-1 flex min-w-4.5 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground">
                {count}
              </span>
            )}
          </Link>

          <Button
            nativeButton={false}
            render={<Link href="/products" />}
            className="hidden md:inline-flex"
          >
            Shop now
          </Button>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="flex size-10 items-center justify-center rounded-lg text-foreground/70 hover:bg-muted md:hidden"
            aria-label="Menu"
            aria-expanded={open}
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-black/5 bg-white md:hidden">
          <nav className="mx-auto flex w-full max-w-6xl flex-col px-5 py-3">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-3 text-sm font-medium text-foreground/80 hover:bg-muted"
              >
                {link.label}
              </Link>
            ))}
            <Button
              nativeButton={false}
              render={<Link href="/products" onClick={() => setOpen(false)} />}
              className="mt-2"
            >
              Shop now
            </Button>
          </nav>
        </div>
      )}
    </header>
  )
}
