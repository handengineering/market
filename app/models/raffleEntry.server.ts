import type { RaffleEntry, RaffleEntryStatus } from "@prisma/client";
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

export async function updateRaffleEntryStatusById(
  id: RaffleEntry["id"],
  status: RaffleEntry["status"]
) {
  return prisma.raffleEntry.update({ where: { id }, data: { status } });
}

export async function updateRaffleEntryCheckoutUrlById(
  id: RaffleEntry["id"],
  checkoutUrl: RaffleEntry["checkoutUrl"]
) {
  return prisma.raffleEntry.update({ where: { id }, data: { checkoutUrl } });
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

export async function getRaffleEntriesByRaffleIdAndUserId(
  raffleId: Raffle["id"],
  userId: User["id"]
) {
  return prisma.raffleEntry.findMany({
    where: { raffleId, userId },
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
