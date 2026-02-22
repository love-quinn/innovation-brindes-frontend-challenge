# Lighthouse ETAPA 15 – Checklist (Desktop)

Objetivo: **Performance ≥ 90** e **Accessibility ≥ 90** no Lighthouse (Desktop).

## Como rodar o Lighthouse

1. **Build de produção**
   ```bash
   npm run build
   npm run start
   ```

2. **Abrir no Chrome**
   - Abra `http://localhost:3000` (ou a URL do deploy).
   - Faça login em `/login` para poder acessar `/produtos`.

3. **Abrir DevTools**
   - `F12` ou `Ctrl+Shift+I` (Windows/Linux) / `Cmd+Option+I` (Mac).
   - Aba **Lighthouse**.

4. **Configurar e rodar**
   - **Mode:** Navigation.
   - **Device:** Desktop (não Mobile).
   - Categorias: marque **Performance** e **Accessibility**.
   - Clique em **Analyze page load**.

5. **Páginas para testar**
   - **Login:** `http://localhost:3000/login`
   - **Produtos:** `http://localhost:3000/produtos` (com usuário logado).

## Checklist rápido (antes de rodar)

### Performance
- [ ] Imagens com `sizes` e dimensões estáveis (evitar CLS).
- [ ] Modal carregado com `next/dynamic` (ssr: false).
- [ ] React Query com `staleTime`/`retry` configurados (evitar refetch em excesso).
- [ ] Sem JS desnecessário em componentes server quando possível.

### Accessibility
- [ ] Link “Pular para o conteúdo” visível ao receber foco.
- [ ] `<main id="main-content">` presente na página de produtos.
- [ ] Inputs com `<label>` ou `aria-label` e `id` onde aplicável.
- [ ] Botões com nome acessível e `focus-visible` (anel de foco).
- [ ] Mensagens de erro com `role="alert"` ou `aria-live="polite"`.
- [ ] Imagens com `alt` (ou `alt=""` se decorativas).
- [ ] Ícones decorativos com `aria-hidden="true"`.
- [ ] Modal com título/descrição (aria-labelledby/describedby), focus trap e retorno de foco.
- [ ] `lang="pt-BR"` no `<html>`.

## O que capturar para o README

Após rodar o Lighthouse em Desktop:

1. **Performance (≥ 90)**
   - Screenshot do score (círculo de Performance).
   - Opcional: screenshot da seção “Opportunities” se houver itens relevantes.

2. **Accessibility (≥ 90)**
   - Screenshot do score (círculo de Accessibility).
   - Opcional: screenshot da seção “Passed audits” ou de algum item que foi corrigido.

3. **Onde colocar**
   - Ex.: seção “Lighthouse (ETAPA 15)” no README com as duas imagens e legenda:
     - `![Lighthouse Performance](docs/lighthouse-performance-desktop.png)`
     - `![Lighthouse Accessibility](docs/lighthouse-accessibility-desktop.png)`

## Melhorias implementadas (ETAPA 15)

- Skip-to-content no layout raiz.
- `main#main-content` e `tabIndex={-1}` na página de produtos.
- Labels/aria-label e ids nos inputs (login e busca).
- `aria-live="polite"` na região de erro do login.
- `focus-visible` em botões e inputs (login, produtos, cards, modal).
- Imagens com `sizes` e container com aspect-ratio/min-height para reduzir CLS.
- Ícones decorativos e “Cores” com `aria-hidden`; box decorativo com `alt=""`.
- Modal: retorno de foco ao botão “CONFIRA” ao fechar; `data-autofocus` no botão Fechar.
- ProductModal carregado com `next/dynamic(..., { ssr: false })`.
- Store do modal com `returnFocusElement` para restaurar foco no fechamento.
