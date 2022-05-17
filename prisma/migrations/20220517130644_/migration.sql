-- CreateEnum
CREATE TYPE "RaffleEntryStatus" AS ENUM ('CREATED', 'DRAWN', 'ARCHIVED', 'CANCELED');

-- AlterTable
ALTER TABLE "RaffleEntry" ADD COLUMN     "status" "RaffleEntryStatus" NOT NULL DEFAULT E'CREATED';
