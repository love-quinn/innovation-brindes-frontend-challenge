import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// ---- mocks (router, service, stores, notifications) ----
const pushSpy = vi.fn();
const replaceSpy = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: pushSpy, replace: replaceSpy }),
}));

const loginRequestSpy = vi.fn();
vi.mock("@/services/auth", () => ({
  loginRequest: (...args: any[]) => loginRequestSpy(...args),
}));

const loginStoreSpy = vi.fn();
vi.mock("@/store/authStore", () => ({
  useAuthStore: (selector: any) =>
    selector({
      isAuthenticated: false,
      login: loginStoreSpy,
    }),
}));

const notifySuccessSpy = vi.fn();
const notifyErrorSpy = vi.fn();
vi.mock("@/hooks/useNotification", () => ({
  useNotification: () => ({
    notifySuccess: notifySuccessSpy,
    notifyError: notifyErrorSpy,
  }),
}));

// IMPORTANT: import after mocks
import LoginPage from "../page";

// ---- helpers ----
function renderWithQuery(ui: React.ReactElement) {
  const client = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return render(<QueryClientProvider client={client}>{ui}</QueryClientProvider>);
}

describe("LoginPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    loginRequestSpy.mockReset();
  });

  it("calls loginRequest when form is submitted with email and senha", async () => {
    const user = userEvent.setup();

    loginRequestSpy.mockResolvedValueOnce({
      status: 1,
      token_de_acesso: "fake-token",
      dados_usuario: { nome_usuario: "Lucas" },
    });

    renderWithQuery(<LoginPage />);

    // Your UI uses "Usuário" and "Senha" (sr-only labels + placeholders)
    const emailInput =
      screen.queryByLabelText(/usuário/i) ??
      screen.getByPlaceholderText(/usuário/i);

    const senhaInput =
      screen.queryByLabelText(/senha/i) ?? screen.getByPlaceholderText(/senha/i);

    await user.type(emailInput, "test@email.com");
    await user.type(senhaInput, "123456");

    await user.click(screen.getByRole("button", { name: /^login$/i }));

    await waitFor(() => {
      expect(loginRequestSpy).toHaveBeenCalledTimes(1);
    });

    expect(loginRequestSpy).toHaveBeenCalledWith({
      email: "test@email.com",
      senha: "123456",
    });

    await waitFor(() => {
      expect(loginStoreSpy).toHaveBeenCalledTimes(1);
      expect(notifySuccessSpy).toHaveBeenCalledWith(
        "Login realizado com sucesso!"
      );
      expect(pushSpy).toHaveBeenCalledWith("/produtos");
    });
  });

  it("shows friendly error when credentials are invalid (status !== 1)", async () => {
    const user = userEvent.setup();

    loginRequestSpy.mockResolvedValueOnce({
      status: 0,
      token_de_acesso: "",
      dados_usuario: null,
    });

    renderWithQuery(<LoginPage />);

    const emailInput =
      screen.queryByLabelText(/usuário/i) ??
      screen.getByPlaceholderText(/usuário/i);
    const senhaInput =
      screen.queryByLabelText(/senha/i) ?? screen.getByPlaceholderText(/senha/i);

    await user.type(emailInput, "wrong@email.com");
    await user.type(senhaInput, "wrong");

    await user.click(screen.getByRole("button", { name: /^login$/i }));

    await waitFor(() => {
      expect(notifyErrorSpy).toHaveBeenCalledWith(
        "Usuário ou senha inválidos. Tente novamente."
      );
    });

    expect(loginStoreSpy).not.toHaveBeenCalled();
    expect(pushSpy).not.toHaveBeenCalled();
  });

  it("shows friendly error on network/server error", async () => {
    const user = userEvent.setup();

    loginRequestSpy.mockRejectedValueOnce(new Error("Network error"));

    renderWithQuery(<LoginPage />);

    const emailInput =
      screen.queryByLabelText(/usuário/i) ??
      screen.getByPlaceholderText(/usuário/i);
    const senhaInput =
      screen.queryByLabelText(/senha/i) ?? screen.getByPlaceholderText(/senha/i);

    await user.type(emailInput, "test@email.com");
    await user.type(senhaInput, "123456");

    await user.click(screen.getByRole("button", { name: /^login$/i }));

    await waitFor(() => {
      expect(notifyErrorSpy).toHaveBeenCalledWith(
        "Não foi possível conectar. Verifique sua internet e tente novamente."
      );
    });

    expect(loginStoreSpy).not.toHaveBeenCalled();
    expect(pushSpy).not.toHaveBeenCalled();
  });
});