"use client"

import Image from "next/image"
import Link from "next/link"
import {
  ChevronLeft,
  ChevronRight,
  Edit2,
  Eye,
  EyeOff,
  Loader2,
  MoreHorizontal,
  Package,
  Trash2,
} from "lucide-react"
import { useState } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"
import type { IProduct } from "@/interfaces"
import { ProductService } from "@/lib/api/products"

function formatPrice(price: number) {
  return `GH₵ ${price.toFixed(2)}`
}

function StockLabel({ stock }: { stock: number }) {
  const isOut = stock === 0
  return (
    <span className={cn(isOut && "font-medium text-destructive")}>
      {isOut ? "Out of stock" : `${stock} in stock`}
    </span>
  )
}

function ProductRow({
  product,
  onSelect,
}: {
  product: IProduct
  onSelect: (product: IProduct) => void
}) {
  const queryClient = useQueryClient()
  const [confirmAction, setConfirmAction] = useState<"publish" | "delete" | null>(null)

  const publishMutation = useMutation({
    mutationFn: () => ProductService.update(product._id, { isPublished: !product.isPublished }),
    onSuccess: () => {
      toast.success(product.isPublished ? "Product unpublished." : "Product published.")
      queryClient.invalidateQueries({ queryKey: ["products"] })
      setConfirmAction(null)
    },
    onError: (err) => {
      toast.error(err instanceof Error ? err.message : "Failed to update product.")
      setConfirmAction(null)
    },
  })

  const deleteMutation = useMutation({
    mutationFn: () => ProductService.delete(product._id),
    onSuccess: () => {
      toast.success(`"${product.name}" deleted.`)
      queryClient.invalidateQueries({ queryKey: ["products"] })
      setConfirmAction(null)
    },
    onError: (err) => {
      toast.error(err instanceof Error ? err.message : "Failed to delete product.")
      setConfirmAction(null)
    },
  })

  return (
    <>
      <tr
        className="cursor-pointer bg-background transition-colors hover:bg-muted/30"
        onClick={() => onSelect(product)}
      >
        <td className="px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="size-9 shrink-0 overflow-hidden rounded-lg bg-muted">
              {product.imageUrls[0] ? (
                <Image
                  src={product.imageUrls[0]}
                  alt={product.name}
                  width={36}
                  height={36}
                  className="size-full object-cover"
                />
              ) : (
                <div className="flex size-full items-center justify-center">
                  <Package className="size-3.5 text-muted-foreground/40" />
                </div>
              )}
            </div>
            <span className="text-sm font-medium">{product.name}</span>
          </div>
        </td>
        <td className="px-4 py-3">
          <span className="inline-block rounded-full bg-violet-100 px-2.5 py-0.5 text-xs font-medium text-violet-700 dark:bg-violet-900/30 dark:text-violet-400">
            {product.category.name}
          </span>
        </td>
        <td className="px-4 py-3 text-sm font-medium">{formatPrice(product.price)}</td>
        <td className="px-4 py-3 text-sm">
          <StockLabel stock={product.stock} />
        </td>
        <td className="px-4 py-3">
          <Badge
            className={cn(
              "rounded-full text-xs",
              product.isPublished
                ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                : "bg-muted text-muted-foreground"
            )}
          >
            {product.isPublished ? "Published" : "Draft"}
          </Badge>
        </td>
        <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
          <DropdownMenu>
            <DropdownMenuTrigger render={<Button variant="ghost" size="icon" className="size-8" />}>
              <MoreHorizontal className="size-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              <DropdownMenuItem render={<Link href={`/admin/products/${product._id}/edit`} />}>
                <Edit2 className="size-3.5" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setConfirmAction("publish")}>
                {product.isPublished ? (
                  <EyeOff className="size-3.5" />
                ) : (
                  <Eye className="size-3.5" />
                )}
                {product.isPublished ? "Unpublish" : "Publish"}
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-destructive"
                onClick={() => setConfirmAction("delete")}
              >
                <Trash2 className="size-3.5" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </td>
      </tr>

      <Dialog open={!!confirmAction} onOpenChange={(o) => !o && setConfirmAction(null)}>
        <DialogContent showCloseButton={false}>
          <DialogHeader>
            <DialogTitle>
              {confirmAction === "delete"
                ? "Delete product?"
                : product.isPublished
                  ? "Unpublish product?"
                  : "Publish product?"}
            </DialogTitle>
            <DialogDescription>
              {confirmAction === "delete"
                ? `"${product.name}" will be permanently deleted.`
                : product.isPublished
                  ? `"${product.name}" will be hidden from your storefront.`
                  : `"${product.name}" will become visible on your storefront.`}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose render={<Button variant="outline" />}>Cancel</DialogClose>
            <Button
              variant={confirmAction === "delete" ? "destructive" : "default"}
              disabled={publishMutation.isPending || deleteMutation.isPending}
              onClick={() =>
                confirmAction === "delete" ? deleteMutation.mutate() : publishMutation.mutate()
              }
            >
              {publishMutation.isPending || deleteMutation.isPending ? (
                <Loader2 className="size-4 animate-spin" />
              ) : confirmAction === "delete" ? (
                "Delete"
              ) : (
                "Confirm"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

function TableSkeletonRow() {
  return (
    <tr className="bg-background">
      <td className="px-4 py-3">
        <div className="flex items-center gap-3">
          <Skeleton className="size-9 rounded-lg" />
          <Skeleton className="h-4 w-32" />
        </div>
      </td>
      <td className="px-4 py-3">
        <Skeleton className="h-5 w-16 rounded-full" />
      </td>
      <td className="px-4 py-3">
        <Skeleton className="h-4 w-16" />
      </td>
      <td className="px-4 py-3">
        <Skeleton className="h-4 w-20" />
      </td>
      <td className="px-4 py-3">
        <Skeleton className="h-5 w-16 rounded-full" />
      </td>
      <td className="px-4 py-3" />
    </tr>
  )
}

export function ProductsTable({
  products,
  total,
  page,
  pageSize,
  onPageChange,
  isLoading,
  onSelect,
}: {
  products: IProduct[]
  total: number
  page: number
  pageSize: number
  onPageChange: (page: number) => void
  isLoading: boolean
  onSelect: (product: IProduct) => void
}) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize))

  if (!isLoading && products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed py-20 text-center">
        <div className="flex size-14 items-center justify-center rounded-full bg-muted">
          <Package className="size-6 text-muted-foreground" />
        </div>
        <p className="mt-4 font-medium">No products yet</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Add your first product to start selling.
        </p>
        <Button nativeButton={false} render={<Link href="/admin/products/new" />} className="mt-5 gap-2">
          Add Product
        </Button>
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-xl border">
      <div className="overflow-x-auto">
        <table className="w-full min-w-max text-sm">
          <thead>
            <tr className="border-b bg-muted/40 text-left text-xs text-muted-foreground">
              <th className="px-4 py-2.5 font-medium">Product</th>
              <th className="px-4 py-2.5 font-medium">Category</th>
              <th className="px-4 py-2.5 font-medium">Price</th>
              <th className="px-4 py-2.5 font-medium">Stock</th>
              <th className="px-4 py-2.5 font-medium">Status</th>
              <th className="px-4 py-2.5" />
            </tr>
          </thead>
          <tbody className="divide-y">
            {isLoading
              ? Array.from({ length: 5 }).map((_, i) => <TableSkeletonRow key={i} />)
              : products.map((product) => (
                  <ProductRow key={product._id} product={product} onSelect={onSelect} />
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
              onClick={() => onPageChange(page - 1)}
            >
              <ChevronLeft className="size-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="size-8"
              disabled={page >= totalPages}
              onClick={() => onPageChange(page + 1)}
            >
              <ChevronRight className="size-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
