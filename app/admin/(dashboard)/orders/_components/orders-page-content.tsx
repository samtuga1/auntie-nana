"use client"

import Image from "next/image"
import { useEffect, useState } from "react"
import { ChevronLeft, ChevronRight, Package, Search, ShoppingBag } from "lucide-react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { format } from "date-fns"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet"
import { Skeleton } from "@/components/ui/skeleton"
import { OrderService } from "@/lib/api/orders"
import { ORDER_STATUSES, ORDER_STATUS_STYLES, PAYMENT_STATUS_STYLES } from "@/lib/order-status"
import { cn, formatGHS } from "@/lib/utils"
import type { IOrder } from "@/interfaces"

const PAGE_SIZE = 10

export function OrdersPageContent() {
  const queryClient = useQueryClient()
  const [search, setSearch] = useState("")
  const [debounced, setDebounced] = useState("")
  const [status, setStatus] = useState("")
  const [page, setPage] = useState(1)
  const [selected, setSelected] = useState<IOrder | null>(null)

  useEffect(() => {
    const t = setTimeout(() => {
      setDebounced(search)
      setPage(1)
    }, 300)
    return () => clearTimeout(t)
  }, [search])

  const { data, isLoading } = useQuery({
    queryKey: ["orders", debounced, status, page],
    queryFn: () =>
      OrderService.fetchAll({
        search: debounced || undefined,
        status: status || undefined,
        page,
        limit: PAGE_SIZE,
      }),
    placeholderData: (prev) => prev,
  })

  const statusMutation = useMutation({
    mutationFn: ({ id, next }: { id: string; next: IOrder["status"] }) =>
      OrderService.updateStatus(id, next),
    onSuccess: (order) => {
      toast.success(`${order.orderNumber} marked as ${order.status}.`)
      queryClient.invalidateQueries({ queryKey: ["orders"] })
      queryClient.invalidateQueries({ queryKey: ["admin-stats"] })
      setSelected(order)
    },
    onError: (err) => toast.error(err instanceof Error ? err.message : "Could not update order."),
  })

  const orders = data?.data ?? []
  const total = data?.total ?? 0
  const totalPages = data?.totalPages ?? 1

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Orders</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {total} order{total === 1 ? "" : "s"} placed
        </p>
      </div>

      <div className="flex flex-wrap items-end gap-3">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-muted-foreground">Search</label>
          <div className="relative">
            <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Order number, customer..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-9 w-64 pl-9"
            />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-muted-foreground">Status</label>
          <select
            value={status}
            onChange={(e) => {
              setStatus(e.target.value)
              setPage(1)
            }}
            className="h-9 rounded-lg border border-input bg-transparent px-3 text-sm capitalize outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            <option value="">All statuses</option>
            {ORDER_STATUSES.map((s) => (
              <option key={s} value={s} className="capitalize">
                {s}
              </option>
            ))}
          </select>
        </div>
      </div>

      {!isLoading && orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed py-20 text-center">
          <div className="flex size-14 items-center justify-center rounded-full bg-muted">
            <ShoppingBag className="size-6 text-muted-foreground" />
          </div>
          <p className="mt-4 font-medium">No orders found</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Orders placed on the storefront will appear here.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border">
          <div className="overflow-x-auto">
            <table className="w-full min-w-max text-sm">
              <thead>
                <tr className="border-b bg-muted/40 text-left text-xs text-muted-foreground">
                  <th className="px-4 py-2.5 font-medium">Order</th>
                  <th className="px-4 py-2.5 font-medium">Customer</th>
                  <th className="px-4 py-2.5 font-medium">Date</th>
                  <th className="px-4 py-2.5 font-medium">Payment</th>
                  <th className="px-4 py-2.5 font-medium">Status</th>
                  <th className="px-4 py-2.5 text-right font-medium">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {isLoading
                  ? Array.from({ length: 6 }).map((_, i) => (
                      <tr key={i}>
                        <td colSpan={6} className="px-4 py-3">
                          <Skeleton className="h-5 w-full" />
                        </td>
                      </tr>
                    ))
                  : orders.map((order) => (
                      <tr
                        key={order._id}
                        onClick={() => setSelected(order)}
                        className="cursor-pointer bg-background transition-colors hover:bg-muted/30"
                      >
                        <td className="px-4 py-3 font-medium">{order.orderNumber}</td>
                        <td className="px-4 py-3">
                          <p className="font-medium">{order.customer.name}</p>
                          <p className="text-xs text-muted-foreground">{order.customer.email}</p>
                        </td>
                        <td className="px-4 py-3 text-muted-foreground">
                          {format(new Date(order.createdAt), "d MMM yyyy")}
                        </td>
                        <td className="px-4 py-3">
                          <Badge
                            className={cn(
                              "rounded-full text-xs capitalize",
                              PAYMENT_STATUS_STYLES[order.paymentStatus]
                            )}
                          >
                            {order.paymentStatus}
                          </Badge>
                        </td>
                        <td className="px-4 py-3">
                          <Badge
                            className={cn(
                              "rounded-full text-xs capitalize",
                              ORDER_STATUS_STYLES[order.status]
                            )}
                          >
                            {order.status}
                          </Badge>
                        </td>
                        <td className="px-4 py-3 text-right font-medium">
                          {formatGHS(order.total)}
                        </td>
                      </tr>
                    ))}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-between border-t px-4 py-3">
              <p className="text-xs text-muted-foreground">
                Page {page} of {totalPages}
              </p>
              <div className="flex gap-1">
                <Button
                  variant="outline"
                  size="icon"
                  className="size-8"
                  disabled={page <= 1}
                  onClick={() => setPage((p) => p - 1)}
                >
                  <ChevronLeft className="size-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="size-8"
                  disabled={page >= totalPages}
                  onClick={() => setPage((p) => p + 1)}
                >
                  <ChevronRight className="size-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
      )}

      <Sheet open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <SheetContent
          key={selected?._id ?? "none"}
          side="right"
          className="flex w-full flex-col gap-0 overflow-y-auto p-0 sm:max-w-md"
        >
          <SheetTitle className="sr-only">Order details</SheetTitle>
          {selected && (
            <div className="flex flex-col gap-6 p-6">
              <div>
                <div className="flex items-center justify-between gap-3">
                  <h2 className="text-lg font-semibold">{selected.orderNumber}</h2>
                  <Badge
                    className={cn(
                      "rounded-full text-xs capitalize",
                      PAYMENT_STATUS_STYLES[selected.paymentStatus]
                    )}
                  >
                    {selected.paymentStatus}
                  </Badge>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">
                  {format(new Date(selected.createdAt), "d MMMM yyyy, HH:mm")}
                </p>
              </div>

              <div className="rounded-xl border p-4">
                <p className="text-xs font-medium text-muted-foreground">Customer</p>
                <p className="mt-1.5 font-medium">{selected.customer.name}</p>
                <p className="text-sm text-muted-foreground">{selected.customer.email}</p>
                <p className="text-sm text-muted-foreground">{selected.customer.phone}</p>
                <p className="mt-3 text-xs font-medium text-muted-foreground">Deliver to</p>
                <p className="mt-1 text-sm">{selected.deliveryAddress}</p>
              </div>

              <div>
                <p className="text-xs font-medium text-muted-foreground">
                  Items ({selected.items.length})
                </p>
                <div className="mt-2 flex flex-col divide-y rounded-xl border">
                  {selected.items.map((item) => (
                    <div key={item.product._id} className="flex items-center gap-3 p-3">
                      <div className="relative size-11 shrink-0 overflow-hidden rounded-lg bg-muted">
                        {item.product.imageUrls[0] ? (
                          <Image
                            src={item.product.imageUrls[0]}
                            alt={item.product.name}
                            fill
                            sizes="44px"
                            className="object-contain p-1"
                          />
                        ) : (
                          <div className="flex size-full items-center justify-center">
                            <Package className="size-4 text-muted-foreground/40" />
                          </div>
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium">{item.product.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {item.quantity} × {formatGHS(item.unitPrice)}
                        </p>
                      </div>
                      <p className="text-sm font-semibold">
                        {formatGHS(item.unitPrice * item.quantity)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <dl className="flex flex-col gap-2 text-sm">
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Subtotal</dt>
                  <dd>{formatGHS(selected.subtotal)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Delivery</dt>
                  <dd>{formatGHS(selected.total - selected.subtotal)}</dd>
                </div>
                <div className="flex justify-between border-t pt-2 text-base font-semibold">
                  <dt>Total</dt>
                  <dd>{formatGHS(selected.total)}</dd>
                </div>
              </dl>

              <div>
                <p className="text-xs font-medium text-muted-foreground">Update status</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {ORDER_STATUSES.map((s) => (
                    <Button
                      key={s}
                      size="sm"
                      variant={selected.status === s ? "default" : "outline"}
                      disabled={statusMutation.isPending || selected.status === s}
                      onClick={() => statusMutation.mutate({ id: selected._id, next: s })}
                      className="capitalize"
                    >
                      {s}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  )
}
