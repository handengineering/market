import { prisma } from "~/db.server";
import type { Raffle } from "@prisma/client";
export type { Raffle } from "@prisma/client";

export async function createRaffle(
  name: Raffle["name"],
  productSlugs: Raffle["productSlugs"]
) {
  return prisma.raffle.create({
    data: {
      name,
      productSlugs,
    },
  });
}

export async function getRaffles() {
  return prisma.raffle.findMany();
}

export async function getRaffleById(id: Raffle["id"]) {
  return prisma.raffle.findUnique({ where: { id } });
}
