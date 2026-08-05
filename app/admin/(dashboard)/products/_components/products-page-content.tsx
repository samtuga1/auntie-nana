"use client"

import Link from "next/link"
import { Plus, Search, Settings2 } from "lucide-react"
import { useState, useEffect } from "react"
import { useQuery } from "@tanstack/react-query"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet"
import { ProductsTable } from "./products-table"
import { ProductDetail } from "./product-detail"
import { ProductService } from "@/lib/api/products"
import { CategoryService } from "@/lib/api/categories"
import type { IProduct } from "@/interfaces"

const PAGE_SIZE = 10

export function ProductsPageContent() {
  const [search, setSearch] = useState("")
  const [debouncedSearch, setDebouncedSearch] = useState("")
  const [categoryId, setCategoryId] = useState("")
  const [page, setPage] = useState(1)
  const [selected, setSelected] = useState<IProduct | null>(null)

  useEffect(() => {
    const t = setTimeout(() => {
      setDebouncedSearch(search)
      setPage(1)
    }, 300)
    return () => clearTimeout(t)
  }, [search])

  const { data: productsData, isLoading } = useQuery({
    queryKey: ["products", debouncedSearch, categoryId, page],
    queryFn: () =>
      ProductService.fetchAll({
        search: debouncedSearch || undefined,
        categoryId: categoryId || undefined,
        page,
        limit: PAGE_SIZE,
      }),
    placeholderData: (prev) => prev,
  })

  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: () => CategoryService.list(),
  })

  const products = productsData?.data ?? []
  const total = productsData?.total ?? 0

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Products</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {total} product{total !== 1 ? "s" : ""} in your store
          </p>
        </div>
        <div className="flex shrink-0 gap-2">
          <Button
            variant="outline"
            nativeButton={false}
            render={<Link href="/admin/products/categories" />}
          >
            <Settings2 className="size-4" />
            <span className="hidden sm:inline">Categories</span>
          </Button>
          <Button nativeButton={false} render={<Link href="/admin/products/new" />} className="gap-2">
            <Plus className="size-4" />
            <span className="hidden sm:inline">Add Product</span>
            <span className="sm:hidden">Add</span>
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap items-end gap-3">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-muted-foreground">Search</label>
          <div className="relative">
            <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-9 w-56 pl-9"
            />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-muted-foreground">Category</label>
          <Select<string>
            value={categoryId}
            onValueChange={(v) => {
              setCategoryId(v ?? "")
              setPage(1)
            }}
          >
            <SelectTrigger className="w-48">
              <SelectValue>
                {categoryId ? (
                  (categories.find((c) => c._id === categoryId)?.name ?? categoryId)
                ) : (
                  <span className="text-muted-foreground">All categories</span>
                )}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="" label="All">
                All
              </SelectItem>
              {categories.map((cat) => (
                <SelectItem key={cat._id} value={cat._id} label={cat.name}>
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <ProductsTable
        products={products}
        total={total}
        page={page}
        pageSize={PAGE_SIZE}
        onPageChange={setPage}
        isLoading={isLoading}
        onSelect={setSelected}
      />

      <Sheet open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <SheetContent side="right" className="flex w-full flex-col gap-0 p-0 sm:max-w-md">
          <SheetTitle className="sr-only">Product details</SheetTitle>
          {selected && (
            <ProductDetail
              key={selected._id}
              product={selected}
              onDeleted={() => setSelected(null)}
            />
          )}
        </SheetContent>
      </Sheet>
    </div>
  )
}
