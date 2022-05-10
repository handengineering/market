import { DiscordProfile } from "@prisma/client";
import { Form, useLoaderData } from "@remix-run/react";
import { LoaderFunction } from "@remix-run/server-runtime";
import Button from "~/components/Button";
import { getDiscordProfileByUserId } from "~/models/discordProfile.server";
import { User } from "~/models/user.server";
import { authenticator } from "~/services/auth.server";

const matchingDiscordId = "605444240016801879";

type LoaderData = {
  user: User;
  discordProfile: DiscordProfile;
  result: DiscordGuilds;
};

type DiscordGuild = {
  id: string;
  name: string;
  icon: string;
  owner: boolean;
  permissions: number;
  features: Array<string>;
  permissions_new: string;
};

type DiscordGuilds = Array<DiscordGuild>;

export default function Screen() {
  const { user, discordProfile, result } = useLoaderData() as LoaderData;

  const hasJoinedDiscord =
    result.length >= 1 &&
    result.some((discordGuild) => discordGuild.id === matchingDiscordId);

  return (
    <main>
      <h1>Welcome {user ? user.email : "no user found"}</h1>

      <h2>
        You {hasJoinedDiscord ? "are" : "are not"} a member of our Discord
      </h2>

      <h2>
        {discordProfile && discordProfile.displayName
          ? `Signed in as ${discordProfile.displayName}`
          : "Not signed into Discord"}
      </h2>
      {discordProfile && discordProfile.displayAvatarUrl && (
        <img
          src={`https://cdn.discordapp.com/avatars/${discordProfile.id}/${discordProfile.displayAvatarUrl}`}
        />
      )}
      <Form method="post" action="/auth/discord">
        <Button>Connect Discord</Button>
      </Form>
    </main>
  );
}

export let loader: LoaderFunction = async ({ request }) => {
  let user = await authenticator.isAuthenticated(request, {
    failureRedirect: "/login",
  });

  const discordProfile = await getDiscordProfileByUserId(user.id);

  const authHeaders = {
    Authorization: `Bearer ${discordProfile && discordProfile.authToken}`,
  };

  let discordGuilds = await fetch(
    "https://discordapp.com/api/users/@me/guilds",
    {
      headers: authHeaders,
    }
  );

  const result = await discordGuilds.json();

  return { user, discordProfile, result };
};
