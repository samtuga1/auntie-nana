"use client"

import Image from "next/image"
import Link from "next/link"
import { Package, Plus } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { useCartStore } from "@/stores/cart-store"
import { cn, formatGHS } from "@/lib/utils"
import type { IProduct } from "@/interfaces"

export function ProductCard({ product }: { product: IProduct }) {
  const add = useCartStore((s) => s.add)
  const outOfStock = product.stock === 0

  function handleAdd(e: React.MouseEvent) {
    e.preventDefault()
    add(product, 1)
    toast.success(`${product.name} added to cart`)
  }

  return (
    <Link
      href={`/products/${product.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-black/6 bg-white transition-all hover:-translate-y-0.5 hover:border-primary/25 hover:shadow-lg"
    >
      <div className="relative aspect-square overflow-hidden bg-[#f4f7ef]">
        {product.imageUrls[0] ? (
          <Image
            src={product.imageUrls[0]}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 50vw, 25vw"
            className="object-contain p-4 transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex size-full items-center justify-center">
            <Package className="size-10 text-muted-foreground/30" />
          </div>
        )}

        {product.comparePrice && product.comparePrice > product.price && (
          <span className="absolute top-3 left-3 rounded-full bg-[#f5c518] px-2.5 py-1 text-[11px] font-bold text-[#02570e]">
            Save {formatGHS(product.comparePrice - product.price)}
          </span>
        )}
        {outOfStock && (
          <span className="absolute top-3 right-3 rounded-full bg-black/70 px-2.5 py-1 text-[11px] font-semibold text-white">
            Out of stock
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-4">
        <p className="text-[11px] font-semibold tracking-wide text-primary/70 uppercase">
          {product.category.name}
        </p>
        <h3 className="mt-1 line-clamp-2 text-sm font-semibold text-foreground">{product.name}</h3>
        {product.weight && (
          <p className="mt-0.5 text-xs text-muted-foreground">{product.weight}</p>
        )}

        <div className="mt-auto flex items-end justify-between gap-2 pt-3">
          <div>
            <span className="text-base font-bold text-foreground">{formatGHS(product.price)}</span>
            {product.comparePrice && product.comparePrice > product.price && (
              <span className="ml-1.5 text-xs text-muted-foreground line-through">
                {formatGHS(product.comparePrice)}
              </span>
            )}
          </div>
          <Button
            size="icon-sm"
            aria-label={`Add ${product.name} to cart`}
            disabled={outOfStock}
            onClick={handleAdd}
            className={cn("shrink-0 rounded-full", outOfStock && "opacity-40")}
          >
            <Plus className="size-4" />
          </Button>
        </div>
      </div>
    </Link>
  )
}

export function ProductCardSkeleton() {
  return (
    <div className="flex flex-col overflow-hidden rounded-2xl border border-black/6 bg-white">
      <div className="aspect-square animate-pulse bg-muted" />
      <div className="flex flex-col gap-2 p-4">
        <div className="h-3 w-16 animate-pulse rounded bg-muted" />
        <div className="h-4 w-full animate-pulse rounded bg-muted" />
        <div className="h-4 w-20 animate-pulse rounded bg-muted" />
      </div>
    </div>
  )
}
