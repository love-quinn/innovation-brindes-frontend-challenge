import { test, expect, type Route } from "@playwright/test";

const mockLoginResponse = {
  status: 1,
  message: "OK",
  token_de_acesso: "token-e2e",
  dados_usuario: {
    codigo_usuario: "1",
    nome_usuario: "E2E User",
    codigo_grupo: "1",
    nome_grupo: "Grupo",
  },
};

const mockProductsResponse = [
  {
    codigo: "E2E-001",
    nome: "Produto E2E",
    referencia: "REF",
    codigo_categoria: "1",
    imagem: "https://imgprodutos.s3.us-east-2.amazonaws.com/test.jpg",
    preco: "10,00",
    descricao: "Descrição do produto.",
  },
];

test.describe("Login → Produtos (smoke)", () => {
  test("login with valid credentials redirects to /produtos and shows product grid", async ({
    page,
  }) => {
    await page.route("**/login/acessar", (route: Route) =>
      route.fulfill({ status: 200, body: JSON.stringify(mockLoginResponse) })
    );
    await page.route("**/produtos/listar", (route: Route) =>
      route.fulfill({ status: 200, body: JSON.stringify(mockProductsResponse) })
    );

    await page.goto("/login");

    await page.getByPlaceholder("Usuário").fill("dinamica");
    await page.getByPlaceholder("Senha").fill("123");
    await page.getByRole("button", { name: /login/i }).click();

    await expect(page).toHaveURL(/\/produtos/);
    await expect(page.getByRole("heading", { name: /produtos/i })).toBeVisible();

    const confiraButtons = page.getByRole("button", { name: /confira/i });
    await expect(confiraButtons.first()).toBeVisible({ timeout: 10000 });
  });
});
