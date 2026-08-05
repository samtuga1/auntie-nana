import type { IOrder } from "@/interfaces"

/** Badge styling shared by the orders table, order drawer and dashboard overview. */
export const ORDER_STATUS_STYLES: Record<IOrder["status"], string> = {
  pending: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  processing: "bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400",
  shipped: "bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400",
  delivered: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  cancelled: "bg-muted text-muted-foreground",
}

export const PAYMENT_STATUS_STYLES: Record<IOrder["paymentStatus"], string> = {
  paid: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  unpaid: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  refunded: "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400",
}

export const ORDER_STATUSES: IOrder["status"][] = [
  "pending",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
]
