import axios from "axios"

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
      const token = localStorage.getItem("token")

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
 * Se receber 401 → força logout
 */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Remove token
      if (typeof window !== "undefined") {
        localStorage.removeItem("token")
        window.location.href = "/login"
      }
    }

    return Promise.reject(error)
  }
)