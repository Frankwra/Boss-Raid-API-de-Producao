-- DropForeignKey
ALTER TABLE "PlayerQuest" DROP CONSTRAINT "PlayerQuest_questId_fkey";

-- DropForeignKey
ALTER TABLE "Raid" DROP CONSTRAINT "Raid_bossId_fkey";

-- DropForeignKey
ALTER TABLE "RaidParticipant" DROP CONSTRAINT "RaidParticipant_raidId_fkey";

-- AddForeignKey
ALTER TABLE "PlayerQuest" ADD CONSTRAINT "PlayerQuest_questId_fkey" FOREIGN KEY ("questId") REFERENCES "Quest"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Raid" ADD CONSTRAINT "Raid_bossId_fkey" FOREIGN KEY ("bossId") REFERENCES "Boss"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RaidParticipant" ADD CONSTRAINT "RaidParticipant_raidId_fkey" FOREIGN KEY ("raidId") REFERENCES "Raid"("id") ON DELETE CASCADE ON UPDATE CASCADE;
