"use client"

import Image from "next/image"
import Link from "next/link"
import { Minus, Package, Plus, ShoppingBag, Trash2 } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { useCartStore, selectCartSubtotal } from "@/stores/cart-store"
import { formatGHS } from "@/lib/utils"

const DELIVERY_FEE = 25

export default function CartPage() {
  const items = useCartStore((s) => s.items)
  const hydrated = useCartStore((s) => s._hasHydrated)
  const setQuantity = useCartStore((s) => s.setQuantity)
  const remove = useCartStore((s) => s.remove)
  const clear = useCartStore((s) => s.clear)
  const subtotal = useCartStore(selectCartSubtotal)

  if (!hydrated) return <div className="min-h-[50vh]" />

  if (items.length === 0) {
    return (
      <div className="mx-auto flex w-full max-w-6xl flex-col items-center px-5 py-24 text-center md:px-8">
        <div className="flex size-16 items-center justify-center rounded-full bg-muted">
          <ShoppingBag className="size-7 text-muted-foreground" />
        </div>
        <h1 className="mt-5 text-2xl font-bold tracking-tight">Your cart is empty</h1>
        <p className="mt-2 max-w-sm text-muted-foreground">
          Browse the range and add a few packs — delivery across Accra and beyond.
        </p>
        <Button
          size="lg"
          nativeButton={false}
          render={<Link href="/products" />}
          className="mt-7 h-12 px-6"
        >
          Start shopping
        </Button>
      </div>
    )
  }

  return (
    <div className="mx-auto w-full max-w-6xl px-5 py-12 md:px-8 md:py-16">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Your cart</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {items.length} item{items.length === 1 ? "" : "s"} ready to go
          </p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            clear()
            toast.success("Cart cleared")
          }}
          className="text-muted-foreground"
        >
          Clear cart
        </Button>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1.6fr_1fr]">
        <div className="divide-y divide-black/6 overflow-hidden rounded-2xl border border-black/6">
          {items.map((item) => (
            <div key={item.productId} className="flex gap-4 p-4">
              <Link
                href={`/products/${item.slug}`}
                className="relative size-20 shrink-0 overflow-hidden rounded-xl bg-[#f4f7ef]"
              >
                {item.imageUrl ? (
                  <Image
                    src={item.imageUrl}
                    alt={item.name}
                    fill
                    sizes="80px"
                    className="object-contain p-2"
                  />
                ) : (
                  <div className="flex size-full items-center justify-center">
                    <Package className="size-5 text-muted-foreground/40" />
                  </div>
                )}
              </Link>

              <div className="flex min-w-0 flex-1 flex-col">
                <Link
                  href={`/products/${item.slug}`}
                  className="text-sm font-semibold hover:underline"
                >
                  {item.name}
                </Link>
                {item.weight && (
                  <p className="mt-0.5 text-xs text-muted-foreground">{item.weight}</p>
                )}
                <p className="mt-1 text-sm text-muted-foreground">{formatGHS(item.price)} each</p>

                <div className="mt-auto flex items-center gap-3 pt-3">
                  <div className="flex items-center rounded-lg border border-input">
                    <button
                      type="button"
                      onClick={() => setQuantity(item.productId, item.quantity - 1)}
                      aria-label="Decrease quantity"
                      className="flex size-8 items-center justify-center text-muted-foreground hover:text-foreground"
                    >
                      <Minus className="size-3.5" />
                    </button>
                    <span className="w-8 text-center text-sm font-semibold">{item.quantity}</span>
                    <button
                      type="button"
                      onClick={() => setQuantity(item.productId, item.quantity + 1)}
                      aria-label="Increase quantity"
                      className="flex size-8 items-center justify-center text-muted-foreground hover:text-foreground"
                    >
                      <Plus className="size-3.5" />
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => remove(item.productId)}
                    className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="size-3.5" />
                    Remove
                  </button>
                </div>
              </div>

              <p className="shrink-0 text-sm font-bold">
                {formatGHS(item.price * item.quantity)}
              </p>
            </div>
          ))}
        </div>

        <div className="h-fit rounded-2xl border border-black/6 bg-[#f7faf2] p-6">
          <h2 className="font-semibold tracking-tight">Order summary</h2>

          <dl className="mt-5 flex flex-col gap-3 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Subtotal</dt>
              <dd className="font-medium">{formatGHS(subtotal)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Delivery</dt>
              <dd className="font-medium">{formatGHS(DELIVERY_FEE)}</dd>
            </div>
            <div className="mt-2 flex justify-between border-t border-black/8 pt-3 text-base">
              <dt className="font-semibold">Total</dt>
              <dd className="font-bold">{formatGHS(subtotal + DELIVERY_FEE)}</dd>
            </div>
          </dl>

          <Button
            size="lg"
            className="mt-6 h-12 w-full"
            onClick={() =>
              toast.info("Checkout is coming next — Paystack goes in with the backend.")
            }
          >
            Proceed to checkout
          </Button>

          <p className="mt-3 text-center text-xs text-muted-foreground">
            Pay securely with mobile money, card or bank transfer.
          </p>

          <Link
            href="/products"
            className="mt-4 block text-center text-sm font-medium text-primary hover:underline"
          >
            Continue shopping
          </Link>
        </div>
      </div>
    </div>
  )
}
