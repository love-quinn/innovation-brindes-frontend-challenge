import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { ProductCard } from "../ProductCard";
import type { Product } from "@/services/products";

// ---- spies you may want to assert later
const openSpy = vi.fn();
const toggleFavoriteSpy = vi.fn();

// next/image mock: accept any props
vi.mock("next/image", () => ({
  default: (props: any) => {
    const { src, alt, ...rest } = props;
    // next/image sometimes passes src as object; ensure string
    const resolvedSrc = typeof src === "string" ? src : src?.src ?? "";
    return <img src={resolvedSrc} alt={alt ?? ""} {...rest} />;
  },
}));

vi.mock("@/store/productModalStore", () => ({
  useProductModalStore: (selector: any) => selector({ open: openSpy, hasEverOpened: false }),
}));

vi.mock("@/store/favoritesStore", () => ({
  useFavoritesStore: (selector: any) =>
    selector({
      isFavorite: () => false,
      toggleFavorite: toggleFavoriteSpy,
    }),
}));

const mockProduct: Product = {
  codigo: "PROD-001",
  nome: "Caneta Personalizada",
  referencia: "REF-001",
  codigo_categoria: "1",
  imagem: "https://example.com/caneta.jpg",
  preco: "15.90",
  descricao: "Caneta de alta qualidade para brindes.",
};

describe("ProductCard", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders product name", () => {
    render(<ProductCard product={mockProduct} />);
    expect(screen.getByText("Caneta Personalizada")).toBeInTheDocument();
  });

  it("renders CONFIRA button", () => {
    render(<ProductCard product={mockProduct} />);
    expect(screen.getByRole("button", { name: /confira/i })).toBeInTheDocument();
  });

  it("shows formatted price when preco > 0", () => {
    render(<ProductCard product={mockProduct} />);
    // currency output may contain NBSP, so match flexibly:
    expect(screen.getByText(/R\$\s*15,90/)).toBeInTheDocument();
  });

  it("does not show price block when preco is 0", () => {
    render(<ProductCard product={{ ...mockProduct, preco: "0" }} />);
    expect(screen.queryByText(/gerado pela melhor oferta/i)).not.toBeInTheDocument();
  });
});