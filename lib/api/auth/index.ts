import api, { handleApiError } from "@/lib/api"
import { USE_MOCKS, mockAdmins } from "@/lib/mock"
import type { IAdmin } from "@/interfaces"

export interface AdminSignInPayload {
  email: string
  password: string
}

export interface AdminSignInResponse {
  admin: IAdmin
  token: string
}

export class AuthService {
  static async signIn(payload: AdminSignInPayload): Promise<AdminSignInResponse> {
    if (USE_MOCKS) return mockAdmins.signIn(payload.email)
    try {
      const { data } = await api.post("/admin/auth/login", payload)
      return data.data
    } catch (error) {
      handleApiError(error)
    }
  }

  static async me(): Promise<IAdmin> {
    try {
      const { data } = await api.get("/admin/me")
      return data.data
    } catch (error) {
      handleApiError(error)
    }
  }
}
