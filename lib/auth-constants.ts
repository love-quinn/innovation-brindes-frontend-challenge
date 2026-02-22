/**
 * Constantes de autenticação compartilhadas entre middleware e auth store.
 * Usado para alinhar a verificação de rota protegida (cookie) com o estado do cliente.
 */
export const AUTH_TOKEN_KEY = "token" as const;
export const AUTH_USER_KEY = "user" as const;
