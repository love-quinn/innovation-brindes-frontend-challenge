import { create } from "zustand";

const STORAGE_KEY = "favorites";

function readFromStorage(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw == null) return [];
    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed) && parsed.every((x) => typeof x === "string")
      ? parsed
      : [];
  } catch {
    return [];
  }
}

function writeToStorage(ids: string[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
  } catch {
    // ignore
  }
}

interface FavoritesState {
  favoriteIds: string[];
  isFavorite: (id: string) => boolean;
  toggleFavorite: (id: string) => void;
  setFavorites: (ids: string[]) => void;
  clearFavorites: () => void;
  hydrate: () => void;
}

export const useFavoritesStore = create<FavoritesState>((set, get) => ({
  favoriteIds: [],

  isFavorite: (id) => get().favoriteIds.includes(id),

  toggleFavorite: (id) => {
    set((state) => {
      const next = state.favoriteIds.includes(id)
        ? state.favoriteIds.filter((x) => x !== id)
        : [...state.favoriteIds, id];
      writeToStorage(next);
      return { favoriteIds: next };
    });
  },

  setFavorites: (ids) => {
    const next = [...ids];
    writeToStorage(next);
    set({ favoriteIds: next });
  },

  clearFavorites: () => {
    writeToStorage([]);
    set({ favoriteIds: [] });
  },

  hydrate: () => {
    const ids = readFromStorage();
    set({ favoriteIds: ids });
  },
}));

/*
  Manual test checklist (ETAPA 12):
  1. Favorite 2 items -> reload page -> they still show as favorited (filled heart).
  2. Toggle "Mostrar apenas favoritos" on -> only favorited products appear in the grid.
  3. Unfavorite one item from the filtered view -> it disappears from the list immediately.
  4. With filter on and zero favorites -> empty state shows with message and button to disable filter.
*/
