"use client";

import Image from "next/image";
import { Gift, Heart } from "lucide-react";
import type { Product } from "@/services/products";
import { useProductModalStore } from "@/store/productModalStore";
import { useFavoritesStore } from "@/store/favoritesStore";

function formatPrice(preco: string) {
  const n = parseFloat(preco);
  if (Number.isNaN(n)) return "";
  return n.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

const PLACEHOLDER_COLORS = [
  "#3b82f6",
  "#22c55e",
  "#94a3b8",
  "#ef4444",
  "#f97316",
  "#eab308",
  "#a16207",
];

export function ProductCard({ product }: { product: Product }) {
  const openModal = useProductModalStore((s) => s.open);
  const isFavorite = useFavoritesStore((s) => s.isFavorite(product.codigo));
  const toggleFavorite = useFavoritesStore((s) => s.toggleFavorite);
  const desc = product.descricao?.trim() ?? "";
  const descriptionSnippet =
    desc.length > 70 ? desc.slice(0, 70).trim() + "..." : desc || "";

  const priceNumber = parseFloat(product.preco);
  const showPrice = !Number.isNaN(priceNumber) && priceNumber > 0;

  return (
    <div className="text-center">
        {/* Nome e código */}
        <div className="flex flex-col gap-2 pt-3 pb-3 px-3">
            <h3 className="text-gray-900 font-bold text-[15px] leading-tight min-h-[30px]">
            {product.nome}
            </h3>
            <p className="text-gray-900 text-sm">{product.codigo}</p>
        </div>
      <article className="bg-white border relative border-gray-200 shadow-sm rounded-md overflow-hidden flex flex-col text-center pb-10">

        {/* IMAGEM + selo + embalagem */}
        <div className="relative bg-white pb-10 flex items-center justify-center">
          <div className="relative w-full aspect-square max-h-[170px] overflow-visible min-h-[120px]">
            <Image
              src={product.imagem || "/placeholder.png"}
              alt={product.nome}
              fill
              className="object-contain"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />

            {/* Favorito (top-left) - click não abre modal */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                toggleFavorite(product.codigo);
              }}
              aria-label={isFavorite ? "Remover dos favoritos" : "Adicionar aos favoritos"}
              className="absolute top-2 left-2 z-20 p-1.5 rounded-full bg-white/90 shadow hover:bg-white focus:outline-none focus:ring-2 focus:ring-[#80bc04] focus:ring-offset-1 focus-visible:ring-2 focus-visible:ring-[#80bc04] focus-visible:ring-offset-1"
            >
              <Heart
                className={`size-5 ${isFavorite ? "fill-red-500 text-red-500" : "text-gray-400"}`}
                strokeWidth={2}
                aria-hidden
              />
            </button>

            {/* selo EXCLUSIVO */}
            <span className="absolute top-0 right-0 bg-gray-100 text-[#20b3ca] text-xs font-bold px-2 py-[2px] rounded z-20">
              EXCLUSIVO!
            </span>

            {/* embalagem especial (AGORA por cima da imagem) */}
            <div
              className="absolute -bottom-10 left-0 w-fit border border-l-0 rounded-t-lg bg-white p-2
                 flex items-center gap-2 overflow-visible z-20"
            >
              {/* ÍCONE decorativo (overflow pra cima) */}
              <div className="absolute -top-2 bg-white left-1 w-14 h-14" aria-hidden>
                <Image
                  src="/box.png"
                  alt=""
                  fill
                  className="object-contain"
                />
              </div>

              <div className="w-12 shrink-0" />

            <div className="flex flex-col gap-1 items-start">
              <span className="text-gray-600 font-bold text-[11px] leading-tight">
                com embalagem
              </span>
              <span className="text-gray-600 font-bold text-[11px] leading-tight">
                especial
              </span>
            </div>
            </div>
          </div>
        </div>

        {/* descrição */}
        {descriptionSnippet && (
          <p className="text-gray-600 text-xs px-3 pt-2 text-left line-clamp-2 min-h-[42px]">
            {descriptionSnippet}
          </p>
        )}

        {/* cores (decorativo) */}
        <div className="flex flex-col items-start gap-1.5 px-3 py-2 flex-wrap" aria-hidden>
          <p className="text-gray-700 font-bold text-xs">Cores:</p>
          <div className="grid grid-cols-4">
            {PLACEHOLDER_COLORS.map((color, i) => (
              <span
                key={i}
                className="w-4 h-4 rounded-full border border-gray-200"
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        </div>

        {/* PREÇO alinhado à direita e preto */}
        {showPrice && (
          <div className="px-3 pb-2 text-right absolute bottom-1 right-1">
            <p className="text-gray-500 text-[11px]">a partir de</p>
            <p className="text-black font-bold text-lg leading-tight">
              {formatPrice(product.preco)}
            </p>
            <p className="text-gray-900 text-[10px]">
              gerado pela melhor oferta
            </p>
          </div>
        )}

        {/* botão */}
      </article>
      <div className="p-3 pt-1 mt-auto">
        <button
          type="button"
          onClick={(e) => openModal(product, e.currentTarget)}
          className="w-full bg-[#80bc04] text-white text-sm font-semibold py-2 rounded hover:bg-[#6fa803] transition focus:outline-none focus:ring-2 focus:ring-[#80bc04] focus:ring-offset-2 focus-visible:ring-2 focus-visible:ring-[#80bc04] focus-visible:ring-offset-2"
        >
          CONFIRA
        </button>
      </div>
    </div>
  );
}
