"use client"

import { useState } from "react"
import { Loader2 } from "lucide-react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Field, FieldLabel } from "@/components/ui/field"
import { Dialog, DialogClose, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { CategoryService } from "@/lib/api/categories"
import type { IProductCategory } from "@/interfaces"

export function CategoryFormDialog({
  open,
  onOpenChange,
  initial,
  onCreated,
}: {
  open: boolean
  onOpenChange: (o: boolean) => void
  initial?: IProductCategory
  onCreated?: (category: IProductCategory) => void
}) {
  const queryClient = useQueryClient()
  const isEdit = !!initial
  const [name, setName] = useState(initial?.name ?? "")

  function reset() {
    setName(initial?.name ?? "")
  }

  function handleOpenChange(o: boolean) {
    onOpenChange(o)
    if (!o) reset()
  }

  function onSuccess(saved: IProductCategory) {
    toast.success(isEdit ? `"${saved.name}" updated.` : `"${saved.name}" category added.`)
    queryClient.invalidateQueries({ queryKey: ["categories"] })
    handleOpenChange(false)
    if (!isEdit) onCreated?.(saved)
  }

  function onError(err: unknown) {
    toast.error(err instanceof Error ? err.message : "Something went wrong. Try again.")
  }

  const createMutation = useMutation({
    mutationFn: () => CategoryService.create({ name: name.trim() }),
    onSuccess,
    onError,
  })

  const updateMutation = useMutation({
    mutationFn: () => CategoryService.update(initial!._id, { name: name.trim() }),
    onSuccess,
    onError,
  })

  const isPending = createMutation.isPending || updateMutation.isPending

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim()) return
    if (isEdit) {
      updateMutation.mutate()
    } else {
      createMutation.mutate()
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit Category" : "Add Category"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Field>
            <FieldLabel>Name</FieldLabel>
            <Input
              placeholder="e.g. Electronics"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </Field>

          <div className="flex gap-2 pt-1">
            <DialogClose render={<Button variant="outline" className="flex-1" />}>
              Cancel
            </DialogClose>
            <Button type="submit" disabled={isPending || !name.trim()} className="flex-1">
              {isPending ? (
                <Loader2 className="size-4 animate-spin" />
              ) : isEdit ? (
                "Save changes"
              ) : (
                "Create category"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
