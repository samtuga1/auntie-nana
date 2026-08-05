"use client"

import { useState } from "react"
import { useSearchParams } from "next/navigation"
import { Clock, Loader2, Mail, MapPin, Phone, Store } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Field, FieldLabel, FieldError } from "@/components/ui/field"
import { SITE } from "@/lib/site"
import { isValidGhanaPhone, GHANA_PHONE_ERROR } from "@/lib/phone"

const SUBJECTS = [
  { value: "order", label: "An order I placed" },
  { value: "wholesale", label: "Wholesale / stocking your products" },
  { value: "product", label: "A question about a product" },
  { value: "other", label: "Something else" },
]

export function ContactPageContent() {
  const searchParams = useSearchParams()
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    subject: searchParams.get("subject") ?? "order",
    message: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submitting, setSubmitting] = useState(false)

  function set(field: keyof typeof form) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setForm((prev) => ({ ...prev, [field]: e.target.value }))
  }

  function validate() {
    const next: Record<string, string> = {}
    if (!form.name.trim()) next.name = "Tell us your name."
    if (!form.email.trim() || !form.email.includes("@")) next.email = "Enter a valid email address."
    if (form.phone && !isValidGhanaPhone(form.phone)) next.phone = GHANA_PHONE_ERROR
    if (form.message.trim().length < 10) next.message = "Please add a little more detail."
    setErrors(next)
    return Object.keys(next).length === 0
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validate()) return
    setSubmitting(true)
    // No backend yet — this is where the enquiry POST will go.
    setTimeout(() => {
      setSubmitting(false)
      toast.success("Thanks! We'll get back to you within one working day.")
      setForm({ name: "", email: "", phone: "", subject: "order", message: "" })
    }, 700)
  }

  return (
    <>
      <section className="border-b border-black/5 bg-[#f7faf2]">
        <div className="mx-auto w-full max-w-6xl px-5 py-12 md:px-8 md:py-16">
          <p className="text-xs font-semibold tracking-[0.18em] text-primary uppercase">Contact</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">Talk to us</h1>
          <p className="mt-3 max-w-xl text-muted-foreground">
            Questions about an order, stocking our products, or anything else — we&apos;re here.
          </p>
        </div>
      </section>

      <section className="mx-auto grid w-full max-w-6xl gap-10 px-5 py-14 md:grid-cols-[1fr_1.2fr] md:gap-14 md:px-8 md:py-20">
        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-5">
            {[
              { icon: MapPin, label: "Visit us", value: SITE.address },
              { icon: Phone, label: "Call us", value: SITE.phone, href: `tel:${SITE.phone.replace(/\s/g, "")}` },
              { icon: Mail, label: "Email us", value: SITE.email, href: `mailto:${SITE.email}` },
              { icon: Clock, label: "Opening hours", value: "Mon – Fri, 8am – 5pm · Sat, 9am – 2pm" },
            ].map((item) => (
              <div key={item.label} className="flex gap-4">
                <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/8">
                  <item.icon className="size-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-semibold">{item.label}</p>
                  {item.href ? (
                    <a
                      href={item.href}
                      className="mt-0.5 block text-sm text-muted-foreground hover:text-primary"
                    >
                      {item.value}
                    </a>
                  ) : (
                    <p className="mt-0.5 text-sm text-muted-foreground">{item.value}</p>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="rounded-2xl border border-black/6 bg-[#f7faf2] p-6">
            <div className="flex size-11 items-center justify-center rounded-xl bg-primary/10">
              <Store className="size-5 text-primary" />
            </div>
            <h2 className="mt-4 font-semibold tracking-tight">Stock Auntie Nana</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              We supply supermarkets, corner shops and neighbourhood markets across Ghana. Send us a
              wholesale enquiry and we&apos;ll come back with pricing and minimum order quantities.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field data-invalid={!!errors.name}>
              <FieldLabel>Your name</FieldLabel>
              <Input placeholder="Ama Boateng" value={form.name} onChange={set("name")} />
              <FieldError>{errors.name}</FieldError>
            </Field>

            <Field data-invalid={!!errors.email}>
              <FieldLabel>Email address</FieldLabel>
              <Input
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={set("email")}
              />
              <FieldError>{errors.email}</FieldError>
            </Field>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field data-invalid={!!errors.phone}>
              <FieldLabel>
                Phone <span className="text-xs font-normal text-muted-foreground">(optional)</span>
              </FieldLabel>
              <Input placeholder="024 000 0000" value={form.phone} onChange={set("phone")} />
              <FieldError>{errors.phone}</FieldError>
            </Field>

            <Field>
              <FieldLabel>What&apos;s it about?</FieldLabel>
              <select
                value={form.subject}
                onChange={set("subject")}
                className="h-9 w-full rounded-lg border border-input bg-transparent px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
              >
                {SUBJECTS.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
            </Field>
          </div>

          <Field data-invalid={!!errors.message}>
            <FieldLabel>Message</FieldLabel>
            <Textarea
              rows={6}
              placeholder="Tell us how we can help..."
              value={form.message}
              onChange={set("message")}
            />
            <FieldError>{errors.message}</FieldError>
          </Field>

          <Button type="submit" size="lg" disabled={submitting} className="h-12 gap-2 self-start px-8">
            {submitting && <Loader2 className="size-4 animate-spin" />}
            Send message
          </Button>

          <p className="text-xs text-muted-foreground">
            We normally reply within one working day. Prefer WhatsApp? Message us on{" "}
            <span className="font-medium text-foreground">{SITE.whatsapp}</span>.
          </p>
        </form>
      </section>
    </>
  )
}
