import { Form, Link, useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";
import Button from "~/components/Button";
import { getDiscordProfileByUserId } from "~/models/discordProfile.server";
import { authenticator } from "~/services/auth.server";
import type { LoaderFunction } from "@remix-run/server-runtime";
import type { User } from "~/models/user.server";
import type {
  DiscordGuildMember,
  DiscordProfile,
} from "~/models/discordProfile.server";
import type { Raffle } from "~/models/raffle.server";
import { generateLoginLink } from "~/utils/discord";

const guildId = "605444240016801879";
const guildInviteUrl = "https://discord.gg/NjzC8pe";

type LoaderData = {
  user: User;
  raffles: Raffle[];
  discordProfile: DiscordProfile | null;
  result: DiscordGuildMember | null;
  loginLink: string;
};

export default function JoinDiscord() {
  const { discordProfile, result, loginLink } =
    useLoaderData() as unknown as LoaderData;
  const hasJoinedDiscord =
    discordProfile &&
    result &&
    result.user &&
    result.user.id === discordProfile.id;

  return (
    <div className="flex flex-col items-center justify-center rounded bg-primary-500 p-12 text-neutral-100">
      <h1 className=" font-soehneBreit text-xl">
        Join Hand Engineering Market
      </h1>
      <h2 className="mb-6 text-neutral-600">Connect Discord Profile</h2>

      <p className="mb-6 text-lg">
        You must connect your Discord profile and be a member of the{" "}
        <Link to={guildInviteUrl} className="text-green-500">
          Hand Engineering Discord{" "}
        </Link>{" "}
        to enter Hand Engineering raffles.
      </p>

      {!hasJoinedDiscord ? (
        <a href={loginLink}>
          <Button color="secondary" size="large">
            Connect Discord Profile
          </Button>
        </a>
      ) : (
        <Form
          method="post"
          action={`/discordProfile/${discordProfile.id}/delete`}
        >
          <Button color="danger">Remove Discord Profile</Button>
        </Form>
      )}
    </div>
  );
}

export let loader: LoaderFunction = async ({ request }) => {
  invariant(process.env.DISCORD_BOT_TOKEN, "DISCORD_BOT_TOKEN must be set");

  let discordBotToken = process.env.DISCORD_BOT_TOKEN;
  let user = await authenticator.isAuthenticated(request, {
    failureRedirect: "/login",
  });

  const discordProfile = await getDiscordProfileByUserId(user.id);

  invariant(process.env.BASE_URL, "BASE_URL must be set");

  const loginLink = generateLoginLink(process.env.BASE_URL, "/join/discord");

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

  return { user, discordProfile, result, loginLink };
};
