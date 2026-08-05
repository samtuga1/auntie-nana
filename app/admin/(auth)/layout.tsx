import Image from "next/image"
import Link from "next/link"
import { BadgeCheck, Leaf, Timer } from "lucide-react"
import { SITE } from "@/lib/site"

const HIGHLIGHTS = [
  { icon: Leaf, label: "Locally sourced" },
  { icon: BadgeCheck, label: "FDA approved" },
  { icon: Timer, label: "Ready in minutes" },
]

export default function AdminAuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid min-h-screen lg:grid-cols-[1.05fr_1fr]">
      {/* ── Brand panel ─────────────────────────────────────────────────── */}
      <div
        className="relative hidden overflow-hidden lg:flex lg:flex-col"
        style={{
          backgroundImage:
            "linear-gradient(155deg, #06751a 0%, #02570e 45%, #013b09 100%)",
        }}
      >
        <div
          className="pointer-events-none absolute -top-32 -right-24 size-[30rem] rounded-full opacity-30 blur-3xl"
          style={{ background: "radial-gradient(circle, #7dc242 0%, transparent 70%)" }}
        />
        <div
          className="pointer-events-none absolute -bottom-40 -left-32 size-[28rem] rounded-full opacity-20 blur-3xl"
          style={{ background: "radial-gradient(circle, #a8e063 0%, transparent 70%)" }}
        />

        <div className="relative z-10 flex flex-col px-12 pt-12">
          <Link href="/" className="inline-flex w-fit overflow-hidden rounded-2xl bg-white p-2">
            <Image
              src="/logo.png"
              alt={SITE.brand}
              width={663}
              height={798}
              priority
              className="h-12 w-auto"
            />
          </Link>

          <h1 className="mt-10 max-w-sm text-4xl leading-[1.1] font-bold tracking-tight text-white">
            Welcome back to the kitchen
          </h1>
          <p className="mt-4 max-w-sm leading-relaxed text-white/70">
            Manage your products, orders and customers — everything that keeps the taste of home
            moving.
          </p>

          <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3">
            {HIGHLIGHTS.map((h) => (
              <div key={h.label} className="flex items-center gap-2">
                <h.icon className="size-4 text-[#a8e063]" />
                <span className="text-sm text-white/80">{h.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10 mt-auto flex justify-center">
          <Image
            src="/brand/auntie-nana-spoon.png"
            alt="Auntie Nana"
            width={560}
            height={958}
            priority
            className="h-auto max-h-[52vh] w-auto object-contain drop-shadow-2xl"
          />
        </div>
      </div>

      {/* ── Form panel ──────────────────────────────────────────────────── */}
      <div className="flex flex-col bg-white">
        <div className="flex justify-center px-5 pt-10 lg:hidden">
          <Link href="/">
            <Image
              src="/logo.png"
              alt={SITE.brand}
              width={663}
              height={798}
              priority
              className="h-14 w-auto"
            />
          </Link>
        </div>

        <div className="flex flex-1 items-center justify-center px-5 py-12 sm:px-10">
          <div className="w-full max-w-sm">{children}</div>
        </div>

        <footer className="pb-6 text-center text-xs text-gray-400">
          &copy; {new Date().getFullYear()} {SITE.brand}. Admin access only.
        </footer>
      </div>
    </div>
  )
}
