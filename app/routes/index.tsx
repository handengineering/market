import { Form, useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";
import Button from "~/components/Button";
import DiscordAvatar from "~/components/DiscordAvatar";
import DiscordStatusTextFields from "~/components/DiscordStatusTextFields";
import DiscordStatusWrapper from "~/components/DiscordStatusWrapper";
import { getDiscordProfileByUserId } from "~/models/discordProfile.server";
import { authenticator } from "~/services/auth.server";
import Card from "~/components/Card";
import type { LoaderFunction } from "@remix-run/server-runtime";
import type { User } from "~/models/user.server";
import type {
  DiscordGuildMember,
  DiscordProfile,
} from "~/models/discordProfile.server";
import type { Raffle } from "~/models/raffle.server";

const guildId = "605444240016801879";

type LoaderData = {
  user: User;
  raffles: Raffle[];
  discordProfile: DiscordProfile | null;
  result: DiscordGuildMember | null;
};

export default function Screen() {
  const { discordProfile, result } = useLoaderData() as LoaderData;
  const hasJoinedDiscord =
    discordProfile &&
    result &&
    result.user &&
    result.user.id === discordProfile.id;

  return (
    <>
      <Card>
        <h2>Discord Status</h2>

        <DiscordStatusWrapper>
          {discordProfile && discordProfile.displayAvatarUrl && (
            <DiscordAvatar
              src={`https://cdn.discordapp.com/avatars/${discordProfile.id}/${discordProfile.displayAvatarUrl}`}
            />
          )}
          <DiscordStatusTextFields>
            <span>
              {discordProfile && discordProfile.displayName
                ? `Signed in as ${discordProfile.displayName}`
                : "Not signed into Discord"}
            </span>

            <span>
              You {hasJoinedDiscord ? "are" : "are not"} a member of our Discord
            </span>
          </DiscordStatusTextFields>
        </DiscordStatusWrapper>
        {!hasJoinedDiscord ? (
          <Form method="post" action="/auth/discord">
            <Button color="primary">Connect Discord Profile</Button>
          </Form>
        ) : (
          <Form
            method="post"
            action={`/discordProfile/${discordProfile.id}/delete`}
          >
            <Button color="danger">Remove Discord Profile</Button>
          </Form>
        )}
      </Card>
    </>
  );
}

export let loader: LoaderFunction = async ({ request }) => {
  invariant(process.env.DISCORD_BOT_TOKEN, "DISCORD_BOT_TOKEN must be set");

  let discordBotToken = process.env.DISCORD_BOT_TOKEN;
  let user = await authenticator.isAuthenticated(request, {
    failureRedirect: "/login",
  });

  const discordProfile = await getDiscordProfileByUserId(user.id);

  const authHeaders = {
    Authorization: `Bot ${discordBotToken}`,
  };

  let discordGuildMember =
    discordProfile &&
    (await fetch(
      `https://discordapp.com/api/guilds/${guildId}/members/${discordProfile.id}`,
      {
        headers: authHeaders,
      }
    ));

  const result: DiscordGuildMember | null =
    discordGuildMember && (await discordGuildMember.json());

  return { user, discordProfile, result };
};
