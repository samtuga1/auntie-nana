import type { Metadata } from "next"
import { AdminsPageContent } from "./_components/admins-page-content"

export const metadata: Metadata = { title: "Admins" }

export default function AdminsPage() {
  return <AdminsPageContent />
}
