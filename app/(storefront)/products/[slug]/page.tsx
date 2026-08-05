"use client"

import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import { useParams } from "next/navigation"
import {
  ArrowLeft,
  BadgeCheck,
  Check,
  Leaf,
  Minus,
  Package,
  Plus,
  ShoppingBag,
  Timer,
} from "lucide-react"
import { useQuery } from "@tanstack/react-query"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { ProductCard } from "@/components/storefront/product-card"
import { ProductService } from "@/lib/api/products"
import { useCartStore } from "@/stores/cart-store"
import { formatGHS } from "@/lib/utils"

const ASSURANCES = [
  { icon: BadgeCheck, label: "FDA approved" },
  { icon: Leaf, label: "Locally sourced, no additives" },
  { icon: Timer, label: "Ready in minutes" },
]

export default function ProductDetailPage() {
  const params = useParams<{ slug: string }>()
  const add = useCartStore((s) => s.add)
  const [quantity, setQuantity] = useState(1)

  const { data: product, isLoading } = useQuery({
    queryKey: ["storefront-product", params.slug],
    queryFn: () => ProductService.fetchOne(params.slug),
  })

  const { data: related } = useQuery({
    queryKey: ["storefront-related", product?.category._id],
    queryFn: () =>
      ProductService.fetchAll({ isPublished: true, categoryId: product!.category._id, limit: 8 }),
    enabled: !!product,
  })

  if (isLoading) {
    return (
      <div className="mx-auto grid w-full max-w-6xl gap-10 px-5 py-12 md:grid-cols-2 md:px-8">
        <Skeleton className="aspect-square rounded-3xl" />
        <div className="flex flex-col gap-4">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-9 w-3/4" />
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="mx-auto flex w-full max-w-6xl flex-col items-center px-5 py-24 text-center">
        <Package className="size-10 text-muted-foreground/40" />
        <h1 className="mt-4 text-xl font-semibold">We couldn&apos;t find that product</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          It may have been removed or renamed.
        </p>
        <Button nativeButton={false} render={<Link href="/products" />} className="mt-6">
          Back to shop
        </Button>
      </div>
    )
  }

  const outOfStock = product.stock === 0
  const saving =
    product.comparePrice && product.comparePrice > product.price
      ? product.comparePrice - product.price
      : null

  const relatedProducts = (related?.data ?? []).filter((p) => p._id !== product._id).slice(0, 4)

  function handleAdd() {
    add(product!, quantity)
    toast.success(`${quantity} × ${product!.name} added to cart`)
  }

  return (
    <>
      <div className="mx-auto w-full max-w-6xl px-5 pt-6 md:px-8">
        <Link
          href="/products"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          Back to shop
        </Link>
      </div>

      <section className="mx-auto grid w-full max-w-6xl gap-10 px-5 py-8 md:grid-cols-2 md:gap-14 md:px-8 md:py-12">
        <div className="relative aspect-square overflow-hidden rounded-3xl bg-[#f4f7ef]">
          {product.imageUrls[0] ? (
            <Image
              src={product.imageUrls[0]}
              alt={product.name}
              fill
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-contain p-8"
            />
          ) : (
            <div className="flex size-full items-center justify-center">
              <Package className="size-14 text-muted-foreground/30" />
            </div>
          )}
          {saving && (
            <span className="absolute top-5 left-5 rounded-full bg-[#f5c518] px-3 py-1.5 text-xs font-bold text-[#02570e]">
              Save {formatGHS(saving)}
            </span>
          )}
        </div>

        <div className="flex flex-col">
          <Link
            href={`/products?category=${product.category._id}`}
            className="text-xs font-semibold tracking-[0.16em] text-primary uppercase hover:underline"
          >
            {product.category.name}
          </Link>

          <h1 className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">{product.name}</h1>

          {product.weight && (
            <p className="mt-1.5 text-sm text-muted-foreground">Pack size: {product.weight}</p>
          )}

          <div className="mt-5 flex items-end gap-3">
            <span className="text-3xl font-bold">{formatGHS(product.price)}</span>
            {product.comparePrice && product.comparePrice > product.price && (
              <span className="pb-1 text-base text-muted-foreground line-through">
                {formatGHS(product.comparePrice)}
              </span>
            )}
          </div>

          <p className="mt-5 leading-relaxed text-muted-foreground">{product.description}</p>

          <div className="mt-6 flex flex-col gap-2.5">
            {ASSURANCES.map((a) => (
              <div key={a.label} className="flex items-center gap-2.5 text-sm text-foreground/80">
                <a.icon className="size-4 shrink-0 text-primary" />
                {a.label}
              </div>
            ))}
          </div>

          <div className="mt-7 flex items-center gap-3">
            <div className="flex items-center rounded-lg border border-input">
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                disabled={quantity <= 1}
                aria-label="Decrease quantity"
                className="flex size-11 items-center justify-center text-muted-foreground hover:text-foreground disabled:opacity-30"
              >
                <Minus className="size-4" />
              </button>
              <span className="w-10 text-center text-sm font-semibold">{quantity}</span>
              <button
                type="button"
                onClick={() => setQuantity((q) => q + 1)}
                aria-label="Increase quantity"
                className="flex size-11 items-center justify-center text-muted-foreground hover:text-foreground"
              >
                <Plus className="size-4" />
              </button>
            </div>

            <Button
              size="lg"
              disabled={outOfStock}
              onClick={handleAdd}
              className="h-11 flex-1 gap-2"
            >
              <ShoppingBag className="size-4" />
              {outOfStock ? "Out of stock" : "Add to cart"}
            </Button>
          </div>

          <div className="mt-5 flex items-center gap-2 text-sm">
            {outOfStock ? (
              <span className="text-destructive">Currently unavailable</span>
            ) : (
              <>
                <Check className="size-4 text-primary" />
                <span className="text-muted-foreground">
                  In stock — {product.stock} packs available
                </span>
              </>
            )}
          </div>
        </div>
      </section>

      {relatedProducts.length > 0 && (
        <section className="bg-[#f7faf2]">
          <div className="mx-auto w-full max-w-6xl px-5 py-14 md:px-8 md:py-20">
            <h2 className="text-2xl font-bold tracking-tight">
              More from {product.category.name}
            </h2>
            <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-5">
              {relatedProducts.map((p) => (
                <ProductCard key={p._id} product={p} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  )
}
