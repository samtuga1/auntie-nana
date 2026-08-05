"use client"

import { useEffect, useState } from "react"
import { Search, Users } from "lucide-react"
import { useQuery } from "@tanstack/react-query"
import { format } from "date-fns"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet"
import { Skeleton } from "@/components/ui/skeleton"
import { CustomerService } from "@/lib/api/customers"
import { ORDER_STATUS_STYLES } from "@/lib/order-status"
import { cn, formatGHS } from "@/lib/utils"
import type { ICustomer } from "@/interfaces"

export function CustomersPageContent() {
  const [search, setSearch] = useState("")
  const [debounced, setDebounced] = useState("")
  const [selected, setSelected] = useState<ICustomer | null>(null)

  useEffect(() => {
    const t = setTimeout(() => setDebounced(search), 300)
    return () => clearTimeout(t)
  }, [search])

  const { data, isLoading } = useQuery({
    queryKey: ["customers", debounced],
    queryFn: () => CustomerService.fetchAll({ search: debounced || undefined, limit: 50 }),
    placeholderData: (prev) => prev,
  })

  const { data: customerOrders = [] } = useQuery({
    queryKey: ["customer-orders", selected?._id],
    queryFn: () => CustomerService.fetchOrders(selected!._id),
    enabled: !!selected,
  })

  const customers = data?.data ?? []
  const total = data?.total ?? 0

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Customers</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {total} customer{total === 1 ? "" : "s"} have ordered from you
        </p>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium text-muted-foreground">Search</label>
        <div className="relative">
          <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Name, email or phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-9 w-full pl-9 sm:w-72"
          />
        </div>
      </div>

      {!isLoading && customers.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed py-20 text-center">
          <div className="flex size-14 items-center justify-center rounded-full bg-muted">
            <Users className="size-6 text-muted-foreground" />
          </div>
          <p className="mt-4 font-medium">No customers yet</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Anyone who places an order will show up here.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border">
          <div className="overflow-x-auto">
            <table className="w-full min-w-max text-sm">
              <thead>
                <tr className="border-b bg-muted/40 text-left text-xs text-muted-foreground">
                  <th className="px-4 py-2.5 font-medium">Customer</th>
                  <th className="px-4 py-2.5 font-medium">Phone</th>
                  <th className="px-4 py-2.5 font-medium">Joined</th>
                  <th className="px-4 py-2.5 font-medium">Orders</th>
                  <th className="px-4 py-2.5 text-right font-medium">Total spent</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {isLoading
                  ? Array.from({ length: 6 }).map((_, i) => (
                      <tr key={i}>
                        <td colSpan={5} className="px-4 py-3">
                          <Skeleton className="h-5 w-full" />
                        </td>
                      </tr>
                    ))
                  : customers.map((c) => (
                      <tr
                        key={c._id}
                        onClick={() => setSelected(c)}
                        className="cursor-pointer bg-background transition-colors hover:bg-muted/30"
                      >
                        <td className="px-4 py-3">
                          <p className="font-medium">{c.name}</p>
                          <p className="text-xs text-muted-foreground">{c.email}</p>
                        </td>
                        <td className="px-4 py-3 text-muted-foreground">{c.phone}</td>
                        <td className="px-4 py-3 text-muted-foreground">
                          {format(new Date(c.createdAt), "MMM yyyy")}
                        </td>
                        <td className="px-4 py-3">{c.totalOrders}</td>
                        <td className="px-4 py-3 text-right font-medium">
                          {formatGHS(c.totalSpent)}
                        </td>
                      </tr>
                    ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <Sheet open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <SheetContent
          key={selected?._id ?? "none"}
          side="right"
          className="flex w-full flex-col gap-0 overflow-y-auto p-0 sm:max-w-md"
        >
          <SheetTitle className="sr-only">Customer details</SheetTitle>
          {selected && (
            <div className="flex flex-col gap-6 p-6">
              <div>
                <h2 className="text-lg font-semibold">{selected.name}</h2>
                <p className="text-sm text-muted-foreground">{selected.email}</p>
                <p className="text-sm text-muted-foreground">{selected.phone}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Customer since {format(new Date(selected.createdAt), "d MMMM yyyy")}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl border p-3">
                  <p className="text-xs text-muted-foreground">Total orders</p>
                  <p className="mt-1 text-lg font-bold">{selected.totalOrders}</p>
                </div>
                <div className="rounded-xl border p-3">
                  <p className="text-xs text-muted-foreground">Total spent</p>
                  <p className="mt-1 text-lg font-bold">{formatGHS(selected.totalSpent)}</p>
                </div>
              </div>

              <div>
                <p className="text-xs font-medium text-muted-foreground">Order history</p>
                <div className="mt-2 flex flex-col divide-y rounded-xl border">
                  {customerOrders.length === 0 ? (
                    <p className="p-4 text-sm text-muted-foreground">No orders recorded.</p>
                  ) : (
                    customerOrders.map((o) => (
                      <div key={o._id} className="flex items-center justify-between gap-3 p-3">
                        <div>
                          <p className="text-sm font-medium">{o.orderNumber}</p>
                          <p className="text-xs text-muted-foreground">
                            {format(new Date(o.createdAt), "d MMM yyyy")} · {o.items.length} item
                            {o.items.length === 1 ? "" : "s"}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge
                            className={cn(
                              "rounded-full text-xs capitalize",
                              ORDER_STATUS_STYLES[o.status]
                            )}
                          >
                            {o.status}
                          </Badge>
                          <span className="text-sm font-semibold">{formatGHS(o.total)}</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  )
}
