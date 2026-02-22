import { api } from "./api";

export interface Product {
  codigo: string;
  nome: string;
  referencia: string;
  codigo_categoria: string;
  imagem: string;
  preco: string;
  descricao: string;
}

/** GET produtos/listar – retorna todos os produtos (Bearer token via interceptor) */
export async function getProductsList(): Promise<Product[]> {
  const { data } = await api.get<Product[] | { data?: Product[] }>(
    "/produtos/listar"
  );
  if (Array.isArray(data)) return data;
  if (data && typeof data === "object" && "data" in data && Array.isArray((data as { data: Product[] }).data)) {
    return (data as { data: Product[] }).data;
  }
  return [];
}
