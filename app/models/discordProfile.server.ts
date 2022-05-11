import { prisma } from "~/db.server";
import { User } from "./user.server";

export async function createDiscordProfile(
  id: string,
  userId: string,
  displayName: string,
  displayAvatarUrl: string,
  authToken: string
) {
  return prisma.discordProfile.create({
    data: {
      id: id,
      userId: userId,
      displayName: displayName,
      displayAvatarUrl: displayAvatarUrl,
      authToken: authToken,
    },
  });
}

export async function getDiscordProfileByUserId(id: User["id"]) {
  return prisma.discordProfile.findUnique({ where: { userId: id } });
}

export async function deleteDiscordProfileByUserId(id: User["id"]) {
  return prisma.discordProfile.delete({ where: { userId: id  } });
}