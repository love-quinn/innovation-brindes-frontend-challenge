import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login",
  description:
    "Acesse sua conta para visualizar os produtos da Innovation Brindes.",
  openGraph: {
    title: "Login | Innovation Brindes",
    description:
      "Acesse sua conta para visualizar os produtos da Innovation Brindes.",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Login | Innovation Brindes",
    description:
      "Acesse sua conta para visualizar os produtos da Innovation Brindes.",
  },
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
