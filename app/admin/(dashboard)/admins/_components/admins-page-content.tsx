"use client"

import { useState } from "react"
import { Loader2, Plus, ShieldAlert, ShieldCheck, Trash2 } from "lucide-react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { format } from "date-fns"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Field, FieldLabel, FieldError } from "@/components/ui/field"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Skeleton } from "@/components/ui/skeleton"
import { AdminService } from "@/lib/api/admins"
import { useAdminAuthStore } from "@/stores/admin-auth-store"
import { cn } from "@/lib/utils"
import type { IAdmin } from "@/interfaces"

export function AdminsPageContent() {
  const queryClient = useQueryClient()
  const currentAdmin = useAdminAuthStore((s) => s.admin)

  const [addOpen, setAddOpen] = useState(false)
  const [form, setForm] = useState({ name: "", email: "", isSuperAdmin: false })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [deleteTarget, setDeleteTarget] = useState<IAdmin | null>(null)

  const { data: admins = [], isLoading } = useQuery({
    queryKey: ["admins"],
    queryFn: () => AdminService.list(),
  })

  function invalidate() {
    queryClient.invalidateQueries({ queryKey: ["admins"] })
  }

  const createMutation = useMutation({
    mutationFn: () =>
      AdminService.create({
        name: form.name.trim(),
        email: form.email.trim(),
        isSuperAdmin: form.isSuperAdmin,
      }),
    onSuccess: (admin) => {
      toast.success(`${admin.name} can now sign in.`)
      invalidate()
      setAddOpen(false)
      setForm({ name: "", email: "", isSuperAdmin: false })
      setErrors({})
    },
    onError: (err) => toast.error(err instanceof Error ? err.message : "Could not add admin."),
  })

  const toggleMutation = useMutation({
    mutationFn: (admin: IAdmin) => AdminService.toggleSuspended(admin._id),
    onSuccess: (admin) => {
      toast.success(admin.isSuspended ? `${admin.name} suspended.` : `${admin.name} reinstated.`)
      invalidate()
    },
    onError: (err) => toast.error(err instanceof Error ? err.message : "Could not update admin."),
  })

  const deleteMutation = useMutation({
    mutationFn: (admin: IAdmin) => AdminService.delete(admin._id),
    onSuccess: (_, admin) => {
      toast.success(`${admin.name} removed.`)
      invalidate()
      setDeleteTarget(null)
    },
    onError: (err) => {
      toast.error(err instanceof Error ? err.message : "Could not remove admin.")
      setDeleteTarget(null)
    },
  })

  function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    const next: Record<string, string> = {}
    if (!form.name.trim()) next.name = "Enter their full name."
    if (!form.email.trim() || !form.email.includes("@")) next.email = "Enter a valid email address."
    setErrors(next)
    if (Object.keys(next).length > 0) return
    createMutation.mutate()
  }

  if (!currentAdmin?.isSuperAdmin) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed py-24 text-center">
        <div className="flex size-14 items-center justify-center rounded-full bg-muted">
          <ShieldAlert className="size-6 text-muted-foreground" />
        </div>
        <p className="mt-4 font-medium">Super admins only</p>
        <p className="mt-1 max-w-sm text-sm text-muted-foreground">
          You don&apos;t have permission to manage admin accounts. Ask a super admin if you need
          access.
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Admins</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Everyone who can sign in and manage the store.
          </p>
        </div>
        <Button onClick={() => setAddOpen(true)} className="shrink-0 gap-2">
          <Plus className="size-4" />
          <span className="hidden sm:inline">Add admin</span>
          <span className="sm:hidden">Add</span>
        </Button>
      </div>

      <div className="overflow-hidden rounded-xl border">
        <div className="overflow-x-auto">
          <table className="w-full min-w-max text-sm">
            <thead>
              <tr className="border-b bg-muted/40 text-left text-xs text-muted-foreground">
                <th className="px-4 py-2.5 font-medium">Admin</th>
                <th className="px-4 py-2.5 font-medium">Role</th>
                <th className="px-4 py-2.5 font-medium">Added</th>
                <th className="px-4 py-2.5 font-medium">Status</th>
                <th className="px-4 py-2.5" />
              </tr>
            </thead>
            <tbody className="divide-y">
              {isLoading
                ? Array.from({ length: 3 }).map((_, i) => (
                    <tr key={i}>
                      <td colSpan={5} className="px-4 py-3">
                        <Skeleton className="h-8 w-full" />
                      </td>
                    </tr>
                  ))
                : admins.map((admin) => {
                    const isSelf = admin._id === currentAdmin._id
                    return (
                      <tr key={admin._id} className="bg-background">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <Avatar className="size-8">
                              <AvatarFallback className="bg-primary text-xs font-bold text-primary-foreground">
                                {admin.name.charAt(0).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">
                                {admin.name}
                                {isSelf && (
                                  <span className="ml-1.5 text-xs text-muted-foreground">
                                    (you)
                                  </span>
                                )}
                              </p>
                              <p className="text-xs text-muted-foreground">{admin.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          {admin.isSuperAdmin ? (
                            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-primary">
                              <ShieldCheck className="size-3.5" />
                              Super admin
                            </span>
                          ) : (
                            <span className="text-xs text-muted-foreground">Admin</span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-muted-foreground">
                          {format(new Date(admin.createdAt), "d MMM yyyy")}
                        </td>
                        <td className="px-4 py-3">
                          <Badge
                            className={cn(
                              "rounded-full text-xs",
                              admin.isSuspended
                                ? "bg-muted text-muted-foreground"
                                : "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                            )}
                          >
                            {admin.isSuspended ? "Suspended" : "Active"}
                          </Badge>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-end gap-1">
                            <Button
                              variant="outline"
                              size="sm"
                              disabled={isSelf || toggleMutation.isPending}
                              onClick={() => toggleMutation.mutate(admin)}
                            >
                              {admin.isSuspended ? "Reinstate" : "Suspend"}
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              disabled={isSelf}
                              onClick={() => setDeleteTarget(admin)}
                              className="size-8 text-destructive hover:bg-destructive/10 hover:text-destructive disabled:opacity-30"
                            >
                              <Trash2 className="size-3.5" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
            </tbody>
          </table>
        </div>
      </div>

      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Add an admin</DialogTitle>
            <DialogDescription>
              They&apos;ll be able to manage products, orders and customers.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreate} className="flex flex-col gap-4">
            <Field data-invalid={!!errors.name}>
              <FieldLabel>Full name</FieldLabel>
              <Input
                placeholder="Ama Boateng"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              />
              <FieldError>{errors.name}</FieldError>
            </Field>

            <Field data-invalid={!!errors.email}>
              <FieldLabel>Email address</FieldLabel>
              <Input
                type="email"
                placeholder="ama@auntienana.com"
                value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              />
              <FieldError>{errors.email}</FieldError>
            </Field>

            <label className="flex cursor-pointer items-center justify-between gap-3 rounded-xl border bg-muted/30 px-4 py-3">
              <div>
                <p className="text-sm font-medium">Make super admin</p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  Can also add and remove other admins.
                </p>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={form.isSuperAdmin}
                onClick={() => setForm((f) => ({ ...f, isSuperAdmin: !f.isSuperAdmin }))}
                className={cn(
                  "relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors",
                  form.isSuperAdmin ? "bg-primary" : "bg-muted-foreground/30"
                )}
              >
                <span
                  className={cn(
                    "pointer-events-none inline-block size-5 rounded-full bg-white shadow-lg transition-transform",
                    form.isSuperAdmin ? "translate-x-5" : "translate-x-0"
                  )}
                />
              </button>
            </label>

            <div className="flex gap-2 pt-1">
              <DialogClose render={<Button variant="outline" className="flex-1" />}>
                Cancel
              </DialogClose>
              <Button type="submit" disabled={createMutation.isPending} className="flex-1">
                {createMutation.isPending ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  "Add admin"
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={!!deleteTarget} onOpenChange={(o) => !o && setDeleteTarget(null)}>
        <DialogContent showCloseButton={false}>
          <DialogHeader>
            <DialogTitle>Remove admin?</DialogTitle>
            <DialogDescription>
              {deleteTarget?.name} will lose access immediately. This can&apos;t be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose render={<Button variant="outline" />}>Cancel</DialogClose>
            <Button
              variant="destructive"
              disabled={deleteMutation.isPending}
              onClick={() => deleteTarget && deleteMutation.mutate(deleteTarget)}
            >
              {deleteMutation.isPending ? <Loader2 className="size-4 animate-spin" /> : "Remove"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
