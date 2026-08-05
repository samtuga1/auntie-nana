import api, { handleApiError } from "@/lib/api"
import { USE_MOCKS, mockAdmins, mockStats, type MockStats } from "@/lib/mock"
import type { IAdmin } from "@/interfaces"

export interface AdminCreatePayload {
  name: string
  email: string
  isSuperAdmin?: boolean
}

/** Admin-account management — super-admin only. */
export class AdminService {
  static async list(): Promise<IAdmin[]> {
    if (USE_MOCKS) return mockAdmins.list()
    try {
      const { data } = await api.get("/admin/manage")
      return data.data
    } catch (error) {
      handleApiError(error)
    }
  }

  static async create(payload: AdminCreatePayload): Promise<IAdmin> {
    if (USE_MOCKS) return mockAdmins.create(payload)
    try {
      const { data } = await api.post("/admin/manage", payload)
      return data.data
    } catch (error) {
      handleApiError(error)
    }
  }

  static async toggleSuspended(id: string): Promise<IAdmin> {
    if (USE_MOCKS) return mockAdmins.toggleSuspended(id)
    try {
      const { data } = await api.patch(`/admin/manage/${id}/toggle-suspended`)
      return data.data
    } catch (error) {
      handleApiError(error)
    }
  }

  static async delete(id: string): Promise<void> {
    if (USE_MOCKS) return mockAdmins.remove(id)
    try {
      await api.delete(`/admin/manage/${id}`)
    } catch (error) {
      handleApiError(error)
    }
  }
}

export type DashboardStats = MockStats

export class StatsService {
  static async get(): Promise<DashboardStats> {
    if (USE_MOCKS) return mockStats.get()
    try {
      const { data } = await api.get("/admin/stats")
      return data.data
    } catch (error) {
      handleApiError(error)
    }
  }
}
