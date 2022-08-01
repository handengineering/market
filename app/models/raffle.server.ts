import { prisma } from "~/db.server";
import type { Raffle } from "@prisma/client";
import type { FullProduct } from "./ecommerce-provider.server";
export type { Raffle } from "@prisma/client";

export type RaffleWithMatchingProducts = Raffle & { products: FullProduct[] };


export async function createRaffle(
  name: Raffle["name"],
  description: Raffle["description"],
  productSlugs: Raffle["productSlugs"],
  startDateTime: Raffle["startDateTime"],
  endDateTime: Raffle["endDateTime"]
) {
  return prisma.raffle.create({
    data: {
      name,
      description,
      productSlugs,
      startDateTime,
      endDateTime,
    },
  });
}

export async function getRaffles() {
  return prisma.raffle.findMany();
}

export async function getRaffleById(id: Raffle["id"]) {
  return prisma.raffle.findUnique({ where: { id } });
}
