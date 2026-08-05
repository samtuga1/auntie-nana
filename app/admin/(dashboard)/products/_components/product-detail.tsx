"use client"

import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import { ChevronLeft, ChevronRight, Edit2, Loader2, Package, Trash2 } from "lucide-react"
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
import type { IProduct } from "@/interfaces"
import { ProductService } from "@/lib/api/products"

function formatPrice(price: number) {
  return `GH₵ ${price.toFixed(2)}`
}

export function ProductDetail({
  product,
  onDeleted,
}: {
  product: IProduct
  onDeleted?: () => void
}) {
  const queryClient = useQueryClient()
  const [confirmAction, setConfirmAction] = useState<"publish" | "delete" | null>(null)
  const [imageIndex, setImageIndex] = useState(0)

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
      onDeleted?.()
    },
    onError: (err) => {
      toast.error(err instanceof Error ? err.message : "Failed to delete product.")
      setConfirmAction(null)
    },
  })

  const images = product.imageUrls
  const hasImages = images.length > 0

  return (
    <>
      <div className="shrink-0">
        <div className="relative aspect-4/2 w-full bg-muted">
          {!hasImages ? (
            <div className="flex size-full items-center justify-center">
              <Package className="size-12 text-muted-foreground/30" />
            </div>
          ) : (
            <Image
              src={images[imageIndex]}
              alt={product.name}
              fill
              className="object-cover"
              priority
            />
          )}

          {images.length > 1 && (
            <>
              <button
                onClick={() => setImageIndex((i) => Math.max(0, i - 1))}
                disabled={imageIndex === 0}
                className="absolute top-1/2 left-2 z-10 flex size-7 -translate-y-1/2 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm disabled:opacity-20"
              >
                <ChevronLeft className="size-4" />
              </button>
              <button
                onClick={() => setImageIndex((i) => Math.min(images.length - 1, i + 1))}
                disabled={imageIndex === images.length - 1}
                className="absolute top-1/2 right-2 z-10 flex size-7 -translate-y-1/2 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm disabled:opacity-20"
              >
                <ChevronRight className="size-4" />
              </button>
            </>
          )}
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-5 overflow-y-auto p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold">{product.name}</h2>
            <p className="mt-1 text-sm text-muted-foreground">{product.category.name}</p>
          </div>
          <Badge
            className={
              product.isPublished
                ? "rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                : "rounded-full bg-muted text-muted-foreground"
            }
          >
            {product.isPublished ? "Published" : "Draft"}
          </Badge>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-xl border p-3">
            <p className="text-xs text-muted-foreground">Price</p>
            <p className="mt-1 text-sm font-semibold">{formatPrice(product.price)}</p>
          </div>
          <div className="rounded-xl border p-3">
            <p className="text-xs text-muted-foreground">Stock</p>
            <p className="mt-1 text-sm font-semibold">
              {product.stock === 0 ? "Out of stock" : `${product.stock} units`}
            </p>
          </div>
        </div>

        {product.description && (
          <div>
            <p className="text-xs font-medium text-muted-foreground">Description</p>
            <p className="mt-1 text-sm">{product.description}</p>
          </div>
        )}

        <div className="mt-auto flex gap-2 border-t pt-4">
          <Button
            variant="outline"
            className="flex-1 gap-2"
            nativeButton={false}
            render={<Link href={`/admin/products/${product._id}/edit`} />}
          >
            <Edit2 className="size-3.5" />
            Edit
          </Button>
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => setConfirmAction("publish")}
          >
            {product.isPublished ? "Unpublish" : "Publish"}
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="text-destructive hover:bg-destructive/10 hover:text-destructive"
            onClick={() => setConfirmAction("delete")}
          >
            <Trash2 className="size-4" />
          </Button>
        </div>
      </div>

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
