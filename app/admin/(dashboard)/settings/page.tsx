"use client"

import { useState } from "react"
import { useQueryClient } from "@tanstack/react-query"
import { Database, Loader2, RotateCcw, Store } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Field, FieldLabel } from "@/components/ui/field"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { USE_MOCKS, resetMockDb } from "@/lib/mock"
import { SITE } from "@/lib/site"

export default function SettingsPage() {
  const queryClient = useQueryClient()
  const [saving, setSaving] = useState(false)
  const [resetOpen, setResetOpen] = useState(false)
  const [store, setStore] = useState({
    name: SITE.brand,
    email: SITE.email,
    phone: SITE.phone,
    address: SITE.address,
    description: SITE.description,
  })

  function set(field: keyof typeof store) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setStore((prev) => ({ ...prev, [field]: e.target.value }))
  }

  function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    // Persisted for real once the settings endpoint exists.
    setTimeout(() => {
      setSaving(false)
      toast.success("Store details saved.")
    }, 600)
  }

  return (
    <div className="flex max-w-3xl flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Business details shown across your storefront.
        </p>
      </div>

      <form onSubmit={handleSave} className="rounded-xl border p-6">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-primary/8">
            <Store className="size-5 text-primary" />
          </div>
          <div>
            <h2 className="font-semibold tracking-tight">Store details</h2>
            <p className="text-xs text-muted-foreground">Name, contact and description.</p>
          </div>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <Field>
            <FieldLabel>Brand name</FieldLabel>
            <Input value={store.name} onChange={set("name")} />
          </Field>
          <Field>
            <FieldLabel>Address</FieldLabel>
            <Input value={store.address} onChange={set("address")} />
          </Field>
          <Field>
            <FieldLabel>Contact email</FieldLabel>
            <Input type="email" value={store.email} onChange={set("email")} />
          </Field>
          <Field>
            <FieldLabel>Phone number</FieldLabel>
            <Input value={store.phone} onChange={set("phone")} />
          </Field>
        </div>

        <div className="mt-4">
          <Field>
            <FieldLabel>Store description</FieldLabel>
            <Textarea rows={3} value={store.description} onChange={set("description")} />
          </Field>
        </div>

        <Button type="submit" disabled={saving} className="mt-6 gap-2">
          {saving && <Loader2 className="size-4 animate-spin" />}
          Save changes
        </Button>
      </form>

      {USE_MOCKS && (
        <div className="rounded-xl border border-dashed border-amber-300 bg-amber-50/60 p-6 dark:bg-amber-950/10">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-amber-100 dark:bg-amber-900/30">
              <Database className="size-5 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <h2 className="font-semibold tracking-tight">Demo data</h2>
              <p className="text-xs text-muted-foreground">
                The backend isn&apos;t connected yet — products, orders and customers are seeded
                demo records stored in your browser.
              </p>
            </div>
          </div>

          <p className="mt-4 text-sm text-muted-foreground">
            Any product you add or edit is saved locally. Reset to get the original seed catalogue
            back.
          </p>

          <Button variant="outline" onClick={() => setResetOpen(true)} className="mt-4 gap-2">
            <RotateCcw className="size-4" />
            Reset demo data
          </Button>
        </div>
      )}

      <Dialog open={resetOpen} onOpenChange={setResetOpen}>
        <DialogContent showCloseButton={false}>
          <DialogHeader>
            <DialogTitle>Reset demo data?</DialogTitle>
            <DialogDescription>
              Every product, order and admin you added or changed will be discarded and the
              original demo catalogue restored.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose render={<Button variant="outline" />}>Cancel</DialogClose>
            <Button
              variant="destructive"
              onClick={() => {
                resetMockDb()
                queryClient.invalidateQueries()
                setResetOpen(false)
                toast.success("Demo data restored.")
              }}
            >
              Reset
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
