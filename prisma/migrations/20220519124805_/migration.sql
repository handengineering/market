/*
  Warnings:

  - Added the required column `description` to the `Raffle` table without a default value. This is not possible if the table is not empty.
  - Added the required column `endDateTime` to the `Raffle` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startDateTime` to the `Raffle` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "RaffleStatus" AS ENUM ('UPCOMING', 'PAST', 'ARCHIVED', 'CANCELED');

-- AlterTable
ALTER TABLE "Raffle" ADD COLUMN     "description" TEXT NOT NULL,
ADD COLUMN     "endDateTime" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "startDateTime" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "status" "RaffleStatus" NOT NULL DEFAULT E'UPCOMING';
