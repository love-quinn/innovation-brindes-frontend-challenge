"use client";

import { ProductCardSkeleton } from "./ProductCardSkeleton";

const DEFAULT_COUNT = 8;

interface ProductGridSkeletonProps {
  count?: number;
  /** Screen reader message when used for initial load */
  "aria-label"?: string;
}

/**
 * Grid of skeleton cards for products loading state (ETAPA 13).
 * Use for initial load (e.g. 8–12 cards) or incremental load (e.g. 2–4 cards).
 */
export function ProductGridSkeleton({
  count = DEFAULT_COUNT,
  "aria-label": ariaLabel = "Carregando produtos",
}: ProductGridSkeletonProps) {
  return (
    <div
      className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4"
      role="status"
      aria-busy="true"
      aria-label={ariaLabel}
    >
      <span className="sr-only">{ariaLabel}</span>
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}
