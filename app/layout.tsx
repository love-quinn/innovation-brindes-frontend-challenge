import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import AuthInitializer from "@/components/AuthInitializer";
import ReactQueryProvider from "@/providers/ReactQueryProvider";
import { ToastContainer } from "react-toastify";
import { SkipToContent } from "@/components/SkipToContent";

const poppins = Poppins({
    weight: ["200", "400", "500", "600", "700"],
    subsets: ["latin"],
    display: "swap",
  });

export const metadata: Metadata = {
  title: {
    default: "Innovation Brindes",
    template: "%s | Innovation Brindes",
  },
  description: "Mini aplicação para listagem de produtos",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <head>
        <link rel="preconnect" href="https://imgprodutos.s3.us-east-2.amazonaws.com" />
        <link rel="dns-prefetch" href="https://imgprodutos.s3.us-east-2.amazonaws.com" />
      </head>
      <body
        className={`${poppins.className} antialiased bg-white`}
      >
        <SkipToContent />
        <ReactQueryProvider>
            <ToastContainer aria-label="Toast Notifications" />
            <AuthInitializer />
            {children}
            </ReactQueryProvider>
      </body>
    </html>
  );
}
