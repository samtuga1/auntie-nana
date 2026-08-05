import axios from "axios";
import Cookies from "@/node_modules/@types/js-cookie";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  const token = Cookies.get("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      Cookies.remove("token");
      if (
        typeof window !== "undefined" &&
        !window.location.pathname.startsWith("/admin/sign-in")
      ) {
        window.location.href = "/admin/sign-in";
      }
    }
    return Promise.reject(error);
  },
);

export function handleApiError(error: unknown): never {
  if (axios.isAxiosError(error)) {
    const message =
      error.response?.data?.message || error.message || "An error occurred";
    throw new Error(message);
  }
  throw error;
}

export default api;
