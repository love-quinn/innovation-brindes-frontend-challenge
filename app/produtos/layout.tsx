import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Produtos",
  description:
    "Explore a listagem de produtos e encontre brindes personalizados.",
  openGraph: {
    title: "Produtos | Innovation Brindes",
    description:
      "Explore a listagem de produtos e encontre brindes personalizados.",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Produtos | Innovation Brindes",
    description:
      "Explore a listagem de produtos e encontre brindes personalizados.",
  },
};

export default function ProdutosLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
