import type { IAdmin, ICustomer, IOrder, IPaginated, IProduct, IProductCategory } from "@/interfaces"
import {
  MOCK_ADMINS,
  MOCK_CATEGORIES,
  MOCK_CUSTOMERS,
  MOCK_ORDERS,
  MOCK_PRODUCTS,
} from "./data"

/**
 * In-browser stand-in for the backend.
 *
 * Every service class in `lib/api/` short-circuits to this module while
 * `USE_MOCKS` is true. Mutations persist to localStorage so the dashboard
 * behaves like a real app across refreshes.
 *
 * To switch to the real API: set NEXT_PUBLIC_USE_MOCKS=false (or delete this
 * folder and the `if (USE_MOCKS)` guards in the service classes).
 */
export const USE_MOCKS = process.env.NEXT_PUBLIC_USE_MOCKS !== "false"

const KEY = "samaaceholdings-mock-db-v1"

interface MockDb {
  products: IProduct[]
  categories: IProductCategory[]
  orders: IOrder[]
  customers: ICustomer[]
  admins: IAdmin[]
}

function seed(): MockDb {
  return {
    products: MOCK_PRODUCTS,
    categories: MOCK_CATEGORIES,
    orders: MOCK_ORDERS,
    customers: MOCK_CUSTOMERS,
    admins: MOCK_ADMINS,
  }
}

let memory: MockDb | null = null

function db(): MockDb {
  if (memory) return memory
  if (typeof window === "undefined") {
    memory = seed()
    return memory
  }
  try {
    const raw = window.localStorage.getItem(KEY)
    memory = raw ? (JSON.parse(raw) as MockDb) : seed()
  } catch {
    memory = seed()
  }
  return memory
}

function persist() {
  if (typeof window === "undefined" || !memory) return
  try {
    window.localStorage.setItem(KEY, JSON.stringify(memory))
  } catch {
    /* quota or private mode — in-memory state still works for this session */
  }
}

/** Wipe mock state and reseed. Exposed on the admin settings page. */
export function resetMockDb() {
  memory = seed()
  persist()
}

/** Simulates network latency so loading states are actually visible. */
function delay<T>(value: T, ms = 260): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms))
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
}

function paginate<T>(rows: T[], page = 1, limit = 10): IPaginated<T> {
  const total = rows.length
  const totalPages = Math.max(1, Math.ceil(total / limit))
  const safePage = Math.min(Math.max(1, page), totalPages)
  return {
    data: rows.slice((safePage - 1) * limit, safePage * limit),
    total,
    page: safePage,
    totalPages,
  }
}

// ── Products ─────────────────────────────────────────────────────────────────

export const mockProducts = {
  list(params?: {
    page?: number
    limit?: number
    search?: string
    categoryId?: string
    isPublished?: boolean
  }) {
    let rows = [...db().products]
    if (params?.search) {
      const q = params.search.toLowerCase()
      rows = rows.filter(
        (p) => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)
      )
    }
    if (params?.categoryId) rows = rows.filter((p) => p.category._id === params.categoryId)
    if (params?.isPublished !== undefined) {
      rows = rows.filter((p) => p.isPublished === params.isPublished)
    }
    rows.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1))
    return delay(paginate(rows, params?.page ?? 1, params?.limit ?? 10))
  },

  get(id: string) {
    const found = db().products.find((p) => p._id === id || p.slug === id)
    if (!found) return Promise.reject(new Error("Product not found"))
    return delay(found)
  },

  create(payload: {
    name: string
    description: string
    price: number
    comparePrice?: number | null
    imageUrls: string[]
    categoryId: string
    stock?: number | null
    weight?: string | null
    featured?: boolean
    isPublished?: boolean
  }) {
    const state = db()
    const category =
      state.categories.find((c) => c._id === payload.categoryId) ?? state.categories[0]
    const product: IProduct = {
      _id: `prod_${Date.now()}`,
      name: payload.name,
      slug: slugify(payload.name),
      description: payload.description,
      price: payload.price,
      comparePrice: payload.comparePrice ?? undefined,
      imageUrls: payload.imageUrls,
      category,
      stock: payload.stock ?? 0,
      weight: payload.weight ?? undefined,
      featured: payload.featured ?? false,
      isPublished: payload.isPublished ?? true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    state.products = [product, ...state.products]
    persist()
    return delay(product)
  },

  update(
    id: string,
    payload: Partial<{
      name: string
      description: string
      price: number
      comparePrice: number | null
      imageUrls: string[]
      categoryId: string
      stock: number | null
      weight: string | null
      featured: boolean
      isPublished: boolean
    }>
  ) {
    const state = db()
    const index = state.products.findIndex((p) => p._id === id)
    if (index === -1) return Promise.reject(new Error("Product not found"))
    const current = state.products[index]
    const category = payload.categoryId
      ? (state.categories.find((c) => c._id === payload.categoryId) ?? current.category)
      : current.category
    const updated: IProduct = {
      ...current,
      ...("name" in payload && payload.name
        ? { name: payload.name, slug: slugify(payload.name) }
        : {}),
      ...("description" in payload ? { description: payload.description! } : {}),
      ...("price" in payload ? { price: payload.price! } : {}),
      ...("comparePrice" in payload ? { comparePrice: payload.comparePrice ?? undefined } : {}),
      ...("imageUrls" in payload ? { imageUrls: payload.imageUrls! } : {}),
      ...("stock" in payload ? { stock: payload.stock ?? 0 } : {}),
      ...("weight" in payload ? { weight: payload.weight ?? undefined } : {}),
      ...("featured" in payload ? { featured: payload.featured! } : {}),
      ...("isPublished" in payload ? { isPublished: payload.isPublished! } : {}),
      category,
      updatedAt: new Date().toISOString(),
    }
    state.products[index] = updated
    persist()
    return delay(updated)
  },

  remove(id: string) {
    const state = db()
    state.products = state.products.filter((p) => p._id !== id)
    persist()
    return delay(undefined)
  },

  /** Data-URL round trip stands in for an R2 upload. */
  upload(file: File) {
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(String(reader.result))
      reader.onerror = () => reject(new Error("Could not read that file"))
      reader.readAsDataURL(file)
    })
  },
}

// ── Categories ───────────────────────────────────────────────────────────────

export const mockCategories = {
  list() {
    return delay([...db().categories])
  },

  create(payload: { name: string }) {
    const state = db()
    const category: IProductCategory = {
      _id: `cat_${Date.now()}`,
      name: payload.name,
      slug: slugify(payload.name),
    }
    state.categories = [...state.categories, category]
    persist()
    return delay(category)
  },

  update(id: string, payload: { name?: string }) {
    const state = db()
    const index = state.categories.findIndex((c) => c._id === id)
    if (index === -1) return Promise.reject(new Error("Category not found"))
    const updated = {
      ...state.categories[index],
      ...(payload.name ? { name: payload.name, slug: slugify(payload.name) } : {}),
    }
    state.categories[index] = updated
    // keep the denormalised copy on each product in sync
    state.products = state.products.map((p) =>
      p.category._id === id ? { ...p, category: updated } : p
    )
    persist()
    return delay(updated)
  },

  remove(id: string) {
    const state = db()
    state.categories = state.categories.filter((c) => c._id !== id)
    persist()
    return delay(undefined)
  },
}

// ── Orders ───────────────────────────────────────────────────────────────────

export const mockOrders = {
  list(params?: { page?: number; limit?: number; search?: string; status?: string }) {
    let rows = [...db().orders]
    if (params?.search) {
      const q = params.search.toLowerCase()
      rows = rows.filter(
        (o) =>
          o.orderNumber.toLowerCase().includes(q) ||
          o.customer.name.toLowerCase().includes(q) ||
          o.customer.email.toLowerCase().includes(q)
      )
    }
    if (params?.status) rows = rows.filter((o) => o.status === params.status)
    rows.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1))
    return delay(paginate(rows, params?.page ?? 1, params?.limit ?? 10))
  },

  get(id: string) {
    const found = db().orders.find((o) => o._id === id)
    if (!found) return Promise.reject(new Error("Order not found"))
    return delay(found)
  },

  updateStatus(id: string, status: IOrder["status"]) {
    const state = db()
    const index = state.orders.findIndex((o) => o._id === id)
    if (index === -1) return Promise.reject(new Error("Order not found"))
    state.orders[index] = { ...state.orders[index], status, updatedAt: new Date().toISOString() }
    persist()
    return delay(state.orders[index])
  },
}

// ── Customers ────────────────────────────────────────────────────────────────

export const mockCustomers = {
  list(params?: { page?: number; limit?: number; search?: string }) {
    let rows = [...db().customers]
    if (params?.search) {
      const q = params.search.toLowerCase()
      rows = rows.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.email.toLowerCase().includes(q) ||
          c.phone.includes(q)
      )
    }
    rows.sort((a, b) => b.totalSpent - a.totalSpent)
    return delay(paginate(rows, params?.page ?? 1, params?.limit ?? 10))
  },

  get(id: string) {
    const found = db().customers.find((c) => c._id === id)
    if (!found) return Promise.reject(new Error("Customer not found"))
    return delay(found)
  },

  ordersFor(customerId: string) {
    return delay(db().orders.filter((o) => o.customer._id === customerId))
  },
}

// ── Admins ───────────────────────────────────────────────────────────────────

export const mockAdmins = {
  list() {
    return delay([...db().admins])
  },

  create(payload: { name: string; email: string; isSuperAdmin?: boolean }) {
    const state = db()
    if (state.admins.some((a) => a.email.toLowerCase() === payload.email.toLowerCase())) {
      return Promise.reject(new Error("An admin with that email already exists"))
    }
    const admin: IAdmin = {
      _id: `adm_${Date.now()}`,
      name: payload.name,
      email: payload.email.toLowerCase(),
      isSuperAdmin: payload.isSuperAdmin ?? false,
      isSuspended: false,
      createdAt: new Date().toISOString(),
    }
    state.admins = [...state.admins, admin]
    persist()
    return delay(admin)
  },

  toggleSuspended(id: string) {
    const state = db()
    const index = state.admins.findIndex((a) => a._id === id)
    if (index === -1) return Promise.reject(new Error("Admin not found"))
    state.admins[index] = { ...state.admins[index], isSuspended: !state.admins[index].isSuspended }
    persist()
    return delay(state.admins[index])
  },

  remove(id: string) {
    const state = db()
    state.admins = state.admins.filter((a) => a._id !== id)
    persist()
    return delay(undefined)
  },

  signIn(email: string) {
    const admin = db().admins.find((a) => a.email.toLowerCase() === email.trim().toLowerCase())
    if (!admin) {
      return Promise.reject(
        new Error("No admin found with that email. Try admin@auntienana.com")
      )
    }
    if (admin.isSuspended) return Promise.reject(new Error("That account is suspended"))
    return delay({ admin, token: `mock-token-${admin._id}` })
  },
}

// ── Dashboard stats ──────────────────────────────────────────────────────────

export interface MockStats {
  totalProducts: number
  publishedProducts: number
  totalOrders: number
  pendingOrders: number
  totalCustomers: number
  revenue: number
  lowStock: IProduct[]
  recentOrders: IOrder[]
  revenueByMonth: { label: string; revenue: number }[]
  ordersByMonth: { label: string; orders: number }[]
}

export const mockStats = {
  get(): Promise<MockStats> {
    const state = db()
    const paid = state.orders.filter((o) => o.paymentStatus === "paid")
    const months = ["Feb", "Mar", "Apr", "May", "Jun", "Jul"]
    return delay({
      totalProducts: state.products.length,
      publishedProducts: state.products.filter((p) => p.isPublished).length,
      totalOrders: state.orders.length,
      pendingOrders: state.orders.filter((o) => o.status === "pending" || o.status === "processing")
        .length,
      totalCustomers: state.customers.length,
      revenue: paid.reduce((sum, o) => sum + o.total, 0),
      lowStock: [...state.products].sort((a, b) => a.stock - b.stock).slice(0, 5),
      recentOrders: [...state.orders]
        .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1))
        .slice(0, 5),
      revenueByMonth: months.map((label, i) => ({
        label,
        revenue: [1840, 2260, 2010, 2790, 3120, 3480][i],
      })),
      ordersByMonth: months.map((label, i) => ({
        label,
        orders: [18, 24, 21, 29, 33, 37][i],
      })),
    })
  },
}
