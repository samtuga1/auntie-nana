import type { Metadata } from "next"
import { OverviewPageContent } from "./_components/overview-page-content"

export const metadata: Metadata = { title: "Overview" }

export default function AdminOverviewPage() {
  return <OverviewPageContent />
}
