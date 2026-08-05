import api, { handleApiError } from "@/lib/api"
import { USE_MOCKS, mockCategories } from "@/lib/mock"
import type { IProductCategory } from "@/interfaces"

export interface CategoryCreatePayload {
  name: string
}

export type CategoryUpdatePayload = Partial<CategoryCreatePayload>

export class CategoryService {
  static async list(): Promise<IProductCategory[]> {
    if (USE_MOCKS) return mockCategories.list()
    try {
      const { data } = await api.get("/product-category")
      return data.data
    } catch (error) {
      handleApiError(error)
    }
  }

  static async create(payload: CategoryCreatePayload): Promise<IProductCategory> {
    if (USE_MOCKS) return mockCategories.create(payload)
    try {
      const { data } = await api.post("/product-category", payload)
      return data.data
    } catch (error) {
      handleApiError(error)
    }
  }

  static async update(id: string, payload: CategoryUpdatePayload): Promise<IProductCategory> {
    if (USE_MOCKS) return mockCategories.update(id, payload)
    try {
      const { data } = await api.patch(`/product-category/${id}`, payload)
      return data.data
    } catch (error) {
      handleApiError(error)
    }
  }

  static async delete(id: string): Promise<void> {
    if (USE_MOCKS) return mockCategories.remove(id)
    try {
      await api.delete(`/product-category/${id}`)
    } catch (error) {
      handleApiError(error)
    }
  }
}
