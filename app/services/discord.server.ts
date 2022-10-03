import type { DiscordGuildMember } from "~/models/discordProfile.server";

export async function getDiscordGuildMembershipByProfileId(
  id: string
): Promise<DiscordGuildMember | null> {
  let discordBotToken = process.env.DISCORD_BOT_TOKEN;

  const authHeaders = {
    Authorization: `Bot ${discordBotToken}`,
  };

  let discordGuildMember = await fetch(
    `https://discordapp.com/api/guilds/${process.env.DISCORD_GUILD_ID}/members/${id}`,
    {
      headers: authHeaders,
    }
  );

  const result: DiscordGuildMember | null =
    discordGuildMember && (await discordGuildMember.json());

  return result;
}
