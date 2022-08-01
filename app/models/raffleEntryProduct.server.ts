import type { RaffleEntry } from "@prisma/client";
import { prisma } from "~/db.server";
import type { Product, ProductVariant } from "./ecommerce-provider.server";

export async function createRaffleEntryProduct(
  productId: Product["id"],
  productVariantId: ProductVariant["id"],
  raffleEntryId: RaffleEntry["id"]
) {
  return prisma.raffleEntryProduct.create({
    data: {
      productId,
      productVariantId,
      raffleEntryId,
    },
  });
}

export async function getRaffleEntryProductsByRaffleEntryId(
  raffleEntryId: RaffleEntry["id"]
) {
  return prisma.raffleEntryProduct.findMany({
    where: {
      raffleEntryId: raffleEntryId,
    },
  });
}
