import api, { handleApiError } from "@/lib/api"
import { USE_MOCKS, mockCustomers } from "@/lib/mock"
import type { ICustomer, IOrder, IPaginated } from "@/interfaces"

export interface FetchCustomersParams {
  page?: number
  limit?: number
  search?: string
}

export class CustomerService {
  static async fetchAll(params?: FetchCustomersParams): Promise<IPaginated<ICustomer>> {
    if (USE_MOCKS) return mockCustomers.list(params)
    try {
      const { data } = await api.get("/customer", { params })
      return data.data
    } catch (error) {
      handleApiError(error)
    }
  }

  static async fetchOne(id: string): Promise<ICustomer> {
    if (USE_MOCKS) return mockCustomers.get(id)
    try {
      const { data } = await api.get(`/customer/${id}`)
      return data.data
    } catch (error) {
      handleApiError(error)
    }
  }

  static async fetchOrders(id: string): Promise<IOrder[]> {
    if (USE_MOCKS) return mockCustomers.ordersFor(id)
    try {
      const { data } = await api.get(`/customer/${id}/orders`)
      return data.data
    } catch (error) {
      handleApiError(error)
    }
  }
}
