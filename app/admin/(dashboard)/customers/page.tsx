import type { Metadata } from "next"
import { CustomersPageContent } from "./_components/customers-page-content"

export const metadata: Metadata = { title: "Customers" }

export default function AdminCustomersPage() {
  return <CustomersPageContent />
}
