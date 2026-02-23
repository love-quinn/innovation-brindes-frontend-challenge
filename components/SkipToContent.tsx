"use client";

/**
 * Skip link for accessibility (Lighthouse ETAPA 15).
 * Off-screen until focused, then visible top-left; links to #main-content.
 */
export function SkipToContent() {
  return (
    <a
      href="#main-content"
      className="absolute left-[-9999px] top-4 z-[100] px-4 py-2 bg-[#80bc04] text-white rounded-md font-medium focus:left-4 focus:top-4 focus:z-[100] focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-900"
    >
      Pular para o conteúdo principal
    </a>
  );
}
