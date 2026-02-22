import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import AuthInitializer from "@/components/AuthInitializer";
import ReactQueryProvider from "@/providers/ReactQueryProvider";
import { ToastContainer } from "react-toastify";

const poppins = Poppins({
    weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
    subsets: ["latin"],
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
      <body
        className={`$${poppins.className} antialiased bg-white`}
      >
        <ReactQueryProvider>
            <ToastContainer aria-label="Toast Notifications" />
            <AuthInitializer />
            {children}
            </ReactQueryProvider>
      </body>
    </html>
  );
}
