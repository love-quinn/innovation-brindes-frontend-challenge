"use client";

import { useRef, useEffect, useState, useMemo } from "react";
import { Search } from "lucide-react";
import { useProducts } from "@/hooks/useProducts";
import { useFavoritesStore } from "@/store/favoritesStore";
import { ProductCard } from "./ProductCard";
import { ProductGridSkeleton } from "./ProductGridSkeleton";

export function ProductsSection() {
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);

  const hydrate = useFavoritesStore((s) => s.hydrate);
  const favoriteIds = useFavoritesStore((s) => s.favoriteIds);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

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
    isError,
    refetch,
    isEmpty,
  } = useProducts();

  const displayProducts = useMemo(() => {
    if (!showOnlyFavorites) return products;
    return products.filter((p) => favoriteIds.includes(p.codigo));
  }, [products, showOnlyFavorites, favoriteIds]);

  const favoritesFilterEmpty =
    showOnlyFavorites && displayProducts.length === 0 && !isLoading;

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
      {/* Filtro "Mostrar apenas favoritos" */}
      <div className="flex flex-wrap items-center gap-3">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={showOnlyFavorites}
            onChange={(e) => setShowOnlyFavorites(e.target.checked)}
            className="rounded border-gray-300 text-[#80bc04] focus:ring-[#80bc04]"
          />
          <span className="text-sm text-gray-700">Mostrar apenas favoritos</span>
        </label>
        {showOnlyFavorites && favoriteIds.length > 0 && (
          <span className="text-xs text-gray-500">
            ({favoriteIds.length} favorito{favoriteIds.length !== 1 ? "s" : ""})
          </span>
        )}
      </div>

      {/* Busca + Ordenação */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" aria-hidden />
          <label htmlFor="products-search" className="sr-only">
            Buscar por nome ou código
          </label>
          <input
            id="products-search"
            type="search"
            placeholder="Buscar por nome ou código..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Buscar por nome ou código do produto"
            className="w-full md:w-72 pl-9 pr-3 py-2 border text-gray-900 border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#80bc04] focus:border-transparent focus-visible:ring-2"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => toggleSort("nome")}
            aria-label={sortBy === "nome" ? `Ordenar por nome ${sortOrder === "asc" ? "A a Z" : "Z a A"}` : "Ordenar por nome"}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium border bg-white hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#80bc04] focus-visible:ring-offset-2 ${
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
            aria-label={sortBy === "preco" ? `Ordenar por preço ${sortOrder === "asc" ? "menor primeiro" : "maior primeiro"}` : "Ordenar por preço"}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium border bg-white hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#80bc04] focus-visible:ring-offset-2 ${
              sortBy === "preco"
                ? "border-[#80bc04] bg-[#80bc04]/10 text-[#80bc04]"
                : "border-gray-300 text-gray-700"
            }`}
          >
            Preço {sortBy === "preco" ? (sortOrder === "asc" ? "↑" : "↓") : ""}
          </button>
        </div>
      </div>

      {/* Grid de produtos */}
      {isLoading ? (
        <ProductGridSkeleton count={10} aria-label="Carregando produtos" />
      ) : isError ? (
        <div
          className="text-center py-12 px-4 bg-gray-50 rounded-xl border border-gray-200"
          role="alert"
        >
          <p className="text-gray-700 font-medium">
            Não foi possível carregar os produtos.
          </p>
          <p className="text-gray-500 text-sm mt-1 mb-4">
            Verifique sua conexão e tente novamente.
          </p>
          <button
            type="button"
            onClick={() => refetch()}
            className="px-4 py-2 rounded-lg bg-[#80bc04] text-white text-sm font-medium hover:bg-[#6fa803] transition focus:outline-none focus:ring-2 focus:ring-[#80bc04] focus:ring-offset-2 focus-visible:ring-2 focus-visible:ring-[#80bc04] focus-visible:ring-offset-2"
          >
            Tentar novamente
          </button>
        </div>
      ) : favoritesFilterEmpty ? (
        <div className="text-center py-12 px-4 bg-gray-50 rounded-xl border border-gray-200">
          <p className="text-gray-600 font-medium">
            Você ainda não tem favoritos ou eles foram removidos.
          </p>
          <p className="text-gray-500 text-sm mt-1 mb-4">
            Desmarque o filtro para ver todos os produtos e adicione favoritos.
          </p>
          <button
            type="button"
            onClick={() => setShowOnlyFavorites(false)}
            className="px-4 py-2 rounded-lg bg-[#80bc04] text-white text-sm font-medium hover:bg-[#6fa803] transition focus:outline-none focus:ring-2 focus:ring-[#80bc04] focus:ring-offset-2"
          >
            Mostrar todos os produtos
          </button>
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
            {displayProducts.map((product) => (
              <ProductCard key={product.codigo} product={product} />
            ))}
          </div>
          <div ref={loadMoreRef} className="h-4 mt-4" aria-hidden />
          {isFetchingNextPage && (
            <div className="mt-4">
              <ProductGridSkeleton count={4} aria-label="Carregando mais produtos" />
            </div>
          )}
        </>
      )}
    </section>
  );
}
