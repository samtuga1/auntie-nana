import Image from "next/image"
import Link from "next/link"
import type { Metadata } from "next"
import { ArrowRight, BadgeCheck, FlaskConical, Heart, Leaf, Lightbulb, ShieldCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { SITE } from "@/lib/site"

export const metadata: Metadata = {
  title: "Our story",
  description:
    "Auntie Nana is the Ghanaian grandmother whose cooking you miss when you're away from home. Here's how we put that taste in a pack.",
}

const VALUES = [
  { icon: Heart, title: "Warm", body: "We speak to our customers like family, because that's who they are." },
  { icon: BadgeCheck, title: "Trustworthy", body: "Consistent quality in every batch. What you bought last month is what you'll get today." },
  { icon: Leaf, title: "Authentic", body: "Traditional Ghanaian recipes and local produce. No imitation, no shortcuts." },
  { icon: Lightbulb, title: "Innovative", body: "We solve the real problem: how to eat well when there is no time." },
  { icon: ShieldCheck, title: "Health-conscious", body: "Nutrition is the point, not an afterthought bolted onto convenience." },
  { icon: FlaskConical, title: "Rigorous", body: "Every formulation is researched and tested before it reaches a shelf." },
]

export default function AboutPage() {
  return (
    <>
      <section className="relative overflow-hidden bg-[#02570e]">
        <div
          className="pointer-events-none absolute -top-40 -left-24 size-[30rem] rounded-full opacity-20 blur-3xl"
          style={{ background: "radial-gradient(circle, #7dc242 0%, transparent 70%)" }}
        />
        <div className="relative mx-auto w-full max-w-3xl px-5 py-16 text-center md:px-8 md:py-24">
          <p className="text-xs font-semibold tracking-[0.18em] text-[#a8e063] uppercase">
            Our story
          </p>
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-white md:text-5xl">
            Every Ghanaian has an Auntie Nana
          </h1>
          <p className="mx-auto mt-5 max-w-xl leading-relaxed text-white/75">
            She&apos;s the grandmother in the kitchen who cooks with love — and hers is the taste
            you miss most when you&apos;re far from home.
          </p>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-5 py-16 md:px-8 md:py-24">
        <div className="grid gap-12 md:grid-cols-2 md:items-center md:gap-16">
          <div className="flex justify-center">
            <Image
              src="/brand/auntie-nana-bowl.png"
              alt="Auntie Nana holding a bowl of freshly prepared food"
              width={560}
              height={382}
              className="h-auto w-full max-w-md rounded-3xl bg-[#f7faf2] p-4"
            />
          </div>

          <div className="flex flex-col gap-5 text-muted-foreground">
            <h2 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
              A problem worth solving
            </h2>
            <p className="leading-relaxed">
              Life in Ghana moves fast. Between work, traffic and everything else a day demands,
              fewer and fewer people have the hours it takes to ferment corn for banku or pound
              fufu from scratch.
            </p>
            <p className="leading-relaxed">
              So people reach for whatever is quick. And too often, quick means highly processed —
              food that fills you up but gives you nothing back. Convenience became a word that
              meant &ldquo;unhealthy.&rdquo;
            </p>
            <p className="leading-relaxed">
              We didn&apos;t accept that trade-off. {SITE.brand} exists to prove that a meal can be
              ready in minutes and still be made of real, locally grown food that tastes like
              someone who loves you cooked it.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-[#f7faf2]">
        <div className="mx-auto w-full max-w-6xl px-5 py-16 md:px-8 md:py-24">
          <div className="grid gap-12 md:grid-cols-2 md:items-center md:gap-16">
            <div className="order-2 flex flex-col gap-5 text-muted-foreground md:order-1">
              <h2 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
                How we make it
              </h2>
              <p className="leading-relaxed">
                We buy our maize, cassava, plantain, fonio and spices from Ghanaian farms. Nothing
                imported to cut costs, nothing artificial to stretch a batch.
              </p>
              <p className="leading-relaxed">
                Everything is processed on food-grade equipment under strict hygiene controls, then
                tested for nutritional value, shelf life and safety before it&apos;s packed. Each
                pack carries RFID labelling, so any batch can be traced back to its source.
              </p>
              <p className="leading-relaxed">
                The whole range is approved by the Ghana Food and Drugs Authority. That&apos;s the
                floor we build on, not the ceiling we aim for.
              </p>
            </div>

            <div className="order-1 flex justify-center md:order-2">
              <Image
                src="/brand/auntie-nana-thumbsup.png"
                alt="Auntie Nana giving a thumbs up"
                width={480}
                height={555}
                className="h-auto w-full max-w-sm"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-5 py-16 md:px-8 md:py-24">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold tracking-[0.18em] text-primary uppercase">
            What we stand for
          </p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">
            The standard behind the name
          </h2>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {VALUES.map((v) => (
            <div key={v.title} className="rounded-2xl border border-black/6 bg-white p-6">
              <div className="flex size-11 items-center justify-center rounded-xl bg-primary/8">
                <v.icon className="size-5 text-primary" />
              </div>
              <h3 className="mt-4 font-semibold tracking-tight">{v.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{v.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-5 pb-16 md:px-8 md:pb-24">
        <div className="overflow-hidden rounded-3xl bg-[#02570e] px-6 py-14 text-center md:px-16">
          <h2 className="mx-auto max-w-xl text-3xl font-bold tracking-tight text-white md:text-4xl">
            Taste it for yourself
          </h2>
          <p className="mx-auto mt-3 max-w-md text-white/75">
            Twenty-plus products across three ranges, delivered to your door.
          </p>
          <Button
            size="lg"
            nativeButton={false}
            render={<Link href="/products" />}
            className="mt-8 h-12 gap-2 bg-white px-6 text-[#02570e] hover:bg-white/90"
          >
            Shop the range
            <ArrowRight className="size-4" />
          </Button>
        </div>
      </section>
    </>
  )
}
