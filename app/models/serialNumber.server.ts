import type { SerialNumber } from "@prisma/client";
import { prisma } from "~/db.server";
export type { SerialNumber } from "@prisma/client";

export async function getSerialNumbers() {
  return prisma.serialNumber.findMany();
}

export async function createSerialNumbers(
  count: number,
  productId: SerialNumber["productId"],
  productVariantId: SerialNumber["productVariantId"],
  userId: SerialNumber["userId"],
  orderId: SerialNumber["orderId"]
) {
  for (let i = 0; i < count; i++) {
    let newSerialNumber = Math.round(
      Math.pow(36, 10 + 1) - Math.random() * Math.pow(36, 10)
    )
      .toString(36)
      .slice(1)
      .toUpperCase();

    await prisma.serialNumber.create({
      data: {
        serialNumber: newSerialNumber,
        productId,
        productVariantId,
        userId,
        orderId,
      },
    });
  }
}

export async function createSerialNumber(
  serialNumber: SerialNumber["serialNumber"],
  productId: SerialNumber["productId"],
  productVariantId: SerialNumber["productVariantId"],
  userId: SerialNumber["userId"],
  orderId: SerialNumber["orderId"]
) {
  return prisma.serialNumber.create({
    data: {
      serialNumber,
      productId,
      productVariantId,
      userId,
      orderId,
    },
  });
}
