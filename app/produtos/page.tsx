"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader, Mail, Phone } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { useProductModalStore } from "@/store/productModalStore";
import { ProductsSection } from "@/components/ProductsSection";

const ProductModal = dynamic(
  () =>
    import("@/components/ProductModal").then((m) => ({
      default: m.ProductModal,
    })),
  { ssr: false },
);

function LazyProductModal() {
  const hasEverOpened = useProductModalStore((s) => s.hasEverOpened);
  if (!hasEverOpened) return null;
  return <ProductModal />;
}

function formatDatePT(date: Date) {
  const str = date.toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export default function ProdutosPage() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const hasHydrated = useAuthStore((state) => state.hasHydrated);
  const logout = useAuthStore((state) => state.logout);

  function handleLogout() {
    logout();
    router.replace("/login");
  }

  if (!hasHydrated) {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center gap-4 px-4 bg-white text-gray-900"
        aria-live="polite"
        aria-busy="true"
      >
        <div className="flex gap-2">
          <Loader className="animate-spin text-lime-500" />
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 px-4 bg-white text-gray-900">
        <p className="text-gray-600">
          Você precisa estar logado para acessar esta página.
        </p>
        <Link
          href="/login"
          className="text-[#80bc04] font-medium hover:underline"
        >
          Ir para login
        </Link>
      </div>
    );
  }

  const today = formatDatePT(new Date());

  return (
    <div className="min-h-screen bg-white">
      {/* Header: mobile-first, green bar */}
      <header className="bg-[#80bc04] text-white px-3 py-3 md:px-6 md:py-4">
        <div className="flex items-center justify-between gap-2 md:gap-4 w-full max-w-6xl mx-auto">
          {/* Logo */}
          <Link
            href="/produtos"
            className="shrink-0"
            aria-label="Innovation Brindes"
          >
            <Image
              src="/logo-innovation-brindes.png"
              alt="Innovation Brindes"
              width={240}
              height={80}
              className="h-16 w-auto md:h-16 object-contain object-left"
              priority
            />
          </Link>

          {/* Right: notifications + avatar + name/date */}
          <div className="flex items-center gap-2 md:gap-4">
            {/* Notification icons with badges */}
            <div className="flex items-center gap-1 md:gap-2">
              <span className="relative p-1.5 md:p-2 rounded-full hover:bg-white/10 transition">
                <Mail className="size-5 md:size-6" aria-hidden />
                <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] rounded-full bg-[#9fd356] text-white text-xs font-medium flex items-center justify-center px-1">
                  1
                </span>
              </span>
              <span className="relative p-1.5 md:p-2 rounded-full hover:bg-white/10 transition">
                <Phone className="size-5 md:size-6" aria-hidden />
                <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] rounded-full bg-[#9fd356] text-white text-xs font-medium flex items-center justify-center px-1">
                  1
                </span>
              </span>
            </div>

            {/* Avatar + name & date */}
            <div className="flex items-center gap-2 md:gap-3">
              <Image
                src="/clay-elliot.jpg"
                alt=""
                width={50}
                height={50}
                className="size-9 md:size-16 rounded-full object-cover border-6 border-white shrink-0"
              />
              <div className="hidden min-[420px]:block text-left">
                <p className="text-white/90 font-extralight  text-sm md:text-base leading-tight truncate max-w-[120px] md:max-w-[180px]">
                  {user.nome_usuario.trim()}
                </p>
                <p className="text-white/90 text-xs md:text-sm leading-tight">
                  {today}
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main
        id="main-content"
        className="p-4 md:p-8 max-w-6xl mx-auto"
        tabIndex={-1}
      >
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-200 pb-4 mb-6">
          <h1 className="text-xl md:text-2xl font-bold text-gray-800">
            Produtos
          </h1>
          <button
            type="button"
            onClick={handleLogout}
            aria-label="Sair da conta"
            className="cursor-pointer text-sm text-red-600 hover:text-red-700 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-red-600 focus-visible:ring-offset-2 rounded"
          >
            Sair
          </button>
        </div>

        <ProductsSection />
        <LazyProductModal />

        {/* Dados do usuário (resumido) */}
        <section className="mt-10 pt-8 border-t border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Dados do usuário
          </h2>
          <dl className="bg-gray-50 rounded-lg border border-gray-200 divide-y divide-gray-200 overflow-hidden">
            <div className="px-4 py-3 sm:grid sm:grid-cols-3 sm:gap-4">
              <dt className="text-sm font-medium text-gray-500">Nome</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {user.nome_usuario.trim()}
              </dd>
            </div>
            <div className="px-4 py-3 sm:grid sm:grid-cols-3 sm:gap-4">
              <dt className="text-sm font-medium text-gray-500">
                Código do usuário
              </dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {user.codigo_usuario}
              </dd>
            </div>
            <div className="px-4 py-3 sm:grid sm:grid-cols-3 sm:gap-4">
              <dt className="text-sm font-medium text-gray-500">Grupo</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {user.nome_grupo.trim()}
              </dd>
            </div>
            <div className="px-4 py-3 sm:grid sm:grid-cols-3 sm:gap-4">
              <dt className="text-sm font-medium text-gray-500">
                Código do grupo
              </dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {user.codigo_grupo}
              </dd>
            </div>
          </dl>
        </section>
      </main>
    </div>
  );
}
