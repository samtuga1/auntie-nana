import type { Metadata } from "next"
import { Suspense } from "react"
import { ShopPageContent } from "./_shop-content"

export const metadata: Metadata = {
  title: "Shop all products",
  description:
    "Browse the full Auntie Nana range — spices and seasonings, powdered foods and instant cereals.",
}

export default function ShopPage() {
  return (
    <Suspense fallback={null}>
      <ShopPageContent />
    </Suspense>
  )
}
