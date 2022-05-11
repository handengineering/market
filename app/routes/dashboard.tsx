import { DiscordProfile } from "@prisma/client";
import { Form, Link, useLoaderData } from "@remix-run/react";
import { LoaderFunction } from "@remix-run/server-runtime";
import invariant from "tiny-invariant";
import AppContainer from "~/components/AppContainer";
import Button from "~/components/Button";
import DiscordAvatar from "~/components/DiscordAvatar";
import DiscordStatusTextFields from "~/components/DiscordStatusTextFields";
import DiscordStatusWrapper from "~/components/DiscordStatusWrapper";
import Main from "~/components/Main";
import Sidebar from "~/components/Sidebar";
import { DiscordGuildMember, getDiscordProfileByUserId } from "~/models/discordProfile.server";
import { User } from "~/models/user.server";
import { authenticator } from "~/services/auth.server";

const guildId = "605444240016801879";

type LoaderData = {
  user: User;
  discordProfile: DiscordProfile | null;
  result: DiscordGuildMember | null;
};

export default function Screen() {
  const { user, discordProfile, result } = useLoaderData() as LoaderData;
  const hasJoinedDiscord = discordProfile && result && result.user && result.user.id === discordProfile.id;

  return (
    <AppContainer>
      <Sidebar>
        <h1>Hand Engineering Market</h1>
        {user ? (
          <>
            <p>Signed in as {user.email}</p>

            <Link to="/logout">
              <Button color="danger">Log Out</Button>
            </Link>
          </>
        ) : (
          <div>
            <Link to="/join">
              <Button color="primary">Sign up</Button>
            </Link>
            <Link to="/login">
              <Button>Log In</Button>
            </Link>
          </div>
        )}
      </Sidebar>
      <Main>
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
      </Main>
    </AppContainer>
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

  let discordGuildMember = discordProfile && await fetch(
    `https://discordapp.com/api/guilds/${guildId}/members/${discordProfile.id}`,
    {
      headers: authHeaders,
    }
  );

  const result: DiscordGuildMember | null = discordGuildMember && await discordGuildMember.json();

  return { user, discordProfile, result };
};
