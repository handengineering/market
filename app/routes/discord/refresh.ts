import type { LoaderFunction } from "@remix-run/node";
import { fetchAllGuildMembers } from "~/services/discord.server";
import redisClient from "~/services/redis.server";

export let loader: LoaderFunction = async () => {
  const allGuildMembers = await fetchAllGuildMembers();

  await redisClient.set("discordGuildMembers", allGuildMembers);

  return new Response("Discord Refreshed", {
    status: 200,
  });
};
