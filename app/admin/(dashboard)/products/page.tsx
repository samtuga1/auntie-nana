import type { Metadata } from "next"
import { ProductsPageContent } from "./_components/products-page-content"

export const metadata: Metadata = { title: "Products" }

export default function ProductsPage() {
  return <ProductsPageContent />
}
