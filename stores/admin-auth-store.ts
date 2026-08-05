"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import Cookies from "@/node_modules/@types/js-cookie";
import type { IAdmin } from "@/interfaces";

interface AdminAuthState {
  token: string | null;
  admin: IAdmin | null;
  _hasHydrated: boolean;

  setAuth: (admin: IAdmin, token: string) => void;
  clearAuth: () => void;
  setHasHydrated: (v: boolean) => void;
}

export const useAdminAuthStore = create<AdminAuthState>()(
  persist(
    (set) => ({
      token: null,
      admin: null,
      _hasHydrated: false,

      setAuth: (admin, token) => set({ admin, token }),

      clearAuth: () => {
        Cookies.remove("token");
        set({ admin: null, token: null });
      },

      setHasHydrated: (v) => set({ _hasHydrated: v }),
    }),
    {
      name: "samaaceholdings-admin-auth",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ token: state.token, admin: state.admin }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    },
  ),
);
