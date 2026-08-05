import Image from "next/image"
import Link from "next/link"
import type { Metadata } from "next"
import {
  ArrowRight,
  BadgeCheck,
  Clock,
  FlaskConical,
  Leaf,
  MessageCircle,
  ShieldCheck,
  Sparkles,
  Timer,
  Truck,
  Wheat,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { CategoryRail } from "./_components/category-rail"
import { FeaturedProducts } from "./_components/featured-products"
import { SITE } from "@/lib/site"

export const metadata: Metadata = {
  title: "Auntie Nana — The Taste of Home, Made Fast and Easy",
  description: SITE.description,
}

const TRUST_STRIP = [
  { icon: BadgeCheck, label: "FDA approved" },
  { icon: Leaf, label: "Locally sourced" },
  { icon: Sparkles, label: "No additives" },
  { icon: Timer, label: "Ready in minutes" },
]

const BENEFITS = [
  {
    icon: Clock,
    title: "Ready in minutes",
    body: "Banku, fufu, koko and porridge without the pounding, fermenting or waiting. Add water and it's done.",
  },
  {
    icon: Leaf,
    title: "Locally sourced",
    body: "Maize, cassava, plantain, fonio and spices bought from Ghanaian farms — never imported filler.",
  },
  {
    icon: Wheat,
    title: "Real nutrition",
    body: "Whole grains and legumes, milled to keep the goodness in. Convenience that isn't junk food.",
  },
  {
    icon: Sparkles,
    title: "Authentic taste",
    body: "Traditional recipes measured to the gram, so every pack tastes exactly like the last one.",
  },
  {
    icon: Truck,
    title: "Easy to carry",
    body: "Sealed sachets and packs that travel to the office, the hostel and the site without spilling.",
  },
  {
    icon: ShieldCheck,
    title: "Safe by design",
    body: "Hygienic processing, high-standard equipment and RFID-labelled packs you can trace.",
  },
]

const AUDIENCES = [
  {
    title: "For the busy mum",
    quote: "I desperately need a helping hand — especially in the kitchen.",
    body: "Get a hot, proper meal on the table after work without cutting corners on what your family eats.",
  },
  {
    title: "For the professional",
    quote: "Time is money. Every part of my day has to earn its place.",
    body: "Breakfast in two minutes at your desk, and dinner that doesn't need an hour of prep when you get home.",
  },
  {
    title: "For the student",
    quote: "Anything that lessens the chaos of my day is a game changer.",
    body: "Filling, affordable meals you can make in a hostel room with nothing but hot water.",
  },
]

const QUALITY_POINTS = [
  { icon: BadgeCheck, title: "FDA approved", body: "Every product in the range is certified by the Ghana Food and Drugs Authority." },
  { icon: ShieldCheck, title: "Hygienic processing", body: "Closed, food-grade production lines with strict handling controls end to end." },
  { icon: FlaskConical, title: "Scientifically researched", body: "Formulations tested for nutritional value, shelf life and maximum safety." },
  { icon: Sparkles, title: "RFID labelled", body: "Each pack is traceable back to its batch, so quality issues never hide." },
]

export default function StorefrontHomePage() {
  return (
    <>
      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-[#02570e]">
        <div
          className="pointer-events-none absolute -top-32 -right-32 size-[34rem] rounded-full opacity-25 blur-3xl"
          style={{ background: "radial-gradient(circle, #7dc242 0%, transparent 70%)" }}
        />
        <div className="relative mx-auto grid w-full max-w-6xl gap-10 px-5 pt-14 pb-0 md:grid-cols-[1.08fr_0.92fr] md:items-center md:gap-6 md:px-8 md:pt-20">
          <div className="pb-12 md:pb-24">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1.5 text-xs font-semibold text-white/90 ring-1 ring-white/15">
              <Leaf className="size-3.5" />
              Convenience meets nutrition
            </span>

            <h1 className="mt-5 text-[2.5rem] leading-[1.05] font-bold tracking-tight text-white md:text-[3.25rem] lg:text-[3.6rem]">
              The taste of home,
              <br />
              <span className="text-[#a8e063]">made fast and easy</span>
            </h1>

            <p className="mt-5 max-w-md text-base leading-relaxed text-white/75 md:text-lg">
              Authentic Ghanaian meals and seasonings made with locally sourced, organic
              ingredients. Quick to prepare, healthy to eat — just the way Grandma makes it.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Button
                size="lg"
                nativeButton={false}
                render={<Link href="/products" />}
                className="h-12 gap-2 bg-white px-6 text-[#02570e] hover:bg-white/90"
              >
                Shop the range
                <ArrowRight className="size-4" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                nativeButton={false}
                render={<Link href="/about" />}
                className="h-12 border-white/25 bg-transparent px-6 text-white hover:bg-white/10 hover:text-white dark:border-white/25 dark:bg-transparent dark:hover:bg-white/10"
              >
                Meet Auntie Nana
              </Button>
            </div>

            <dl className="mt-10 flex flex-wrap gap-x-8 gap-y-4">
              {[
                { value: "20+", label: "Products" },
                { value: "3", label: "Ranges" },
                { value: "100%", label: "Locally sourced" },
              ].map((stat) => (
                <div key={stat.label}>
                  <dt className="text-2xl font-bold text-white">{stat.value}</dt>
                  <dd className="text-xs tracking-wide text-white/60 uppercase">{stat.label}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="relative flex items-end justify-center self-end">
            <Image
              src="/brand/auntie-nana-bowl.png"
              alt="Auntie Nana holding a bowl of freshly prepared food"
              width={620}
              height={423}
              priority
              className="relative z-10 h-auto w-full max-w-md drop-shadow-2xl md:max-w-xl"
            />
          </div>
        </div>

        {/* trust strip */}
        <div className="relative border-t border-white/10 bg-[#013b09]">
          <div className="mx-auto grid w-full max-w-6xl grid-cols-2 gap-y-4 px-5 py-5 md:grid-cols-4 md:px-8">
            {TRUST_STRIP.map((item) => (
              <div key={item.label} className="flex items-center justify-center gap-2.5">
                <item.icon className="size-4 shrink-0 text-[#a8e063]" />
                <span className="text-sm font-medium text-white/85">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Categories ────────────────────────────────────────────────────── */}
      <CategoryRail />

      {/* ── Best sellers ──────────────────────────────────────────────────── */}
      <FeaturedProducts />

      {/* ── Brand story ───────────────────────────────────────────────────── */}
      <section className="bg-[#02570e]">
        <div className="mx-auto grid w-full max-w-6xl items-center gap-10 px-5 py-16 md:grid-cols-2 md:gap-14 md:px-8 md:py-24">
          <div className="order-2 flex justify-center md:order-1">
            <Image
              src="/brand/auntie-nana-spoon.png"
              alt="Auntie Nana with a wooden spoon and bowl"
              width={430}
              height={640}
              className="h-auto w-full max-w-xs drop-shadow-2xl md:max-w-sm"
            />
          </div>

          <div className="order-1 md:order-2">
            <p className="text-xs font-semibold tracking-[0.18em] text-[#a8e063] uppercase">
              Who is Auntie Nana?
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-white md:text-4xl">
              Every Ghanaian has an Auntie Nana
            </h2>
            <div className="mt-5 flex flex-col gap-4 text-white/75">
              <p className="leading-relaxed">
                She&apos;s the grandmother in the kitchen who cooks with love. You&apos;ll find her
                over a pot of light soup, reaching for the same Ghanaian spices and local produce
                she&apos;s used for forty years.
              </p>
              <p className="leading-relaxed">
                When you&apos;re far from home, hers is the taste you miss. We built this brand to
                put that taste back within reach — the traditional recipes, the local ingredients,
                the care — in a pack you can prepare in minutes.
              </p>
              <p className="leading-relaxed">
                That&apos;s the whole promise: convenience that never costs you nutrition, quality
                or the flavour you grew up on.
              </p>
            </div>

            <Button
              nativeButton={false}
              render={<Link href="/about" />}
              className="mt-7 gap-2 bg-white text-[#02570e] hover:bg-white/90"
            >
              Read our story
              <ArrowRight className="size-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* ── Benefits ──────────────────────────────────────────────────────── */}
      <section className="mx-auto w-full max-w-6xl px-5 py-16 md:px-8 md:py-24">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold tracking-[0.18em] text-primary uppercase">
            Why Auntie Nana
          </p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">
            Fast food that isn&apos;t junk food
          </h2>
          <p className="mt-3 text-muted-foreground">
            Ready-to-eat has a reputation problem. We built the range to prove convenience and real
            nutrition can live in the same pack.
          </p>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {BENEFITS.map((b) => (
            <div
              key={b.title}
              className="rounded-2xl border border-black/6 bg-white p-6 transition-shadow hover:shadow-md"
            >
              <div className="flex size-11 items-center justify-center rounded-xl bg-primary/8">
                <b.icon className="size-5 text-primary" />
              </div>
              <h3 className="mt-4 font-semibold tracking-tight">{b.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{b.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Audiences ─────────────────────────────────────────────────────── */}
      <section className="bg-[#f7faf2]">
        <div className="mx-auto w-full max-w-6xl px-5 py-16 md:px-8 md:py-24">
          <div className="grid gap-10 md:grid-cols-[0.9fr_1.1fr] md:items-center">
            <div>
              <p className="text-xs font-semibold tracking-[0.18em] text-primary uppercase">
                Made for real days
              </p>
              <h2 className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">
                Whoever you&apos;re cooking for
              </h2>
              <p className="mt-3 text-muted-foreground">
                From the professional in the office to the mason on the construction site — Auntie
                Nana meets people where their day actually is.
              </p>
              <div className="mt-8 overflow-hidden rounded-3xl">
                <Image
                  src="/brand/family.jpg"
                  alt="A mother and daughter laughing together"
                  width={809}
                  height={1000}
                  className="h-64 w-full object-cover object-top md:h-80"
                />
              </div>
            </div>

            <div className="flex flex-col gap-4">
              {AUDIENCES.map((a) => (
                <div key={a.title} className="rounded-2xl border border-black/6 bg-white p-6">
                  <h3 className="font-semibold tracking-tight">{a.title}</h3>
                  <p className="mt-3 border-l-2 border-primary/30 pl-3 text-sm text-foreground/80 italic">
                    &ldquo;{a.quote}&rdquo;
                  </p>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{a.body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Quality / reason to believe ───────────────────────────────────── */}
      <section className="mx-auto w-full max-w-6xl px-5 py-16 md:px-8 md:py-24">
        <div className="grid gap-10 md:grid-cols-[1fr_1.1fr] md:items-center">
          <div className="flex justify-center">
            <Image
              src="/brand/auntie-nana-thumbsup.png"
              alt="Auntie Nana giving a thumbs up"
              width={520}
              height={600}
              className="h-auto w-full max-w-sm"
            />
          </div>

          <div>
            <p className="text-xs font-semibold tracking-[0.18em] text-primary uppercase">
              Quality you can check
            </p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">
              Trust isn&apos;t a claim, it&apos;s a process
            </h2>
            <p className="mt-3 text-muted-foreground">
              We hold every batch to the same standard, and we can show our work.
            </p>

            <div className="mt-8 flex flex-col divide-y divide-black/6 border-y border-black/6">
              {QUALITY_POINTS.map((q) => (
                <div key={q.title} className="flex gap-4 py-4">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/8">
                    <q.icon className="size-4.5 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold">{q.title}</h3>
                    <p className="mt-0.5 text-sm text-muted-foreground">{q.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Closing CTA ───────────────────────────────────────────────────── */}
      <section className="mx-auto w-full max-w-6xl px-5 pb-16 md:px-8 md:pb-24">
        <div className="relative overflow-hidden rounded-3xl bg-[#02570e] px-6 py-14 text-center md:px-16 md:py-20">
          <div
            className="pointer-events-none absolute -bottom-24 -left-16 size-96 rounded-full opacity-25 blur-3xl"
            style={{ background: "radial-gradient(circle, #7dc242 0%, transparent 70%)" }}
          />
          <div className="relative">
            <h2 className="mx-auto max-w-2xl text-3xl font-bold tracking-tight text-white md:text-4xl">
              Bring the taste of home to your kitchen
            </h2>
            <p className="mx-auto mt-3 max-w-lg text-white/75">
              Order online and we&apos;ll deliver across Accra and beyond. Stocking a shop or
              supermarket? Talk to us about wholesale pricing.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Button
                size="lg"
                nativeButton={false}
                render={<Link href="/products" />}
                className="h-12 gap-2 bg-white px-6 text-[#02570e] hover:bg-white/90"
              >
                Start shopping
                <ArrowRight className="size-4" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                nativeButton={false}
                render={<Link href="/contact?subject=wholesale" />}
                className="h-12 gap-2 border-white/25 bg-transparent px-6 text-white hover:bg-white/10 hover:text-white dark:border-white/25 dark:bg-transparent dark:hover:bg-white/10"
              >
                <MessageCircle className="size-4" />
                Wholesale enquiry
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
