import type { RaffleEntryStatus } from "@prisma/client";
import { prisma } from "~/db.server";
import type { Raffle } from "~/models/raffle.server";
import type { User } from "~/models/user.server";
export type { RaffleEntry } from "@prisma/client";

export async function createRaffleEntry(
  raffleId: Raffle["id"],
  userId: User["id"]
) {
  return prisma.raffleEntry.create({
    data: {
      raffleId,
      userId,
    },
  });
}

export async function getRaffleEntriesByUserId(userId: User["id"]) {
  return prisma.raffleEntry.findMany({
    where: { userId },
  });
}

export async function getRaffleEntriesByRaffleId(raffleId: Raffle["id"]) {
  return prisma.raffleEntry.findMany({
    where: { raffleId },
  });
}

export async function deleteRaffleEntriesByRaffleIdAndUserId(
  raffleId: Raffle["id"],
  userId: User["id"]
) {
  return prisma.raffleEntry.deleteMany({
    where: { raffleId, userId },
  });
}

export async function getRaffleEntriesByStatus(status: RaffleEntryStatus) {
  return prisma.raffleEntry.findMany({
    where: { status },
  });
}
