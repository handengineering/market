import { authenticator, discordAuthenticator } from "~/services/auth.server";
import type { LoaderFunction } from "@remix-run/node";

export let loader: LoaderFunction = async ({ request }) => {
  const user = await authenticator.isAuthenticated(request);
  return discordAuthenticator.authenticate("discord", request, {
    successRedirect: "/",
    failureRedirect: "/login",
    context: {
      user,
    },
  });
};
