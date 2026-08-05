import api, { handleApiError } from "@/lib/api"
import { USE_MOCKS, mockOrders } from "@/lib/mock"
import type { IOrder, IPaginated } from "@/interfaces"

export interface FetchOrdersParams {
  page?: number
  limit?: number
  search?: string
  status?: string
}

export class OrderService {
  static async fetchAll(params?: FetchOrdersParams): Promise<IPaginated<IOrder>> {
    if (USE_MOCKS) return mockOrders.list(params)
    try {
      const { data } = await api.get("/order", { params })
      return data.data
    } catch (error) {
      handleApiError(error)
    }
  }

  static async fetchOne(id: string): Promise<IOrder> {
    if (USE_MOCKS) return mockOrders.get(id)
    try {
      const { data } = await api.get(`/order/${id}`)
      return data.data
    } catch (error) {
      handleApiError(error)
    }
  }

  static async updateStatus(id: string, status: IOrder["status"]): Promise<IOrder> {
    if (USE_MOCKS) return mockOrders.updateStatus(id, status)
    try {
      const { data } = await api.patch(`/order/${id}/status`, { status })
      return data.data
    } catch (error) {
      handleApiError(error)
    }
  }
}
