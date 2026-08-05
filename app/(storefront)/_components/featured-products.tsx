"use client"

import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { useQuery } from "@tanstack/react-query"
import { Button } from "@/components/ui/button"
import { ProductCard, ProductCardSkeleton } from "@/components/storefront/product-card"
import { ProductService } from "@/lib/api/products"

export function FeaturedProducts() {
  const { data, isLoading } = useQuery({
    queryKey: ["storefront-featured"],
    queryFn: () => ProductService.fetchAll({ isPublished: true, limit: 100 }),
  })

  const featured = (data?.data ?? []).filter((p) => p.featured).slice(0, 8)
  const products = featured.length > 0 ? featured : (data?.data ?? []).slice(0, 8)

  return (
    <section className="mx-auto w-full max-w-6xl px-5 py-16 md:px-8 md:py-24">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold tracking-[0.18em] text-primary uppercase">
            Best sellers
          </p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">
            What Ghana is cooking
          </h2>
          <p className="mt-2 max-w-lg text-muted-foreground">
            The products our customers reorder most — from everyday seasoning to breakfast in two
            minutes.
          </p>
        </div>
        <Button
          variant="outline"
          nativeButton={false}
          render={<Link href="/products" />}
          className="gap-2"
        >
          View all products
          <ArrowRight className="size-4" />
        </Button>
      </div>

      <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-5">
        {isLoading
          ? Array.from({ length: 8 }).map((_, i) => <ProductCardSkeleton key={i} />)
          : products.map((product) => <ProductCard key={product._id} product={product} />)}
      </div>
    </section>
  )
}
