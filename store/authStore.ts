import { create } from "zustand"
import { AUTH_TOKEN_KEY, AUTH_USER_KEY } from "@/lib/auth-constants"

const COOKIE_PATH = "/"
const COOKIE_MAX_AGE_REMEMBER = 60 * 60 * 24 * 7 // 7 dias

function setTokenCookie(token: string, remember: boolean) {
  if (typeof document === "undefined") return
  const maxAge = remember ? COOKIE_MAX_AGE_REMEMBER : undefined
  const opts = `path=${COOKIE_PATH}; SameSite=Lax${maxAge != null ? `; max-age=${maxAge}` : ""}`
  document.cookie = `${AUTH_TOKEN_KEY}=${encodeURIComponent(token)}; ${opts}`
}

function clearTokenCookie() {
  if (typeof document === "undefined") return
  document.cookie = `${AUTH_TOKEN_KEY}=; path=${COOKIE_PATH}; max-age=0`
}

interface User {
  codigo_usuario: string
  nome_usuario: string
  codigo_grupo: string
  nome_grupo: string
}

interface AuthState {
  token: string | null
  user: User | null
  isAuthenticated: boolean
  rememberMe: boolean

  login: (
    token: string,
    user: User,
    remember: boolean
  ) => void

  logout: () => void

  loadFromStorage: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  user: null,
  isAuthenticated: false,
  rememberMe: false,

  login: (token, user, remember) => {
    if (remember) {
      localStorage.setItem(AUTH_TOKEN_KEY, token)
      localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user))
    }
    setTokenCookie(token, remember)

    set({
      token,
      user,
      isAuthenticated: true,
      rememberMe: remember,
    })
  },

  logout: () => {
    localStorage.removeItem(AUTH_TOKEN_KEY)
    localStorage.removeItem(AUTH_USER_KEY)
    clearTokenCookie()

    set({
      token: null,
      user: null,
      isAuthenticated: false,
      rememberMe: false,
    })
  },

  loadFromStorage: () => {
    const token = localStorage.getItem(AUTH_TOKEN_KEY)
    const user = localStorage.getItem(AUTH_USER_KEY)

    if (token && user) {
      setTokenCookie(token, true)
      set({
        token,
        user: JSON.parse(user),
        isAuthenticated: true,
        rememberMe: true,
      })
    }
  },
}))