import { create } from "zustand"

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
      localStorage.setItem("token", token)
      localStorage.setItem("user", JSON.stringify(user))
    }

    set({
      token,
      user,
      isAuthenticated: true,
      rememberMe: remember,
    })
  },

  logout: () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")

    set({
      token: null,
      user: null,
      isAuthenticated: false,
      rememberMe: false,
    })
  },

  loadFromStorage: () => {
    const token = localStorage.getItem("token")
    const user = localStorage.getItem("user")

    if (token && user) {
      set({
        token,
        user: JSON.parse(user),
        isAuthenticated: true,
        rememberMe: true,
      })
    }
  },
}))