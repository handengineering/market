import { prisma } from "~/db.server";
import type { DiscordProfile } from "@prisma/client";
import type { User } from "./user.server";
export type { DiscordProfile } from "@prisma/client";

export type DiscordGuild = {
  id: string;
  name: string;
  icon: string;
  owner: boolean;
  permissions: number;
  features: Array<string>;
  permissions_new: string;
};

export type DiscordUser = {
  id: string;
};

export type DiscordGuildMember = {
  user?: DiscordUser;
  nick: string;
  icon: string;
  owner: boolean;
  permissions: number;
  features: Array<string>;
  permissions_new: string;
};

export type DiscordGuilds = Array<DiscordGuild>;

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
  return prisma.discordProfile.delete({ where: { userId: id } });
}

export async function deleteDiscordProfileById(id: DiscordProfile["id"]) {
  return prisma.discordProfile.delete({ where: { id: id } });
}
