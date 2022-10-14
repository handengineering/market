import redisClient from "~/services/redis.server";

export async function getDiscordGuildMembershipByProfileId(
  id: string
): Promise<boolean> {
  let discordBotToken = process.env.DISCORD_BOT_TOKEN;

  const authHeaders = {
    Authorization: `Bot ${discordBotToken}`,
  };

  async function getMoreGuildMembers(
    previousMembers: any[],
    lastUserId?: string
  ): Promise<string> {
    const discordGuildMembers = await redisClient.get("discordGuildMembers");
    if (discordGuildMembers) {
      return discordGuildMembers;
    } else {
      const snowflakeQuery = lastUserId ? `&after=${lastUserId}` : "";

      const response = await fetch(
        `https://discordapp.com/api/guilds/${process.env.DISCORD_GUILD_ID}/members?limit=1000${snowflakeQuery}`,
        {
          headers: authHeaders,
        }
      );

      const clonedResponse = response.clone();

      const newMembers = await clonedResponse.json();

      const members =
        newMembers.length > 0
          ? [...previousMembers, ...newMembers]
          : previousMembers;

      const lastItem = members[members.length - 1];

      if (newMembers.length > 0) {
        return await getMoreGuildMembers(members, lastItem.user.id);
      } else {
        return redisClient.setEx(
          "discordGuildMembers",
          10,
          JSON.stringify(members)
        );
      }
    }
  }

  const result = await getMoreGuildMembers([]);

  const parsedResult = JSON.parse(result);
  const matchingUser = parsedResult.find(
    (resultItem: { user: { id: string } }) => resultItem.user.id === id
  );

  return !!matchingUser;
}
