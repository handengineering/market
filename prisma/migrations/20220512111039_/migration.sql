/*
  Warnings:

  - You are about to drop the column `userRolesId` on the `Role` table. All the data in the column will be lost.
  - You are about to drop the `UserRoles` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Role" DROP CONSTRAINT "Role_userRolesId_fkey";

-- DropForeignKey
ALTER TABLE "UserRoles" DROP CONSTRAINT "UserRoles_userId_fkey";

-- AlterTable
ALTER TABLE "Role" DROP COLUMN "userRolesId";

-- DropTable
DROP TABLE "UserRoles";

-- CreateTable
CREATE TABLE "UserRole" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "roleId" TEXT NOT NULL,

    CONSTRAINT "UserRole_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserRole_userId_key" ON "UserRole"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "UserRole_roleId_key" ON "UserRole"("roleId");

-- AddForeignKey
ALTER TABLE "UserRole" ADD CONSTRAINT "UserRole_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserRole" ADD CONSTRAINT "UserRole_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
