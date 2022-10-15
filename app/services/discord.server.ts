export async function isMemberOfGuild(id: string): Promise<boolean> {
  const discordGuildMemberIds = await redisClient.get("discordGuildMemberIds");

  const parsedResult: string[] =
    discordGuildMemberIds && JSON.parse(discordGuildMemberIds);

  const matchingUser =
    parsedResult && parsedResult.find((resultItem) => resultItem === id);

  return !!matchingUser;
}
