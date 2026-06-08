import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

async function main() {
  const adminPassword = await bcrypt.hash("admin123", 10)

  const admin = await prisma.user.upsert({
    where: { email: "admin@bossraid.com" },
    update: {},
    create: {
      email: "admin@bossraid.com",
      password: adminPassword,
      nickname: "Admin",
      role: "admin",
      xp: 0,
      level: 1,
    },
  })

  const playerPassword = await bcrypt.hash("player123", 10)

  const player = await prisma.user.upsert({
    where: { email: "player@bossraid.com" },
    update: {},
    create: {
      email: "player@bossraid.com",
      password: playerPassword,
      nickname: "Player1",
      role: "player",
      xp: 0,
      level: 1,
    },
  })

  const quests = await Promise.all([
    prisma.quest.upsert({
      where: { id: "quest-001" },
      update: {},
      create: {
        id: "quest-001",
        title: "Derrote o Goblin",
        description: "Vá até a floresta negra e derrote o goblin chefe que está aterrorizando os viajantes.",
        difficulty: 1,
        xpReward: 50,
      },
    }),
    prisma.quest.upsert({
      where: { id: "quest-002" },
      update: {},
      create: {
        id: "quest-002",
        title: "Colete Ervas Raras",
        description: "Explore a caverna sombria e colete 5 ervas raras para o alquimista da vila.",
        difficulty: 2,
        xpReward: 100,
      },
    }),
    prisma.quest.upsert({
      where: { id: "quest-003" },
      update: {},
      create: {
        id: "quest-003",
        title: "Elimine o Esquadrão Inimigo",
        description: "Um esquadrão inimigo foi avistado no vale oeste. Elimine todos os soldados.",
        difficulty: 3,
        xpReward: 200,
      },
    }),
  ])

  const bosses = await Promise.all([
    prisma.boss.upsert({
      where: { id: "boss-001" },
      update: {},
      create: {
        id: "boss-001",
        name: "Goblin Chefe",
        hp: 50,
        damage: 10,
        xpReward: 100,
        levelRequired: 1,
      },
    }),
    prisma.boss.upsert({
      where: { id: "boss-002" },
      update: {},
      create: {
        id: "boss-002",
        name: "Dragão Vermelho",
        hp: 200,
        damage: 30,
        xpReward: 500,
        levelRequired: 3,
      },
    }),
    prisma.boss.upsert({
      where: { id: "boss-003" },
      update: {},
      create: {
        id: "boss-003",
        name: "Rei dos Mortos",
        hp: 500,
        damage: 60,
        xpReward: 1200,
        levelRequired: 5,
      },
    }),
  ])

  console.log("Seed concluído com sucesso!")
  console.log({ admin: admin.email, player: player.email })
  console.log(`${quests.length} quests criadas`)
  console.log(`${bosses.length} bosses criados`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
