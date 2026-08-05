"use client"

import { useParams } from "next/navigation"
import { useQuery } from "@tanstack/react-query"
import { Skeleton } from "@/components/ui/skeleton"
import { ProductService } from "@/lib/api/products"
import { ProductForm } from "../../_components/product-form"

export default function EditProductPage() {
  const params = useParams<{ id: string }>()

  const { data: product, isLoading } = useQuery({
    queryKey: ["product", params.id],
    queryFn: () => ProductService.fetchOne(params.id),
  })

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-96 w-full" />
      </div>
    )
  }

  if (!product) return null

  return <ProductForm initial={product} />
}
