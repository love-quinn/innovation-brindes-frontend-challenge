import { create } from "zustand";
import type { Product } from "@/services/products";

interface ProductModalState {
  isOpen: boolean;
  product: Product | null;
  returnFocusElement: HTMLElement | null;
  open: (product: Product, triggerElement?: HTMLElement | null) => void;
  close: () => void;
}

export const useProductModalStore = create<ProductModalState>((set, get) => ({
  isOpen: false,
  product: null,
  returnFocusElement: null,
  open: (product, triggerElement) =>
    set({ isOpen: true, product, returnFocusElement: triggerElement ?? null }),
  close: () => {
    const el = get().returnFocusElement;
    set({ isOpen: false, product: null, returnFocusElement: null });
    if (typeof requestAnimationFrame !== "undefined" && el?.focus) {
      requestAnimationFrame(() => el.focus());
    }
  },
}));
