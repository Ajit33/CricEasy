/*
  Warnings:

  - Added the required column `tossWinnerId` to the `Match` table without a default value. This is not possible if the table is not empty.
  - Added the required column `innings` to the `MatchEvent` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Match" DROP CONSTRAINT "Match_team1Id_fkey";

-- DropForeignKey
ALTER TABLE "Match" DROP CONSTRAINT "Match_team2Id_fkey";

-- AlterTable
ALTER TABLE "Match" ADD COLUMN     "decision" TEXT,
ADD COLUMN     "firstInningsOvers" DOUBLE PRECISION,
ADD COLUMN     "firstInningsRuns" INTEGER,
ADD COLUMN     "firstInningsWickets" INTEGER,
ADD COLUMN     "secondInningsOvers" DOUBLE PRECISION,
ADD COLUMN     "secondInningsRuns" INTEGER,
ADD COLUMN     "secondInningsWickets" INTEGER,
ADD COLUMN     "tossWinnerId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "MatchEvent" ADD COLUMN     "ballType" TEXT NOT NULL DEFAULT 'normal',
ADD COLUMN     "innings" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Player" ADD COLUMN     "totalRuns" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "totalWickets" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "Tournament" ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'upcoming';
