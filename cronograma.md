# Cronograma - Boss Raid API de Produção

## 📋 Visão Geral

| Marco | Previsão | Status |
|-------|----------|--------|
| Setup do Projeto | Sprint 1 | ✅ Concluído |
| Autenticação & Usuários | Sprint 1 | ✅ Concluído |
| Gestão de Quests | Sprint 2 | ⏳ Pendente |
| Gestão de Bosses | Sprint 2 | ⏳ Pendente |
| Sistema de Raid | Sprint 3 | ⏳ Pendente |
| Testes & Finalização | Sprint 3 | ⏳ Pendente |

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
- [ ] `IQuestRepository` (interface)
- [ ] `QuestService` — create, list (paginado), getById, update, delete, complete
- [ ] `InMemoryQuestRepository` (fake para testes)
- [ ] `PrismaQuestRepository`
- [ ] Testes unitários do `QuestService` (TDD)
- [ ] Schemas Zod de validação
- [ ] `quest.routes.ts` — CRUD completo com paginação

### 2.2 Gestão de Bosses
- [ ] `IBossRepository` (interface)
- [ ] `BossService` — create, list (paginado), getById, update, delete
- [ ] `InMemoryBossRepository` (fake para testes)
- [ ] `PrismaBossRepository`
- [ ] Testes unitários do `BossService` (TDD)
- [ ] Schemas Zod de validação
- [ ] `boss.routes.ts` — CRUD completo com paginação

---

## Sprint 3 — Lógica Central & Finalização

### 3.1 Sistema de Raid
- [ ] `IRaidRepository` (interface)
- [ ] `RaidService` — iniciar raid, entrar na raid, atacar boss, finalizar raid, calcular XP/recompensas
- [ ] `InMemoryRaidRepository` (fake para testes)
- [ ] `PrismaRaidRepository`
- [ ] Testes unitários do `RaidService` (TDD) — casos de borda, valores limite
- [ ] Schemas Zod de validação
- [ ] `raid.routes.ts` — POST /raids, POST /raids/:id/join, POST /raids/:id/attack, GET /raids/:id

### 3.2 Testes Finais & Qualidade
- [ ] Revisão de cobertura de testes em todos os Services
- [ ] Testes de partição de equivalência e análise de valor limite
- [ ] Verificação de contratos REST (status codes corretos)
- [ ] Lint / verificação de tipos

### 3.3 Polimento
- [ ] Seed do banco com dados iniciais (prisma/seed.ts)
- [ ] README.md com instruções de setup e endpoints
- [x] Git: branches `feat/`, commits conventional em português
- [x] Rebase interativo para histórico linear

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
  quest Quest @relation(fields: [questId], references: [id])

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

  boss         Boss              @relation(fields: [bossId], references: [id])
  participants RaidParticipant[]
}

model RaidParticipant {
  id        String   @id @default(uuid())
  raidId    String
  userId    String
  damage    Int      @default(0)
  joinedAt  DateTime @default(now())

  raid Raid @relation(fields: [raidId], references: [id])
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
| GET | `/quests` | 200 | Listar quests (paginado) |
| POST | `/quests` | 201 | Criar quest (admin) |
| GET | `/quests/:id` | 200 | Detalhe da quest |
| PUT | `/quests/:id` | 200 | Atualizar quest (admin) |
| DELETE | `/quests/:id` | 204 | Remover quest (admin) |
| POST | `/quests/:id/complete` | 200 | Completar quest |
| GET | `/bosses` | 200 | Listar bosses (paginado) |
| POST | `/bosses` | 201 | Criar boss (admin) |
| GET | `/bosses/:id` | 200 | Detalhe do boss |
| PUT | `/bosses/:id` | 200 | Atualizar boss (admin) |
| DELETE | `/bosses/:id` | 204 | Remover boss (admin) |
| POST | `/raids` | 201 | Iniciar raid contra um boss |
| POST | `/raids/:id/join` | 200 | Entrar em uma raid |
| POST | `/raids/:id/attack` | 200 | Atacar o boss na raid |
| GET | `/raids/:id` | 200 | Status da raid |

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
