"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { AdminSidebar } from "@/components/admin/app-sidebar"
import { AdminTopbar } from "@/components/admin/topbar"
import { useAdminAuthStore } from "@/stores/admin-auth-store"

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const token = useAdminAuthStore((s) => s.token)
  const hasHydrated = useAdminAuthStore((s) => s._hasHydrated)

  useEffect(() => {
    if (hasHydrated && !token) router.replace("/admin/sign-in")
  }, [hasHydrated, token, router])

  if (!hasHydrated || !token) return null

  return (
    <SidebarProvider className="h-svh overflow-hidden">
      <AdminSidebar />
      <SidebarInset>
        <AdminTopbar />
        <div className="flex-1 overflow-y-auto bg-[#fcfcfc] sm:bg-background">
          <div className="flex flex-col gap-6 p-4 sm:p-6">{children}</div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
