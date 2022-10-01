import { authenticator } from "~/services/auth.server";
import type { LoaderFunction } from "@remix-run/server-runtime";
import { redirect } from "@remix-run/server-runtime";
import { getDiscordProfileByUserId } from "~/models/discordProfile.server";
import { getSession, sessionStorage } from "~/services/session.server";

export let loader: LoaderFunction = async ({ request }) => {
  const user = await authenticator.authenticate("email-link", request, {
    failureRedirect: "/login",
  });

  let session = await getSession(request);
  session.set(authenticator.sessionKey, user);

  let headers = new Headers({
    "Set-Cookie": await sessionStorage.commitSession(session),
  });

  const discordProfile = await getDiscordProfileByUserId(user.id);

  if (!discordProfile) {
    return redirect("/join/discord", { headers });
  }

  return redirect("/", { headers });
};
