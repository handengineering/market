/*
 Warnings:
 
 - Added the required column `updatedAt` to the `RaffleEntry` table without a default value. This is not possible if the table is not empty.
 - Added the required column `updatedAt` to the `Role` table without a default value. This is not possible if the table is not empty.
 - Added the required column `updatedAt` to the `UserRole` table without a default value. This is not possible if the table is not empty.
 
 */
-- AlterTable
ALTER TABLE "RaffleEntry"
ADD COLUMN IF NOT EXISTS "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  ADD COLUMN IF NOT EXISTS "updatedAt" TIMESTAMP(3) NOT NULL;
-- AlterTable
ALTER TABLE "Role"
ADD COLUMN IF NOT EXISTS "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  ADD COLUMN IF NOT EXISTS "updatedAt" TIMESTAMP(3) NOT NULL;
-- AlterTable
ALTER TABLE "UserRole"
ADD COLUMN IF NOT EXISTS "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  ADD COLUMN IF NOT EXISTS "updatedAt" TIMESTAMP(3) NOT NULL;
-- CreateTable
CREATE TABLE IF NOT EXISTS "RaffleEntryProduct" (
  "id" TEXT NOT NULL,
  "productId" TEXT NOT NULL,
  "productVariantId" TEXT NOT NULL,
  "raffleEntryId" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "RaffleEntryProduct_pkey" PRIMARY KEY ("id")
);
-- AddForeignKey
ALTER TABLE "RaffleEntryProduct" DROP CONSTRAINT IF EXISTS "RaffleEntryProduct_raffleEntryId_fkey";
ALTER TABLE "RaffleEntryProduct"
ADD CONSTRAINT "RaffleEntryProduct_raffleEntryId_fkey" FOREIGN KEY ("raffleEntryId") REFERENCES "RaffleEntry"("id") ON DELETE
SET NULL ON UPDATE CASCADE;