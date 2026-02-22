"use client";

import { useRef, useEffect } from "react";
import { Search } from "lucide-react";
import { useProducts } from "@/hooks/useProducts";
import { ProductCard } from "./ProductCard";

export function ProductsSection() {
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const {
    products,
    search,
    setSearch,
    sortBy,
    sortOrder,
    toggleSort,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isEmpty,
  } = useProducts();

  useEffect(() => {
    if (!hasNextPage || isFetchingNextPage) return;
    const el = loadMoreRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) fetchNextPage();
      },
      { rootMargin: "100px" }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  return (
    <section className="space-y-6">
      {/* Busca + Ordenação */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
          <input
            type="search"
            placeholder="Buscar por nome ou código..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full md:w-72 pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#80bc04] focus:border-transparent"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => toggleSort("nome")}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium border bg-white hover:bg-gray-50 ${
              sortBy === "nome"
                ? "border-[#80bc04] bg-[#80bc04]/10 text-[#80bc04]"
                : "border-gray-300 text-gray-700"
            }`}
          >
            Nome {sortBy === "nome" ? (sortOrder === "asc" ? "A→Z" : "Z→A") : ""}
          </button>
          <button
            type="button"
            onClick={() => toggleSort("preco")}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium border bg-white hover:bg-gray-50 ${
              sortBy === "preco"
                ? "border-[#80bc04] bg-[#80bc04]/10 text-[#80bc04]"
                : "border-gray-300 text-gray-700"
            }`}
          >
            Preço {sortBy === "preco" ? (sortOrder === "asc" ? "↑" : "↓") : ""}
          </button>
        </div>
      </div>

      {/* Grid de produtos (5 colunas no desktop, como na referência) */}
      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4">
          {Array.from({ length: 10 }).map((_, i) => (
            <div
              key={i}
              className="rounded-xl border border-gray-200 bg-gray-100 aspect-3/4 animate-pulse"
            />
          ))}
        </div>
      ) : isEmpty ? (
        <div className="text-center py-12 px-4 bg-gray-50 rounded-xl border border-gray-200">
          <p className="text-gray-600 font-medium">Nenhum produto encontrado.</p>
          <p className="text-gray-500 text-sm mt-1">
            Tente outro termo de busca ou código.
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4">
            {products.map((product) => (
              <ProductCard key={product.codigo} product={product} />
            ))}
          </div>
          <div ref={loadMoreRef} className="h-4 mt-4" aria-hidden />
          {isFetchingNextPage && (
            <div className="flex justify-center py-6">
              <span className="text-sm text-gray-500">Carregando mais...</span>
            </div>
          )}
        </>
      )}
    </section>
  );
}
