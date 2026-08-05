"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Search, SlidersHorizontal } from "lucide-react"
import { useQuery } from "@tanstack/react-query"
import { Input } from "@/components/ui/input"
import { ProductCard, ProductCardSkeleton } from "@/components/storefront/product-card"
import { CategoryService } from "@/lib/api/categories"
import { ProductService } from "@/lib/api/products"
import { cn } from "@/lib/utils"

type SortKey = "featured" | "price-asc" | "price-desc" | "name"

const SORTS: { key: SortKey; label: string }[] = [
  { key: "featured", label: "Featured" },
  { key: "price-asc", label: "Price: low to high" },
  { key: "price-desc", label: "Price: high to low" },
  { key: "name", label: "Name A–Z" },
]

export function ShopPageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const initialCategory = searchParams.get("category") ?? ""

  const [categoryId, setCategoryId] = useState(initialCategory)
  const [search, setSearch] = useState("")
  const [debounced, setDebounced] = useState("")
  const [sort, setSort] = useState<SortKey>("featured")

  useEffect(() => {
    setCategoryId(initialCategory)
  }, [initialCategory])

  useEffect(() => {
    const t = setTimeout(() => setDebounced(search), 250)
    return () => clearTimeout(t)
  }, [search])

  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: () => CategoryService.list(),
  })

  const { data, isLoading } = useQuery({
    queryKey: ["storefront-products", categoryId, debounced],
    queryFn: () =>
      ProductService.fetchAll({
        isPublished: true,
        categoryId: categoryId || undefined,
        search: debounced || undefined,
        limit: 200,
      }),
    placeholderData: (prev) => prev,
  })

  const products = [...(data?.data ?? [])].sort((a, b) => {
    if (sort === "price-asc") return a.price - b.price
    if (sort === "price-desc") return b.price - a.price
    if (sort === "name") return a.name.localeCompare(b.name)
    return Number(b.featured ?? false) - Number(a.featured ?? false)
  })

  function selectCategory(id: string) {
    setCategoryId(id)
    router.replace(id ? `/products?category=${id}` : "/products", { scroll: false })
  }

  const activeCategory = categories.find((c) => c._id === categoryId)

  return (
    <>
      <section className="border-b border-black/5 bg-[#f7faf2]">
        <div className="mx-auto w-full max-w-6xl px-5 py-12 md:px-8 md:py-16">
          <p className="text-xs font-semibold tracking-[0.18em] text-primary uppercase">Shop</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">
            {activeCategory ? activeCategory.name : "The full range"}
          </h1>
          <p className="mt-3 max-w-xl text-muted-foreground">
            Locally sourced, FDA approved and ready in minutes. Delivered across Accra and beyond.
          </p>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-5 py-8 md:px-8 md:py-10">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => selectCategory("")}
              className={cn(
                "rounded-full border px-4 py-2 text-sm font-medium transition-colors",
                !categoryId
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-black/10 bg-white text-foreground/70 hover:border-primary/30 hover:text-foreground"
              )}
            >
              All products
            </button>
            {categories.map((c) => (
              <button
                key={c._id}
                type="button"
                onClick={() => selectCategory(c._id)}
                className={cn(
                  "rounded-full border px-4 py-2 text-sm font-medium transition-colors",
                  categoryId === c._id
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-black/10 bg-white text-foreground/70 hover:border-primary/30 hover:text-foreground"
                )}
              >
                {c.name}
              </button>
            ))}
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative">
              <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search products..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-10 w-full pl-9 sm:w-56"
              />
            </div>
            <div className="relative">
              <SlidersHorizontal className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as SortKey)}
                aria-label="Sort products"
                className="h-10 w-full appearance-none rounded-lg border border-input bg-white pr-8 pl-9 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 sm:w-52"
              >
                {SORTS.map((s) => (
                  <option key={s.key} value={s.key}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <p className="mt-6 text-sm text-muted-foreground">
          {isLoading ? "Loading products…" : `${products.length} product${products.length === 1 ? "" : "s"}`}
        </p>

        {!isLoading && products.length === 0 ? (
          <div className="mt-6 flex flex-col items-center justify-center rounded-2xl border border-dashed py-20 text-center">
            <p className="font-medium">Nothing matches that search</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Try a different word, or browse the full range.
            </p>
          </div>
        ) : (
          <div className="mt-5 grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-5">
            {isLoading
              ? Array.from({ length: 8 }).map((_, i) => <ProductCardSkeleton key={i} />)
              : products.map((p) => <ProductCard key={p._id} product={p} />)}
          </div>
        )}
      </section>
    </>
  )
}
