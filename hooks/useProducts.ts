import { useRef, useState, useEffect, useCallback } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import type { Product } from "@/services/products";
import { getProductsList } from "@/services/products";

const PAGE_SIZE = 8;
const DEBOUNCE_MS = 400;

export type SortBy = "nome" | "preco";
export type SortOrder = "asc" | "desc";

function filterProducts(products: Product[], search: string): Product[] {
  if (!search.trim()) return products;
  const lower = search.trim().toLowerCase();
  return products.filter(
    (p) =>
      p.nome.toLowerCase().includes(lower) ||
      p.codigo.toLowerCase().includes(lower) ||
      (p.referencia && p.referencia.toLowerCase().includes(lower))
  );
}

function sortProducts(
  products: Product[],
  sortBy: SortBy,
  sortOrder: SortOrder
): Product[] {
  const sorted = [...products];
  if (sortBy === "nome") {
    sorted.sort((a, b) => {
      const cmp = a.nome.localeCompare(b.nome, "pt-BR");
      return sortOrder === "asc" ? cmp : -cmp;
    });
  } else {
    sorted.sort((a, b) => {
      const pa = parseFloat(a.preco) || 0;
      const pb = parseFloat(b.preco) || 0;
      return sortOrder === "asc" ? pa - pb : pb - pa;
    });
  }
  return sorted;
}

export function useProducts() {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [sortBy, setSortBy] = useState<SortBy>("nome");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), DEBOUNCE_MS);
    return () => clearTimeout(t);
  }, [search]);

  const cacheRef = useRef<{
    key: string;
    list: Product[];
  } | null>(null);

  const query = useInfiniteQuery({
    queryKey: ["products", debouncedSearch, sortBy, sortOrder],
    queryFn: async ({ pageParam = 0 }) => {
      const key = `${debouncedSearch}|${sortBy}|${sortOrder}`;
      let fullList: Product[];

      if (cacheRef.current?.key === key) {
        fullList = cacheRef.current.list;
      } else {
        const all = await getProductsList();
        fullList = sortProducts(
          filterProducts(all, debouncedSearch),
          sortBy,
          sortOrder
        );
        cacheRef.current = { key, list: fullList };
      }

      const start = pageParam * PAGE_SIZE;
      const items = fullList.slice(start, start + PAGE_SIZE);
      const nextPage =
        start + PAGE_SIZE < fullList.length ? pageParam + 1 : undefined;
      return { items, nextPage };
    },
    getNextPageParam: (lastPage) => lastPage.nextPage,
    initialPageParam: 0,
    staleTime: 2 * 60 * 1000,
  });

  const products = query.data?.pages.flatMap((p) => p.items) ?? [];
  const hasNextPage = query.hasNextPage;
  const isFetchingNextPage = query.isFetchingNextPage;
  const isEmpty =
    !query.isLoading &&
    !query.isFetching &&
    debouncedSearch === search &&
    products.length === 0;

  const toggleSort = useCallback((by: SortBy) => {
    setSortBy((prevBy) => {
      if (prevBy !== by) {
        setSortOrder("asc");
        return by;
      }
      setSortOrder((o) => (o === "asc" ? "desc" : "asc"));
      return by;
    });
  }, []);

  return {
    products,
    search,
    setSearch,
    debouncedSearch,
    sortBy,
    sortOrder,
    setSortBy,
    setSortOrder,
    toggleSort,
    fetchNextPage: query.fetchNextPage,
    hasNextPage: !!hasNextPage,
    isFetchingNextPage,
    isLoading: query.isLoading,
    isError: query.isError,
    refetch: query.refetch,
    isEmpty,
  };
}
