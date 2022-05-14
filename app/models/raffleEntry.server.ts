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
