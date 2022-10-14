export async function isMemberOfGuild(id: string): Promise<boolean> {
  const discordGuildMembers = await redisClient.get("discordGuildMembers");

  const parsedResult = discordGuildMembers && JSON.parse(discordGuildMembers);

  const matchingUser = parsedResult.find(
    (resultItem: { user: { id: string } }) => resultItem.user.id === id
  );

  return !!matchingUser;
}
