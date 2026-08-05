"use client"

import {
  ChevronUp,
  LayoutDashboard,
  LogOut,
  Settings,
  ShoppingBag,
  ShieldCheck,
  Tags,
  Users,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useAdminAuthStore } from "@/stores/admin-auth-store"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

const navItems = [
  { label: "Overview", href: "/admin", icon: LayoutDashboard, color: "#6366f1", exact: true },
  { label: "Products", href: "/admin/products", icon: Tags, color: "#10b981", exact: false },
  { label: "Orders", href: "/admin/orders", icon: ShoppingBag, color: "#f97316", exact: false },
  { label: "Customers", href: "/admin/customers", icon: Users, color: "#0ea5e9", exact: false },
  {
    label: "Admins",
    href: "/admin/admins",
    icon: ShieldCheck,
    color: "#8b5cf6",
    exact: false,
    superAdminOnly: true,
  },
]

export function AdminSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const { isMobile, setOpenMobile } = useSidebar()
  const admin = useAdminAuthStore((s) => s.admin)
  const clearAuth = useAdminAuthStore((s) => s.clearAuth)

  function handleSignOut() {
    clearAuth()
    router.push("/admin/sign-in")
  }

  function closeMobile() {
    if (isMobile) setOpenMobile(false)
  }

  function isActive(item: (typeof navItems)[number]) {
    if (item.exact) return pathname === item.href
    return pathname.startsWith(item.href)
  }

  const visibleNavItems = navItems.filter((item) => !item.superAdminOnly || admin?.isSuperAdmin)

  return (
    <Sidebar>
      <SidebarHeader className="h-14 justify-center border-b px-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <Link href="/" className="flex items-center gap-2 px-1 py-1.5">
              <Image
                src="/logo.png"
                alt="Auntie Nana"
                width={663}
                height={798}
                className="h-9 w-auto shrink-0"
              />
              <span className="text-[10px] font-semibold tracking-widest text-muted-foreground uppercase">
                Admin
              </span>
            </Link>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Store</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {visibleNavItems.map((item) => {
                const active = isActive(item)
                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      render={<Link href={item.href} onClick={closeMobile} />}
                      isActive={active}
                      style={
                        active
                          ? { backgroundColor: item.color + "20", color: item.color }
                          : undefined
                      }
                    >
                      <item.icon />
                      {item.label}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>System</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  render={<Link href="/admin/settings" onClick={closeMobile} />}
                  isActive={pathname.startsWith("/admin/settings")}
                  style={
                    pathname.startsWith("/admin/settings")
                      ? { backgroundColor: "#64748b20", color: "#64748b" }
                      : undefined
                  }
                >
                  <Settings />
                  Settings
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t">
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger render={<SidebarMenuButton className="h-auto py-2" />}>
                <Avatar className="size-7">
                  <AvatarFallback className="bg-primary text-xs font-bold text-primary-foreground">
                    {admin?.name?.charAt(0).toUpperCase() ?? "A"}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col items-start">
                  <span className="text-sm font-medium">{admin?.name ?? "Admin"}</span>
                  <span className="text-xs text-muted-foreground">
                    {admin?.email ?? "Admin"}
                  </span>
                </div>
                <ChevronUp className="ml-auto" />
              </DropdownMenuTrigger>
              <DropdownMenuContent side="top" className="w-56">
                <DropdownMenuItem onClick={() => router.push("/admin/settings")}>
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-destructive" onClick={handleSignOut}>
                  <LogOut />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
