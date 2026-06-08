# Cronograma — Frontend de Teste da API

## Objetivo
Criar uma interface HTML/JS simples para testar todos os endpoints da API Boss Raid.

## Funcionalidades por Módulo

### 1. Autenticação
- [x] Formulário de **Login** (POST /auth/login) — salvar token JWT
- [x] Formulário de **Cadastro** (POST /auth/register)
- [x] Exibir token recebido e dados do usuário
- [x] Botão para **copiar token** (ícone de cópia na navbar ao lado do email)
- [x] Botão de **limpar sessão** (logout)

### 2. Usuários
- [x] **Buscar perfil** (GET /users/:id) — usa ID do usuário logado
- [x] **Atualizar perfil** (PUT /users/:id) — campos nickname e avatar
- [x] Exibir dados do usuário (nickname, email, level, XP, role)

### 3. Quests
- [x] **Listar quests** (GET /quests) — card grid com badges
- [x] **Buscar quest por ID** (GET /quests/:id) — modal de visualização
- [x] **Criar quest** (POST /quests) — via modal overlay
- [x] **Atualizar quest** (PUT /quests/:id) — via modal overlay (bloqueado se concluída)
- [x] **Deletar quest** (DELETE /quests/:id) — com confirmação
- [x] **Completar quest** (POST /quests/:id/complete) — informar userId no modal
- [x] Status de conclusão persistido via `localStorage` e endpoint `GET /quests/completed`
- [x] Botão "Completar" oculto no modal de visualização se já concluída

### 4. Bosses
- [x] **Listar bosses** (GET /bosses) — card grid com badges
- [x] **Buscar boss por ID** (GET /bosses/:id) — modal de visualização com stats
- [x] **Criar boss** (POST /bosses) — via modal overlay
- [x] **Atualizar boss** (PUT /bosses/:id) — via modal overlay
- [x] **Deletar boss** (DELETE /bosses/:id) — com confirmação

### 5. Raids
- [x] **Criar raid** (POST /raids) — modal com `<select>` dos bosses disponíveis
- [x] **Entrar na raid** (POST /raids/:id/join) — botão no painel da raid
- [x] **Atacar boss** (POST /raids/:id/attack) — botão no painel da raid
- [x] **Status da raid** (GET /raids/:id) — exibe HP, participantes, ações
- [x] **Listar raids** (GET /raids) — card grid com status e nº de participantes

### 6. Testes da API
- [x] Suite visual de 19 testes automatizados (página "Testes" no sidebar)
- [x] Testa todos os endpoints: Auth, Perfil, Quests, Bosses, Raids
- [x] Botão "Executar Todos" com progresso sequencial
- [x] Resultados coloridos (verde/vermelho) com preview JSON

### 7. Interface Geral
- [x] Layout responsivo com card grid (auto-fill, min 280px)
- [x] Seção de **Log** mostrando requests e responses em tempo real (cores semânticas)
- [x] **Toast notifications** para feedback (success/error/info)
- [x] Indicador de **token ativo** (navbar exibe email + role do usuário logado)
- [x] **Sidebar com recursos ocultos** até autenticação
- [x] URL base configurável (modal gear icon)
- [x] CSS polido: glass-effect, gradientes, backdrop-blur, scrollbar customizada
- [x] Modal overlay reutilizável para criar/editar/visualizar (com backdrop fechar)
- [x] Tema claro/escuro com toggle persistido em localStorage
- [x] Exportar log como arquivo .txt com data no nome

---

## Observações

- Frontend é um único arquivo HTML (`public/index.html`) com Tailwind CDN + JS vanilla
- Consome a API via `fetch` com wrapper `apiFetch()` que gerencia token e erros
- Token JWT armazenado em `localStorage` (chave `bossraid_token`)
- Servido via `@fastify/static` na mesma origem da API (`http://localhost:3001`) — sem CORS
- `AppStore` class para estado reativo com `subscribe()` executando callback imediatamente
- Log interativo com cores: verde (2xx), azul (3xx), amarelo (4xx), vermelho (5xx)
- Layout Dashboard com menu lateral que esconde recursos até login
- Modo **read-only**: sidebar sem recursos quando deslogado; recursos aparecem ao autenticar
- Card grid com `grid-template-columns: repeat(auto-fill, minmax(280px, 1fr))`
- Modal overlay com backdrop blur, fecha ao clicar fora
- Quest concluída: botão "Editar" oculto no card e "Completar" oculto no modal

## Bugs Corrigidos

- Autofill CSS: `-webkit-autofill` override para manter tema escuro
- Auth submit: detecta login vs register pelo texto do botão
- API response fields: `GET /users/:id` retorna objeto direto (não `{user}`); `GET /quests` retorna `{data, meta}` (não `{quests}`)
- Descrição de quest: valida mínimo 10 caracteres (Zod)
- Erros silenciosos: agora exibem toast com detalhes de validação (campo + mensagem)
- Raid schema: `bossId` aceita string (não UUID) para compatibilidade com seed `boss-001`
- Raid repository: `findAll` inclui boss e participantes
- Raid route: adicionada rota `GET /raids` (listagem)
- Quest complete: `userId` enviado como string (não Number) para compatibilidade com UUID
- Store subscribe: executa callback imediatamente ao registrar (sidebar oculta sem token)
- DELETE quest/boss: adicionado `onDelete: Cascade` no Prisma para evitar FK violation
- `apiFetch` Content-Type: só enviado quando há body (DELETE sem body funcionava)
- `completedQuests`: movido para antes do `store.subscribe` (evita ReferenceError)
- Quest já completada: trata 409 como sucesso (marca como completa no frontend)
- `fetchCompletedQuests`: encapsulado em try/catch para não quebrar login

## Melhorias pós-checklist

- Card grid layout para listas (resource-card com hover e card-actions)
- Modal overlay genérico reutilizável (showFormModal/hideFormModal)
- Recursos da sidebar ocultos até login (`#recursos-section` com classe `hidden`)
- Select de bosses ao criar raid (busca `GET /bosses` e popula `<select>`)
- Stat boxes com ícones e gradientes
- Botão copiar token na navbar (navigator.clipboard.writeText)
- Paginação visual nas listas (quests/bosses/raids com page/prev/next + "Página X de Y")
- Modal de confirmação visual para exclusões (showConfirmModal substitui confirm())
- Status de raid mais descritivo: "Aberta", "Em Andamento", "Derrotado"
- Busca/filtro nas listas de quests e bosses (campo de texto com filtro client-side)
- Sidebar responsivo com overlay em mobile (hamburger menu + backdrop + slide transition)
- Exportar log como arquivo .txt (botão ao lado do limpar log)
- Tema claro/escuro (toggle lua/sol na navbar, persistido em localStorage)
- Botão "Completar" oculto no modal de visualização se quest já concluída
- Botão "Editar" oculto no card de quest concluída
- Suite de testes visuais para todos os endpoints da API
- Endpoint `GET /quests/completed?userId=X` para sincronizar status ao logar
- Quest concluída: `onSubmit` null esconde botão "Salvar" no modal

## Arquitetura do Frontend

```
public/
  index.html          # Único arquivo HTML com Tailwind CDN (~1100 linhas)
                        ├── Navbar (token status + email + role)
                        ├── Sidebar (navegação, recursos ocultos até login)
                        ├── Content Area (card grids + modals)
                        └── Log Panel (requests/responses com cores)

Servido por Fastify via @fastify/static
→ http://localhost:3001/
```

## Setup

```bash
npm install @fastify/static
```

## Próximos passos sugeridos

- (todos implementados — ver lista acima)
