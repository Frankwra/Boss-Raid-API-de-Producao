# Cronograma - Boss Raid API de Produção

## 📋 Visão Geral

| Marco | Previsão | Status |
|-------|----------|--------|
| Setup do Projeto | Sprint 1 | ✅ Concluído |
| Autenticação & Usuários | Sprint 1 | ✅ Concluído |
| Gestão de Quests | Sprint 2 | ✅ Concluído |
| Gestão de Bosses | Sprint 2 | ✅ Concluído |
| Sistema de Raid | Sprint 3 | ✅ Concluído |
| Testes & Finalização | Sprint 3 | ✅ Concluído |
| Frontend Visual | Sprint 4 | ✅ Concluído |

---

## Sprint 1 — Fundação

### 1.1 Setup do Projeto
- [x] `package.json` com dependências (fastify, prisma, zod, vitest, tsx, etc.)
- [x] `tsconfig.json` (strict mode, sem `any`)
- [x] `docker-compose.yml` (PostgreSQL)
- [x] `.env` / `.env.example` (DATABASE_URL, JWT_SECRET, PORT)
- [x] `vitest.config.ts`
- [x] `prisma/schema.prisma` — Modelos: `User`, `Quest`, `Boss`, `Raid`, `RaidParticipant`, `PlayerQuest`
- [x] `npx prisma migrate dev` + seed inicial
- [x] Estrutura de pastas: `src/{routes,services,repositories,interfaces,plugins,schemas,lib}`
- [x] Fastify app bootstrap + error handler global (500)
- [x] Plugin de paginação

### 1.2 Autenticação & Usuários
- [x] `IUserRepository` (interface)
- [x] `UserService` — register, login, getProfile, updateProfile
- [x] `InMemoryUserRepository` (fake para testes)
- [x] `PrismaUserRepository`
- [x] Testes unitários do `UserService` (TDD — 9 testes passando)
- [x] Schemas Zod: `register.schema.ts`, `login.schema.ts`
- [x] `auth.routes.ts` — POST /auth/register, POST /auth/login
- [x] `user.routes.ts` — GET /users/:id, PUT /users/:id (protegidas)
- [x] Plugin JWT — middleware de autenticação

---

## Sprint 2 — Entidades do Jogo

### 2.1 Gestão de Quests
- [x] `IQuestRepository` (interface)
- [x] `QuestService` — create, list (paginado), getById, update, delete, complete
- [x] `InMemoryQuestRepository` (fake para testes)
- [x] `PrismaQuestRepository`
- [x] Testes unitários do `QuestService` (TDD — 10 testes)
- [x] Schemas Zod de validação
- [x] `quest.routes.ts` — CRUD completo com paginação

### 2.2 Gestão de Bosses
- [x] `IBossRepository` (interface)
- [x] `BossService` — create, list (paginado), getById, update, delete
- [x] `InMemoryBossRepository` (fake para testes)
- [x] `PrismaBossRepository`
- [x] Testes unitários do `BossService` (TDD — 7 testes)
- [x] Schemas Zod de validação
- [x] `boss.routes.ts` — CRUD completo com paginação

---

## Sprint 3 — Lógica Central & Finalização

### 3.1 Sistema de Raid
- [x] `IRaidRepository` (interface)
- [x] `RaidService` — criar raid, entrar, atacar, derrotar boss, calcular XP
- [x] `InMemoryRaidRepository` (fake para testes)
- [x] `PrismaRaidRepository`
- [x] Testes unitários do `RaidService` (TDD — 6 testes)
- [x] Schemas Zod de validação
- [x] `raid.routes.ts` — POST /raids, POST /raids/:id/join, POST /raids/:id/attack, GET /raids/:id

### 3.2 Testes Finais & Qualidade
- [x] Revisão de cobertura de testes em todos os Services
- [x] Testes de partição de equivalência e análise de valor limite
- [x] Verificação de contratos REST (status codes corretos)
- [x] 32 testes passando em 4 arquivos

### 3.3 Polimento
- [x] Seed do banco com dados iniciais (prisma/seed.ts)
- [x] README.md com instruções de setup e endpoints
- [x] Git: branches `feat/`, commits conventional em português
- [x] Rebase interativo para histórico linear

---

## Sprint 4 — Frontend Visual

### 4.1 Frontend HTML/JS
- [x] Servir `public/index.html` via `@fastify/static` (mesma origem, sem CORS)
- [x] `apiFetch` wrapper com auto Bearer token e log
- [x] `AppStore` class para estado reativo com subscribe
- [x] Sidebar Dashboard com: Auth, Profile, Quests, Bosses, Raids, Testes
- [x] Recursos ocultos até login (`#recursos-section` toggle)
- [x] Card grid layout com hover effects e action buttons
- [x] Modal overlay reutilizável com backdrop blur
- [x] Paginação visual (prev/next + "Página X de Y")
- [x] Busca/filtro client-side em quests e bosses
- [x] Sidebar responsivo com hamburger menu
- [x] Tema claro/escuro com persistência
- [x] Exportar log como .txt
- [x] Copiar token JWT (clipboard API)
- [x] Toast notifications (success/error/info)
- [x] Suite de testes visuais (19 testes, todos endpoints)

### 4.2 Correções e Melhorias
- [x] `completedQuests` persistido em localStorage
- [x] Endpoint `GET /quests/completed?userId=X` para sincronizar status
- [x] Retry login ao recarregar: fetch completed quests automaticamente
- [x] Quest já completada: trata 409 como sucesso no frontend
- [x] Quest concluída: botão "Editar" oculto no card
- [x] Quest concluída: botão "Completar" oculto no modal de visualização
- [x] `onDelete: Cascade` nas relações Prisma (PlayerQuest, Raid, RaidParticipant)
- [x] `apiFetch` não envia `Content-Type` em requisições sem body
- [x] Ordem de declaração corrigida: `completedQuests` antes de `store.subscribe`

---

## Entidades do Domínio (Modelos Prisma)

```prisma
model User {
  id        String   @id @default(uuid())
  email     String   @unique
  password  String
  nickname  String
  avatar    String?
  xp        Int      @default(0)
  level     Int      @default(1)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  quests       PlayerQuest[]
  participants RaidParticipant[]
}

model Quest {
  id          String   @id @default(uuid())
  title       String
  description String
  difficulty  Int      // 1-5
  xpReward    Int
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  players PlayerQuest[]
}

model PlayerQuest {
  id        String   @id @default(uuid())
  completed Boolean  @default(false)
  userId    String
  questId   String
  createdAt DateTime @default(now())

  user  User  @relation(fields: [userId], references: [id])
  quest Quest @relation(fields: [questId], references: [id], onDelete: Cascade)

  @@unique([userId, questId])
}

model Boss {
  id          String   @id @default(uuid())
  name        String
  hp          Int      // Hit points total
  damage      Int      // Dano por turno
  xpReward    Int
  levelRequired Int    @default(1)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  raids Raid[]
}

model Raid {
  id        String   @id @default(uuid())
  bossId    String
  status    String   @default("open")  // open, in_progress, completed, failed
  currentHp Int
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  boss         Boss              @relation(fields: [bossId], references: [id], onDelete: Cascade)
  participants RaidParticipant[]
}

model RaidParticipant {
  id       String   @id @default(uuid())
  raidId   String
  userId   String
  damage   Int      @default(0)
  joinedAt DateTime @default(now())

  raid Raid @relation(fields: [raidId], references: [id], onDelete: Cascade)
  user User @relation(fields: [userId], references: [id])

  @@unique([raidId, userId])
}
```

---

## Contratos REST (Endpoints)

| Método | Rota | Status Code | Descrição |
|--------|------|-------------|-----------|
| POST | `/auth/register` | 201 | Criar conta | ✅ |
| POST | `/auth/login` | 200 | Login (retorna JWT) | ✅ |
| GET | `/users/:id` | 200 | Perfil do usuário | ✅ |
| PUT | `/users/:id` | 200 | Atualizar perfil | ✅ |
| GET | `/quests` | 200 | Listar quests (paginado) | ✅ |
| POST | `/quests` | 201 | Criar quest (admin) | ✅ |
| GET | `/quests/:id` | 200 | Detalhe da quest | ✅ |
| PUT | `/quests/:id` | 200 | Atualizar quest (admin) | ✅ |
| DELETE | `/quests/:id` | 204 | Remover quest (admin) | ✅ |
| POST | `/quests/:id/complete` | 200 | Completar quest | ✅ |
| GET | `/quests/completed` | 200 | IDs das quests completadas pelo usuário | ✅ |
| GET | `/bosses` | 200 | Listar bosses (paginado) | ✅ |
| POST | `/bosses` | 201 | Criar boss (admin) | ✅ |
| GET | `/bosses/:id` | 200 | Detalhe do boss | ✅ |
| PUT | `/bosses/:id` | 200 | Atualizar boss (admin) | ✅ |
| DELETE | `/bosses/:id` | 204 | Remover boss (admin) | ✅ |
| POST | `/raids` | 201 | Iniciar raid contra um boss | ✅ |
| POST | `/raids/:id/join` | 200 | Entrar em uma raid | ✅ |
| POST | `/raids/:id/attack` | 200 | Atacar o boss na raid | ✅ |
| GET | `/raids/:id` | 200 | Status da raid | ✅ |

---

## Sessão OpenCode

Para retomar esta sessão no futuro, use o comando abaixo no PowerShell:

```powershell
opencode -s ses_15b9b52b6ffeHT0WkpQxH993NU
```

---

## Setup Inicial (Comandos)

```bash
# Inicializar projeto
npm init -y
npm install fastify @prisma/client zod jsonwebtoken bcryptjs dotenv
npm install -D typescript prisma vitest @types/node @types/jsonwebtoken @types/bcryptjs tsx

# Inicializar TypeScript
npx tsc --init

# Inicializar Prisma
npx prisma init
```
