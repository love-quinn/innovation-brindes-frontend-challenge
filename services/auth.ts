import { api } from "./api"

interface LoginPayload {
  email: string
  senha: string
}

export interface LoginResponse {
  status: number
  message: string
  token_de_acesso: string
  dados_usuario: {
    codigo_usuario: string
    nome_usuario: string
    codigo_grupo: string
    nome_grupo: string
  }
}

export async function loginRequest(
  payload: LoginPayload
): Promise<LoginResponse> {
  const { data } = await api.post<LoginResponse>(
    "/login/acessar",
    payload
  )

  return data
}