"use client"

import Link from "next/link"
import { useQuery } from "@tanstack/react-query"
import {
  AlertTriangle,
  ArrowRight,
  Package,
  ShoppingBag,
  TrendingUp,
  Users,
  type LucideIcon,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { StatsService } from "@/lib/api/admins"
import { useAdminAuthStore } from "@/stores/admin-auth-store"
import { cn, formatGHS } from "@/lib/utils"
import { ORDER_STATUS_STYLES } from "@/lib/order-status"
import { OrdersChart, RevenueChart } from "./dashboard-charts"

function StatCard({
  title,
  value,
  icon: Icon,
  color,
  loading,
}: {
  title: string
  value: string
  icon: LucideIcon
  color: string
  loading: boolean
}) {
  return (
    <Card className="overflow-hidden bg-white ring-1 ring-foreground/4 dark:bg-card">
      <CardContent className="px-3">
        <div className="flex items-start justify-between">
          <p className="text-sm text-muted-foreground">{title}</p>
          <div
            className="flex size-9 shrink-0 items-center justify-center rounded-full"
            style={{ backgroundColor: color + "20" }}
          >
            <Icon className="size-4" style={{ color }} />
          </div>
        </div>
        {loading ? (
          <Skeleton className="mt-4 h-7 w-24" />
        ) : (
          <p className="mt-3 text-2xl font-bold tracking-tight">{value}</p>
        )}
      </CardContent>
    </Card>
  )
}

export function OverviewPageContent() {
  const admin = useAdminAuthStore((s) => s.admin)

  const { data: stats, isLoading } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: () => StatsService.get(),
  })

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Welcome back{admin?.name ? `, ${admin.name.split(" ")[0]}` : ""}
        </h1>
        <p className="text-sm text-muted-foreground">Here&apos;s how the store is doing.</p>
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard
          title="Revenue"
          value={formatGHS(stats?.revenue ?? 0)}
          icon={TrendingUp}
          color="#02570e"
          loading={isLoading}
        />
        <StatCard
          title="Orders"
          value={String(stats?.totalOrders ?? 0)}
          icon={ShoppingBag}
          color="#f97316"
          loading={isLoading}
        />
        <StatCard
          title="Products"
          value={String(stats?.totalProducts ?? 0)}
          icon={Package}
          color="#3f9c37"
          loading={isLoading}
        />
        <StatCard
          title="Customers"
          value={String(stats?.totalCustomers ?? 0)}
          icon={Users}
          color="#0ea5e9"
          loading={isLoading}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <RevenueChart data={stats?.revenueByMonth} loading={isLoading} />
        <OrdersChart data={stats?.ordersByMonth} loading={isLoading} />
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
        <Card className="bg-white ring-1 ring-foreground/4 dark:bg-card">
          <CardContent>
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold">Recent orders</h2>
              <Button
                variant="ghost"
                size="xs"
                nativeButton={false}
                render={<Link href="/admin/orders" />}
                className="gap-1"
              >
                All orders
                <ArrowRight className="size-3" />
              </Button>
            </div>

            <div className="mt-4 overflow-x-auto">
              <table className="w-full min-w-max text-sm">
                <thead>
                  <tr className="border-b text-left text-xs text-muted-foreground">
                    <th className="pb-2 font-medium">Order</th>
                    <th className="pb-2 font-medium">Customer</th>
                    <th className="pb-2 font-medium">Status</th>
                    <th className="pb-2 text-right font-medium">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {isLoading
                    ? Array.from({ length: 5 }).map((_, i) => (
                        <tr key={i}>
                          <td colSpan={4} className="py-2.5">
                            <Skeleton className="h-5 w-full" />
                          </td>
                        </tr>
                      ))
                    : stats?.recentOrders.map((o) => (
                        <tr key={o._id}>
                          <td className="py-2.5 font-medium">{o.orderNumber}</td>
                          <td className="py-2.5 text-muted-foreground">{o.customer.name}</td>
                          <td className="py-2.5">
                            <Badge
                              className={cn("rounded-full text-xs", ORDER_STATUS_STYLES[o.status])}
                            >
                              {o.status}
                            </Badge>
                          </td>
                          <td className="py-2.5 text-right font-medium">{formatGHS(o.total)}</td>
                        </tr>
                      ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white ring-1 ring-foreground/4 dark:bg-card">
          <CardContent>
            <div className="flex items-center justify-between">
              <h2 className="flex items-center gap-1.5 text-sm font-semibold">
                <AlertTriangle className="size-3.5 text-amber-500" />
                Low stock
              </h2>
              <Button
                variant="ghost"
                size="xs"
                nativeButton={false}
                render={<Link href="/admin/products" />}
              >
                View all
              </Button>
            </div>
            <div className="mt-4 flex flex-col divide-y">
              {isLoading
                ? Array.from({ length: 4 }).map((_, i) => (
                    <Skeleton key={i} className="my-2 h-8 w-full" />
                  ))
                : stats?.lowStock.map((p) => (
                    <Link
                      key={p._id}
                      href={`/admin/products/${p._id}/edit`}
                      className="flex items-center justify-between gap-3 py-2.5 hover:opacity-70"
                    >
                      <span className="truncate text-sm">{p.name}</span>
                      <span
                        className={cn(
                          "shrink-0 text-xs font-semibold",
                          p.stock < 80 ? "text-destructive" : "text-muted-foreground"
                        )}
                      >
                        {p.stock} left
                      </span>
                    </Link>
                  ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
