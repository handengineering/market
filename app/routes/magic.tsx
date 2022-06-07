import { authenticator } from "~/services/auth.server";
import type { LoaderFunction } from "@remix-run/server-runtime";
import { redirect } from "@remix-run/server-runtime";
import { getDiscordProfileByUserId } from "~/models/discordProfile.server";

export let loader: LoaderFunction = async ({ request }) => {
  const user = await authenticator.authenticate("email-link", request, {
    failureRedirect: "/login",
  });

  const discordProfile = await getDiscordProfileByUserId(user.id);

  if (!discordProfile) {
    return redirect("/join/discord");
  }

  return redirect("/");
};
