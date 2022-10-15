import redisClient from "~/services/redis.server";

export async function loader({
  params,
}: {
  params: { discordProfileId: string };
}) {
  const discordGuildMemberIds = await redisClient.get("discordGuildMemberIds");

  const parsedResult: string[] =
    discordGuildMemberIds && JSON.parse(discordGuildMemberIds);

  const matchingUser =
    parsedResult &&
    parsedResult.find((resultItem) => resultItem === params.discordProfileId);

  return !!matchingUser;
}
