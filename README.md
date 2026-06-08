# Boss Raid API de Produção

API REST de produção para o desafio Boss Raid. Gerenciamento de usuários, quests, bosses e raids com autenticação JWT, paginação e clean architecture.

## Stack

- **Runtime:** Node.js + TypeScript (strict mode)
- **Framework:** Fastify
- **ORM:** Prisma + PostgreSQL
- **Validação:** Zod
- **Testes:** Vitest

## Pré-requisitos

- Node.js 20+
- Docker (para PostgreSQL)
- npm

## Setup

```bash
# 1. Instalar dependências
npm install

# 2. Subir PostgreSQL
docker-compose up -d

# 3. Rodar migration
npx prisma migrate dev

# 4. Seed do banco
npm run prisma:seed

# 5. Iniciar servidor
npm run dev
```

Servidor roda em `http://localhost:3000`.

## Credenciais do Seed

| Tipo | Email | Senha |
|------|-------|-------|
| Admin | admin@bossraid.com | admin123 |
| Player | player@bossraid.com | player123 |

## Testes

```bash
npm test
```

32 testes unitários nos serviços com TDD (Red → Green → Refactor).

## Endpoints

### Autenticação

| Método | Rota | Auth | Descrição |
|--------|------|------|-----------|
| POST | `/auth/register` | ❌ | Criar conta |
| POST | `/auth/login` | ❌ | Login (retorna JWT) |

**POST /auth/register**
```json
{
  "email": "player@email.com",
  "password": "123456",
  "nickname": "Player"
}
```

**POST /auth/login**
```json
{
  "email": "player@email.com",
  "password": "123456"
}
```

### Usuários

| Método | Rota | Auth | Descrição |
|--------|------|------|-----------|
| GET | `/users/:id` | ✅ | Perfil do usuário |
| PUT | `/users/:id` | ✅ | Atualizar perfil |

### Quests

| Método | Rota | Auth | Descrição |
|--------|------|------|-----------|
| GET | `/quests?page=1&limit=10` | ❌ | Listar (paginado) |
| GET | `/quests/:id` | ❌ | Detalhe |
| POST | `/quests` | ✅ | Criar |
| PUT | `/quests/:id` | ✅ | Atualizar |
| DELETE | `/quests/:id` | ✅ | Remover |
| POST | `/quests/:id/complete` | ✅ | Completar (ganha XP) |

### Bosses

| Método | Rota | Auth | Descrição |
|--------|------|------|-----------|
| GET | `/bosses?page=1&limit=10` | ❌ | Listar (paginado) |
| GET | `/bosses/:id` | ❌ | Detalhe |
| POST | `/bosses` | ✅ | Criar |
| PUT | `/bosses/:id` | ✅ | Atualizar |
| DELETE | `/bosses/:id` | ✅ | Remover |

### Raids

| Método | Rota | Auth | Descrição |
|--------|------|------|-----------|
| POST | `/raids` | ✅ | Iniciar raid contra um boss |
| POST | `/raids/:id/join` | ✅ | Entrar em uma raid |
| POST | `/raids/:id/attack` | ✅ | Atacar o boss |
| GET | `/raids/:id` | ✅ | Status da raid |

## Arquitetura

```
src/
├── routes/          # Fastify routes (validação Zod)
├── services/        # Regras de negócio (testadas)
├── repositories/    # Prisma + InMemory (fakes)
├── interfaces/      # Contratos dos repositórios
├── plugins/         # Paginação, Autenticação JWT
├── schemas/         # Schemas Zod
├── lib/             # PrismaClient, JWT utils
└── app.ts           # Bootstrap Fastify
```

Clean Architecture com 3 camadas: **Rotas** → **Services** → **Repositories**.
