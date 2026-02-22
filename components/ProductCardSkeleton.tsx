"use client";

/**
 * Skeleton version of ProductCard for loading states (ETAPA 13).
 * Matches card dimensions and layout; use aria-busy for screen readers.
 */
export function ProductCardSkeleton() {
  return (
    <div
      className="text-center"
      role="presentation"
      aria-busy="true"
      aria-label="Carregando produto"
    >
      {/* Nome e código */}
      <div className="flex flex-col gap-2 pt-3 pb-3 px-3">
        <div className="h-5 w-3/4 bg-gray-200 rounded animate-pulse mx-auto" />
        <div className="h-4 w-1/3 bg-gray-100 rounded animate-pulse mx-auto" />
      </div>

      <article className="bg-white border relative border-gray-200 shadow-sm rounded-md overflow-hidden flex flex-col text-center pb-10">
        {/* Área da imagem */}
        <div className="relative bg-gray-50 pb-10 flex items-center justify-center">
          <div className="relative w-full aspect-square max-h-[170px] bg-gray-200 animate-pulse" />
        </div>

        {/* Descrição */}
        <div className="px-3 pt-2 space-y-1">
          <div className="h-3 w-full bg-gray-100 rounded animate-pulse" />
          <div className="h-3 w-2/3 bg-gray-100 rounded animate-pulse" />
        </div>

        {/* Cores */}
        <div className="flex flex-col items-start gap-1.5 px-3 py-2">
          <div className="h-3 w-12 bg-gray-100 rounded animate-pulse" />
          <div className="grid grid-cols-4 gap-1">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div
                key={i}
                className="w-4 h-4 rounded-full bg-gray-100 animate-pulse"
              />
            ))}
          </div>
        </div>

        {/* Preço (placeholder) */}
        <div className="px-3 pb-2 text-right absolute bottom-1 right-1">
          <div className="h-3 w-16 bg-gray-100 rounded animate-pulse ml-auto" />
          <div className="h-5 w-20 bg-gray-200 rounded animate-pulse mt-1 ml-auto" />
        </div>
      </article>

      {/* Botão */}
      <div className="p-3 pt-1">
        <div className="w-full h-10 bg-gray-200 rounded animate-pulse" />
      </div>
    </div>
  );
}
