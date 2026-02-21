"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/store/authStore";

export default function AuthInitializer() {
  const loadFromStorage = useAuthStore(
    (state) => state.loadFromStorage
  );

  useEffect(() => {
    loadFromStorage();
  }, [loadFromStorage]);

  return null;
}