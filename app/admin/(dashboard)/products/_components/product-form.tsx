"use client"

import { useRef, useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, ImagePlus, Loader2, Plus, X } from "lucide-react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Field, FieldLabel, FieldError } from "@/components/ui/field"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { CategoryFormDialog } from "@/components/shared/category-form-dialog"
import { cn } from "@/lib/utils"
import { CategoryService } from "@/lib/api/categories"
import { ProductService, type ProductCreatePayload } from "@/lib/api/products"
import type { IProduct } from "@/interfaces"

const MAX_IMAGES = 6

interface ImageSlot {
  url: string
  file?: File
}

export function ProductForm({ initial }: { initial?: IProduct }) {
  const router = useRouter()
  const queryClient = useQueryClient()
  const isEdit = !!initial
  const fileInputRef = useRef<HTMLInputElement>(null)

  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: () => CategoryService.list(),
  })

  const [name, setName] = useState(initial?.name ?? "")
  const [description, setDescription] = useState(initial?.description ?? "")
  const [categoryId, setCategoryId] = useState(initial?.category._id ?? "")
  const [price, setPrice] = useState(initial ? String(initial.price) : "")
  const [comparePrice, setComparePrice] = useState(
    initial?.comparePrice ? String(initial.comparePrice) : ""
  )
  const [stock, setStock] = useState(initial ? String(initial.stock) : "0")
  const [weight, setWeight] = useState(initial?.weight ?? "")
  const [featured, setFeatured] = useState(initial?.featured ?? false)
  const [isPublished, setIsPublished] = useState(initial?.isPublished ?? true)
  const [images, setImages] = useState<ImageSlot[]>(
    initial?.imageUrls.map((url) => ({ url })) ?? []
  )
  const [createCategoryOpen, setCreateCategoryOpen] = useState(false)

  const [nameError, setNameError] = useState("")
  const [categoryError, setCategoryError] = useState("")
  const [priceError, setPriceError] = useState("")

  function addFiles(files: FileList | null) {
    if (!files) return
    const remaining = MAX_IMAGES - images.length
    const next = Array.from(files)
      .slice(0, remaining)
      .map((file) => ({ url: URL.createObjectURL(file), file }))
    setImages((prev) => [...prev, ...next])
  }

  function removeImage(index: number) {
    setImages((prev) => prev.filter((_, i) => i !== index))
  }

  const mutation = useMutation({
    mutationFn: async () => {
      const uploadedUrls = await Promise.all(
        images.map((img) => (img.file ? ProductService.uploadImage(img.file) : img.url))
      )
      const payload: ProductCreatePayload = {
        name: name.trim(),
        description: description.trim(),
        price: Number(price),
        comparePrice: comparePrice ? Number(comparePrice) : null,
        imageUrls: uploadedUrls,
        categoryId,
        stock: stock ? Number(stock) : 0,
        weight: weight.trim() || null,
        featured,
        isPublished,
      }
      return isEdit ? ProductService.update(initial._id, payload) : ProductService.create(payload)
    },
    onSuccess: (product) => {
      toast.success(isEdit ? "Product updated." : "Product created.")
      queryClient.invalidateQueries({ queryKey: ["products"] })
      queryClient.invalidateQueries({ queryKey: ["product", product._id] })
      router.push("/admin/products")
    },
    onError: (err) => {
      toast.error(err instanceof Error ? err.message : "Something went wrong. Try again.")
    },
  })

  function validate() {
    let valid = true
    if (!name.trim()) {
      setNameError("Product name is required.")
      valid = false
    } else {
      setNameError("")
    }
    if (!categoryId) {
      setCategoryError("Choose a category.")
      valid = false
    } else {
      setCategoryError("")
    }
    if (!price || Number(price) <= 0) {
      setPriceError("Enter a valid price.")
      valid = false
    } else {
      setPriceError("")
    }
    return valid
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validate()) return
    mutation.mutate()
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="size-8"
          nativeButton={false}
          render={<Link href="/admin/products" />}
        >
          <ArrowLeft className="size-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            {isEdit ? "Edit product" : "Add product"}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {isEdit ? "Update this product's details." : "Add a new product to your store."}
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="flex flex-col gap-4 lg:col-span-2">
          <Field data-invalid={!!nameError}>
            <FieldLabel>Product name</FieldLabel>
            <Input
              placeholder="e.g. Wireless Headphones"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <FieldError>{nameError}</FieldError>
          </Field>

          <Field>
            <FieldLabel>Description</FieldLabel>
            <Textarea
              placeholder="Describe this product..."
              rows={5}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </Field>

          <div className="grid grid-cols-2 gap-4">
            <Field data-invalid={!!priceError}>
              <FieldLabel>Price (GH₵)</FieldLabel>
              <Input
                type="number"
                min="0"
                step="0.01"
                placeholder="0.00"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
              <FieldError>{priceError}</FieldError>
            </Field>

            <Field>
              <FieldLabel>
                Compare-at price{" "}
                <span className="text-xs font-normal text-muted-foreground">(optional)</span>
              </FieldLabel>
              <Input
                type="number"
                min="0"
                step="0.01"
                placeholder="0.00"
                value={comparePrice}
                onChange={(e) => setComparePrice(e.target.value)}
              />
            </Field>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium">Images</label>
            <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
              {images.map((img, i) => (
                <div key={img.url} className="group relative aspect-square overflow-hidden rounded-lg border">
                  <Image src={img.url} alt="" fill className="object-cover" />
                  <button
                    type="button"
                    onClick={() => removeImage(i)}
                    className="absolute top-1 right-1 flex size-5 items-center justify-center rounded-full bg-black/60 text-white opacity-0 transition-opacity group-hover:opacity-100"
                  >
                    <X className="size-3" />
                  </button>
                </div>
              ))}
              {images.length < MAX_IMAGES && (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex aspect-square flex-col items-center justify-center gap-1 rounded-lg border border-dashed text-muted-foreground hover:border-ring hover:text-foreground"
                >
                  <ImagePlus className="size-5" />
                  <span className="text-xs">Add</span>
                </button>
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={(e) => {
                addFiles(e.target.files)
                e.target.value = ""
              }}
            />
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <Field data-invalid={!!categoryError}>
            <FieldLabel>Category</FieldLabel>
            <Select<string> value={categoryId} onValueChange={(v) => setCategoryId(v ?? "")}>
              <SelectTrigger>
                <SelectValue>
                  {categoryId ? (
                    (categories.find((c) => c._id === categoryId)?.name ?? categoryId)
                  ) : (
                    <span className="text-muted-foreground">Choose a category</span>
                  )}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat._id} value={cat._id} label={cat.name}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FieldError>{categoryError}</FieldError>
            <button
              type="button"
              onClick={() => setCreateCategoryOpen(true)}
              className="mt-1 flex w-fit items-center gap-1 text-xs font-medium text-primary hover:underline"
            >
              <Plus className="size-3" />
              New category
            </button>
          </Field>

          <Field>
            <FieldLabel>Stock quantity</FieldLabel>
            <Input
              type="number"
              min="0"
              placeholder="0"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
            />
          </Field>

          <Field>
            <FieldLabel>
              Pack size{" "}
              <span className="text-xs font-normal text-muted-foreground">(optional)</span>
            </FieldLabel>
            <Input
              placeholder="e.g. 1kg or 5g sachet"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
            />
          </Field>

          <label className="flex cursor-pointer items-center justify-between gap-3 rounded-xl border bg-muted/30 px-4 py-3">
            <div>
              <p className="text-sm font-medium">Published</p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                Visible on your storefront.
              </p>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={isPublished}
              onClick={() => setIsPublished((v) => !v)}
              className={cn(
                "relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors",
                isPublished ? "bg-primary" : "bg-muted-foreground/30"
              )}
            >
              <span
                className={cn(
                  "pointer-events-none inline-block size-5 rounded-full bg-white shadow-lg transition-transform",
                  isPublished ? "translate-x-5" : "translate-x-0"
                )}
              />
            </button>
          </label>

          <label className="flex cursor-pointer items-center justify-between gap-3 rounded-xl border bg-muted/30 px-4 py-3">
            <div>
              <p className="text-sm font-medium">Feature on homepage</p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                Show in the &ldquo;Best sellers&rdquo; row.
              </p>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={featured}
              onClick={() => setFeatured((v) => !v)}
              className={cn(
                "relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors",
                featured ? "bg-primary" : "bg-muted-foreground/30"
              )}
            >
              <span
                className={cn(
                  "pointer-events-none inline-block size-5 rounded-full bg-white shadow-lg transition-transform",
                  featured ? "translate-x-5" : "translate-x-0"
                )}
              />
            </button>
          </label>
        </div>
      </div>

      <div className="flex justify-end gap-2 border-t pt-4">
        <Button type="button" variant="outline" nativeButton={false} render={<Link href="/admin/products" />}>
          Cancel
        </Button>
        <Button type="submit" disabled={mutation.isPending} className="gap-2">
          {mutation.isPending && <Loader2 className="size-4 animate-spin" />}
          {isEdit ? "Save changes" : "Create product"}
        </Button>
      </div>

      <CategoryFormDialog
        open={createCategoryOpen}
        onOpenChange={setCreateCategoryOpen}
        onCreated={(cat) => setCategoryId(cat._id)}
      />
    </form>
  )
}
