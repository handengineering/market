/*
  Warnings:

  - The values [UPCOMING,PAST] on the enum `RaffleStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "RaffleStatus_new" AS ENUM ('CREATED', 'DRAWN', 'ARCHIVED', 'CANCELED');
ALTER TABLE "Raffle" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Raffle" ALTER COLUMN "status" TYPE "RaffleStatus_new" USING ("status"::text::"RaffleStatus_new");
ALTER TYPE "RaffleStatus" RENAME TO "RaffleStatus_old";
ALTER TYPE "RaffleStatus_new" RENAME TO "RaffleStatus";
DROP TYPE "RaffleStatus_old";
ALTER TABLE "Raffle" ALTER COLUMN "status" SET DEFAULT 'CREATED';
COMMIT;

-- AlterTable
ALTER TABLE "Raffle" ALTER COLUMN "status" SET DEFAULT E'CREATED';
