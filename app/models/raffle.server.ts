import { prisma } from "~/db.server";
import type { Raffle } from "@prisma/client";
export type { Raffle } from "@prisma/client";

export async function createRaffle(name: Raffle["name"]) {
  return prisma.raffle.create({
    data: {
      name,
    },
  });
}

export async function getRaffles() {
    return prisma.raffle.findMany()
}