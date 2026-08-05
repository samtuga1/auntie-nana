"use client"

import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { useQuery } from "@tanstack/react-query"
import { CategoryService } from "@/lib/api/categories"
import { ProductService } from "@/lib/api/products"
import { CATEGORY_BLURBS } from "@/lib/mock/data"

export function CategoryRail() {
  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: () => CategoryService.list(),
  })

  const { data: productsData } = useQuery({
    queryKey: ["storefront-all-products"],
    queryFn: () => ProductService.fetchAll({ isPublished: true, limit: 200 }),
  })

  const products = productsData?.data ?? []

  return (
    <section className="bg-[#f7faf2]">
      <div className="mx-auto w-full max-w-6xl px-5 py-16 md:px-8 md:py-24">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold tracking-[0.18em] text-primary uppercase">
            Our range
          </p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">
            Three ranges, one standard
          </h2>
          <p className="mt-3 text-muted-foreground">
            Every product is made from locally sourced ingredients, processed hygienically and FDA
            approved — whether it&apos;s a 5g sachet or a 1kg pack.
          </p>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {categories.map((category) => {
            const items = products.filter((p) => p.category._id === category._id)
            const preview = items.slice(0, 3)
            return (
              <Link
                key={category._id}
                href={`/products?category=${category._id}`}
                className="group flex flex-col rounded-3xl border border-black/6 bg-white p-6 transition-all hover:-translate-y-1 hover:border-primary/25 hover:shadow-xl"
              >
                <div className="flex h-28 items-end justify-center gap-1">
                  {preview.map((p, i) => (
                    <div
                      key={p._id}
                      className="relative size-24 transition-transform duration-300 group-hover:-translate-y-1"
                      style={{ transform: `rotate(${(i - 1) * 7}deg)`, zIndex: i === 1 ? 2 : 1 }}
                    >
                      <Image
                        src={p.imageUrls[0]}
                        alt={p.name}
                        fill
                        sizes="96px"
                        className="object-contain"
                      />
                    </div>
                  ))}
                </div>

                <h3 className="mt-6 text-lg font-bold tracking-tight">{category.name}</h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                  {CATEGORY_BLURBS[category._id] ??
                    `Explore our ${category.name.toLowerCase()} range.`}
                </p>
                <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
                  Shop {items.length} product{items.length === 1 ? "" : "s"}
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                </span>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
