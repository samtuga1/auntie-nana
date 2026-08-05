import type { Metadata } from "next"
import { Suspense } from "react"
import { ContactPageContent } from "./_contact-content"

export const metadata: Metadata = {
  title: "Contact us",
  description:
    "Talk to the Auntie Nana team about orders, stockists and wholesale pricing across Ghana.",
}

export default function ContactPage() {
  return (
    <Suspense fallback={null}>
      <ContactPageContent />
    </Suspense>
  )
}
