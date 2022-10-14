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
import type { DiscordProfile } from "~/models/discordProfile.server";
import type { ActionFunction } from "@remix-run/node";
import { generateLoginLink } from "~/utils/discord";
import { isMemberOfGuild } from "~/services/discord.server";

type LoaderData = {
  discordProfile: DiscordProfile | null;
  isMemberOfDiscordGuild: boolean;
  loginLink: string;
};

export default function Account() {
  const { discordProfile, isMemberOfDiscordGuild, loginLink } =
    useLoaderData() as unknown as LoaderData;

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
            You {isMemberOfDiscordGuild ? "are" : "are not"} a member of our
            Discord.{" "}
            {!isMemberOfDiscordGuild ? (
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
        <a href={loginLink}>
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
  let user = await authenticator.isAuthenticated(request, {
    failureRedirect: "/login",
  });

  const discordProfile = await getDiscordProfileByUserId(user.id);
  invariant(process.env.BASE_URL, "BASE_URL must be set");

  const loginLink = generateLoginLink(process.env.BASE_URL, "/account");

  const isMemberOfDiscordGuild =
    discordProfile && isMemberOfGuild(discordProfile.id);

  return { discordProfile, isMemberOfDiscordGuild, loginLink };
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
