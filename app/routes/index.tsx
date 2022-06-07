import invariant from "tiny-invariant";
import { getDiscordProfileByUserId } from "~/models/discordProfile.server";
import { authenticator } from "~/services/auth.server";
import type { LoaderFunction } from "@remix-run/server-runtime";

const guildId = "605444240016801879";

export default function Screen() {
  return (
    <>
      <h1 className="mb-6 font-soehneBreit text-xl">Welcome</h1>
    </>
  );
}

export let loader: LoaderFunction = async ({ request }) => {
  return await authenticator.isAuthenticated(request, {
    failureRedirect: "/login",
  });
};
