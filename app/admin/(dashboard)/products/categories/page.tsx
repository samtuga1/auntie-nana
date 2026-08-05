"use client"

import { useState } from "react"
import { Edit2, LayoutList, Plus, Trash2, Loader2 } from "lucide-react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { CategoryService } from "@/lib/api/categories"
import { CategoryFormDialog } from "@/components/shared/category-form-dialog"
import type { IProductCategory } from "@/interfaces"

export default function CategoriesPage() {
  const queryClient = useQueryClient()

  const [addOpen, setAddOpen] = useState(false)
  const [editTarget, setEditTarget] = useState<IProductCategory | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<IProductCategory | null>(null)

  const { data: categories = [], isLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: () => CategoryService.list(),
  })

  const deleteMutation = useMutation({
    mutationFn: (cat: IProductCategory) => CategoryService.delete(cat._id),
    onSuccess: (_, cat) => {
      toast.success(`"${cat.name}" deleted.`)
      queryClient.invalidateQueries({ queryKey: ["categories"] })
      setDeleteTarget(null)
    },
    onError: (err) => {
      toast.error(err instanceof Error ? err.message : "Failed to delete category.")
      setDeleteTarget(null)
    },
  })

  return (
    <>
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Categories</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Organise your products into categories.
          </p>
        </div>
        <Button onClick={() => setAddOpen(true)} className="shrink-0 gap-2">
          <Plus className="size-4" />
          <span className="hidden sm:inline">Add Category</span>
          <span className="sm:hidden">Add</span>
        </Button>
      </div>

      {isLoading ? (
        <div className="mt-6 divide-y overflow-hidden rounded-xl border">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4 px-4 py-3.5">
              <Skeleton className="h-4 w-40" />
              <Skeleton className="ml-auto h-4 w-16" />
            </div>
          ))}
        </div>
      ) : categories.length === 0 ? (
        <div className="mt-6 flex flex-col items-center justify-center rounded-xl border border-dashed py-20 text-center">
          <div className="flex size-14 items-center justify-center rounded-full bg-muted">
            <LayoutList className="size-6 text-muted-foreground" />
          </div>
          <p className="mt-4 font-medium">No categories yet</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Create your first category to start organising products.
          </p>
          <Button onClick={() => setAddOpen(true)} className="mt-5 gap-2">
            <Plus className="size-4" />
            Add Category
          </Button>
        </div>
      ) : (
        <div className="mt-6 overflow-hidden rounded-xl border">
          {/* Desktop table */}
          <table className="hidden w-full text-sm sm:table">
            <thead>
              <tr className="border-b bg-muted/40 text-left text-xs text-muted-foreground">
                <th className="px-4 py-2.5 font-medium">Category</th>
                <th className="px-4 py-2.5" />
              </tr>
            </thead>
            <tbody className="divide-y">
              {categories.map((cat) => (
                <tr key={cat._id} className="bg-background">
                  <td className="px-4 py-3.5">
                    <p className="font-medium">{cat.name}</p>
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-8"
                        onClick={() => setEditTarget(cat)}
                      >
                        <Edit2 className="size-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-8 text-destructive hover:bg-destructive/10 hover:text-destructive"
                        onClick={() => setDeleteTarget(cat)}
                      >
                        <Trash2 className="size-3.5" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Mobile list */}
          <div className="divide-y sm:hidden">
            {categories.map((cat) => (
              <div key={cat._id} className="flex items-center gap-3 px-4 py-3.5">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted">
                  <LayoutList className="size-4 text-muted-foreground/60" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{cat.name}</p>
                </div>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-8"
                    onClick={() => setEditTarget(cat)}
                  >
                    <Edit2 className="size-3.5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-8 text-destructive hover:bg-destructive/10 hover:text-destructive"
                    onClick={() => setDeleteTarget(cat)}
                  >
                    <Trash2 className="size-3.5" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <CategoryFormDialog open={addOpen} onOpenChange={setAddOpen} />

      {editTarget && (
        <CategoryFormDialog
          key={editTarget._id}
          open={!!editTarget}
          onOpenChange={(o) => !o && setEditTarget(null)}
          initial={editTarget}
        />
      )}

      <Dialog open={!!deleteTarget} onOpenChange={(o) => !o && setDeleteTarget(null)}>
        <DialogContent showCloseButton={false}>
          <DialogHeader>
            <DialogTitle>Delete category?</DialogTitle>
            <DialogDescription>
              &ldquo;{deleteTarget?.name}&rdquo; will be permanently deleted. Products in this
              category will become uncategorised.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose render={<Button variant="outline" />}>Cancel</DialogClose>
            <Button
              variant="destructive"
              disabled={deleteMutation.isPending}
              onClick={() => deleteTarget && deleteMutation.mutate(deleteTarget)}
            >
              {deleteMutation.isPending ? <Loader2 className="size-4 animate-spin" /> : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
