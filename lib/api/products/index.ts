import api, { handleApiError } from "@/lib/api"
import { USE_MOCKS, mockProducts } from "@/lib/mock"
import type { IProduct, IPaginated } from "@/interfaces"

export interface ProductCreatePayload {
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
}

export type ProductUpdatePayload = Partial<ProductCreatePayload>

export interface FetchProductsParams {
  page?: number
  limit?: number
  search?: string
  categoryId?: string
  isPublished?: boolean
}

export class ProductService {
  static async fetchAll(params?: FetchProductsParams): Promise<IPaginated<IProduct>> {
    if (USE_MOCKS) return mockProducts.list(params)
    try {
      const { data } = await api.get("/product", { params })
      return data.data
    } catch (error) {
      handleApiError(error)
    }
  }

  static async fetchOne(id: string): Promise<IProduct> {
    if (USE_MOCKS) return mockProducts.get(id)
    try {
      const { data } = await api.get(`/product/${id}`)
      return data.data
    } catch (error) {
      handleApiError(error)
    }
  }

  static async create(payload: ProductCreatePayload): Promise<IProduct> {
    if (USE_MOCKS) return mockProducts.create(payload)
    try {
      const { data } = await api.post("/product", payload)
      return data.data
    } catch (error) {
      handleApiError(error)
    }
  }

  static async update(id: string, payload: ProductUpdatePayload): Promise<IProduct> {
    if (USE_MOCKS) return mockProducts.update(id, payload)
    try {
      const { data } = await api.patch(`/product/${id}`, payload)
      return data.data
    } catch (error) {
      handleApiError(error)
    }
  }

  static async delete(id: string): Promise<void> {
    if (USE_MOCKS) return mockProducts.remove(id)
    try {
      await api.delete(`/product/${id}`)
    } catch (error) {
      handleApiError(error)
    }
  }

  static async uploadImage(file: File, folder = "products"): Promise<string> {
    if (USE_MOCKS) return mockProducts.upload(file)
    try {
      const form = new FormData()
      form.append("file", file)
      const { data } = await api.post(`/media/upload?folder=${folder}`, form, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      return data.data.url as string
    } catch (error) {
      handleApiError(error)
    }
  }
}
