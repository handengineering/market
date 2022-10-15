import { Form, Link, useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";
import Button from "~/components/Button";
import {
  deleteDiscordProfileById,
  getDiscordProfileByUserId,
} from "~/models/discordProfile.server";
import { authenticator } from "~/services/auth.server";
import type { LoaderFunction } from "@remix-run/server-runtime";
import type { DiscordProfile } from "~/models/discordProfile.server";
import { generateLoginLink } from "~/utils/discord";
import type { ActionFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";

const guildInviteUrl = "https://discord.gg/NjzC8pe";

type LoaderData = {
  discordProfile: DiscordProfile | null;
  loginLink: string;
};

export default function JoinDiscord() {
  const { discordProfile, loginLink } =
    useLoaderData() as unknown as LoaderData;

  return (
    <div className="flex flex-col items-center justify-center rounded bg-primary-500 p-12 text-neutral-100">
      <h1 className=" font-soehneBreit text-xl">
        Join Hand Engineering Market
      </h1>
      <h2 className="mb-8 text-neutral-600">Connect Discord Profile</h2>

      <p className="mb-8 text-lg">
        You must connect your Discord profile and be a member of the{" "}
        <Link to={guildInviteUrl} className="text-green-500">
          Hand Engineering Discord{" "}
        </Link>{" "}
        to enter Hand Engineering raffles.
      </p>

      {!discordProfile ? (
        <a href={loginLink}>
          <Button color="secondary" size="large">
            Connect Discord Profile
          </Button>
        </a>
      ) : (
        <Form method="post">
          <Button color="danger">Remove Discord Profile</Button>
        </Form>
      )}
    </div>
  );
}

export let loader: LoaderFunction = async ({ request }) => {
  let user = await authenticator.isAuthenticated(request, {
    failureRedirect: "/login",
  });

  const discordProfile = await getDiscordProfileByUserId(user.id);

  invariant(process.env.BASE_URL, "BASE_URL must be set");

  const loginLink = generateLoginLink(process.env.BASE_URL, "/raffles");

  return { discordProfile, loginLink };
};

export let action: ActionFunction = async ({ request }) => {
  let user = await authenticator.isAuthenticated(request, {
    failureRedirect: "/login",
  });

  const discordProfile = await getDiscordProfileByUserId(user.id);

  invariant(discordProfile, `DiscordProfile not found for User ${user.id}`);

  if ((discordProfile.userId = user.id)) {
    try {
      await deleteDiscordProfileById(discordProfile.id);
    } catch (e) {
      console.error(e);
    }
  }

  return redirect("/join/discord");
};
