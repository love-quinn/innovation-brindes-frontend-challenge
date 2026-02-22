import axios from "axios"
import { AUTH_TOKEN_KEY } from "@/lib/auth-constants"
import { useAuthStore } from "@/store/authStore"

const API_BASE_URL =
  "https://apihomolog.innovationbrindes.com.br/api/innova-dinamica"

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
})

/**
 * REQUEST INTERCEPTOR
 * Adiciona automaticamente o token em todas as requisições
 */
api.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem(AUTH_TOKEN_KEY)

      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
    }

    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

/**
 * RESPONSE INTERCEPTOR
 * 401 → logout (Zustand + localStorage + cookie) e redirect /login
 */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && typeof window !== "undefined") {
      useAuthStore.getState().logout()
      window.location.href = "/login"
    }

    return Promise.reject(error)
  }
)