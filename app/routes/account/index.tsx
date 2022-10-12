import { Form, useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";
import Button from "~/components/Button";
import DiscordAvatar from "~/components/DiscordAvatar";
import DiscordStatusTextFields from "~/components/DiscordStatusTextFields";
import DiscordStatusWrapper from "~/components/DiscordStatusWrapper";
import {
  createDiscordProfile,
  getDiscordProfileByUserId,
} from "~/models/discordProfile.server";
import { authenticator } from "~/services/auth.server";
import type { LoaderFunction } from "@remix-run/server-runtime";
import type { User } from "~/models/user.server";
import type {
  DiscordGuildMember,
  DiscordProfile,
} from "~/models/discordProfile.server";
import type { ActionFunction } from "@remix-run/node";

const guildId = "605444240016801879";

type LoaderData = {
  discordProfile: DiscordProfile | null;
  result: DiscordGuildMember | null;
  encodedUrl: string;
};

export default function Account() {
  const { discordProfile, result, encodedUrl } =
    useLoaderData() as unknown as LoaderData;
  const hasJoinedDiscord =
    discordProfile &&
    result &&
    result.user &&
    result.user.id === discordProfile.id;

  return (
    <>
      <h1 className="mb-6 font-soehneBreit text-xl">Account Settings</h1>
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
            You {hasJoinedDiscord ? "are" : "are not"} a member of our Discord.{" "}
            {!hasJoinedDiscord ? (
              <a
                href="https://discord.gg/handengineering"
                className="text-primary-500"
              >
                Join the Hand Engineering Discord
              </a>
            ) : null}
          </span>
        </DiscordStatusTextFields>
      </DiscordStatusWrapper>
      {!discordProfile ? (
        <a
          href={`https://discord.com/api/oauth2/authorize?client_id=973191766905856010&redirect_uri=${encodedUrl}%2Fauth%2Fdiscord%2Fcallback&response_type=token&scope=identify%20email`}
        >
          <Button color="primary">Connect Discord Profile</Button>
        </a>
      ) : (
        <Form
          method="post"
          action={`/discordProfile/${discordProfile.id}/delete`}
        >
          <Button color="danger">Remove Discord Profile</Button>
        </Form>
      )}
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

  invariant(process.env.BASE_URL, "BASE_URL must be set");

  const encodedUrl = encodeURIComponent(process.env.BASE_URL);

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

  return { discordProfile, result, encodedUrl };
};

export let action: ActionFunction = async ({ request }) => {
  const user = await authenticator.isAuthenticated(request);

  invariant(user, "user not found");

  const formData = await request.formData();
  const tokenType = await formData.get("tokenType");
  const accessToken = await formData.get("accessToken");

  invariant(accessToken, "accessToken not found");

  const discordProfileResult = await fetch(
    "https://discord.com/api/users/@me",
    {
      headers: {
        authorization: `${tokenType} ${accessToken}`,
      },
    }
  );

  const discordProfileJson = await discordProfileResult.json();

  const { id, username, avatar } = discordProfileJson;

  await createDiscordProfile(
    id,
    user.id,
    username,
    avatar,
    accessToken?.toString()
  );

  return null;
};
