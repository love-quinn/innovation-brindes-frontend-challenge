"use client";

import Image from "next/image";
import { Dialog, DialogPanel, DialogTitle, Description } from "@headlessui/react";
import { X } from "lucide-react";
import { useProductModalStore } from "@/store/productModalStore";
import type { Product } from "@/services/products";

function formatPriceBRL(preco: string): string {
  const n = parseFloat(preco);
  if (Number.isNaN(n) || n <= 0) return "";
  return n.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

function ProductModalContent({ product }: { product: Product }) {
  const close = useProductModalStore((s) => s.close);
  const priceFormatted = formatPriceBRL(product.preco);
  const showPrice = priceFormatted.length > 0;

  return (
    <>
      <div className="relative shrink-0">
        {product.imagem ? (
          <div className="relative w-full aspect-4/2 bg-gray-100 rounded-t-xl overflow-hidden">
            <Image
              src={product.imagem}
              alt={product.nome}
              fill
              className="object-contain"
              sizes="(max-width: 300px) 100vw, 280px"
            />
          </div>
        ) : (
          <div className="w-full aspect-4/3 bg-gray-100 rounded-t-xl flex items-center justify-center text-gray-400 text-sm">
            Sem imagem
          </div>
        )}
        <button
          type="button"
          onClick={close}
          data-autofocus
          className="absolute top-3 right-3 p-2 rounded-full bg-white/90 text-gray-700 shadow hover:bg-white focus:outline-none focus:ring-2 focus:ring-[#80bc04] focus:ring-offset-2"
          aria-label="Fechar"
        >
          <X className="size-5" aria-hidden />
        </button>
      </div>

      <div className="p-4 md:p-6 space-y-3 flex-1 overflow-y-auto">
        <DialogTitle id="product-modal-title" className="text-lg font-bold text-gray-900 leading-tight">
          {product.nome}
        </DialogTitle>

        <dl className="space-y-1 text-sm">
          <div>
            <dt className="inline font-medium text-gray-500">Código: </dt>
            <dd className="inline text-gray-900">{product.codigo}</dd>
          </div>
          {product.referencia?.trim() && (
            <div>
              <dt className="inline font-medium text-gray-500">Referência: </dt>
              <dd className="inline text-gray-900">{product.referencia.trim()}</dd>
            </div>
          )}
        </dl>

        {product.descricao?.trim() && (
          <p className="text-gray-600 text-sm leading-relaxed">
            {product.descricao.trim()}
          </p>
        )}

        {showPrice && (
          <p className="text-[#80bc04] font-bold text-xl pt-1">
            {priceFormatted}
          </p>
        )}

        <div className="pt-2 flex flex-col gap-2">
          <button
            type="button"
            onClick={close}
            className="w-full py-2.5 rounded-lg bg-[#80bc04] text-white font-medium hover:bg-[#6fa803] transition focus:outline-none focus:ring-2 focus:ring-[#80bc04] focus:ring-offset-2"
          >
            Fechar
          </button>
        </div>
      </div>
    </>
  );
}

export function ProductModal() {
  const isOpen = useProductModalStore((s) => s.isOpen);
  const product = useProductModalStore((s) => s.product);
  const close = useProductModalStore((s) => s.close);

  return (
    <Dialog
      open={isOpen}
      onClose={close}
      className="relative z-50"
      aria-labelledby="product-modal-title"
      aria-describedby="product-modal-description"
    >
      {/* Overlay - click closes via Headless UI */}
      <div
        className="fixed inset-0 bg-black/50"
        aria-hidden="true"
      />

      {/* Container: centered on desktop, bottom-sheet on mobile */}
      <div className="fixed inset-0 flex w-screen items-end justify-center p-0 md:items-center md:p-4 overflow-y-auto">
        <DialogPanel
          className="flex flex-col w-full max-h-[90vh] md:max-w-lg md:max-h-[85vh] bg-white rounded-t-2xl md:rounded-2xl shadow-xl overflow-hidden focus:outline-none"
        >
          {product ? (
            <>
              <Description id="product-modal-description" className="sr-only">
                Detalhes do produto: {product.nome}, código {product.codigo}.
              </Description>
              <ProductModalContent product={product} />
            </>
          ) : null}
        </DialogPanel>
      </div>
    </Dialog>
  );
}
