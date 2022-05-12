import { discordAuthenticator } from "~/services/auth.server";
import type { LoaderFunction } from "@remix-run/node";

export let loader: LoaderFunction = ({ request }) => {
  return discordAuthenticator.authenticate("discord", request, {
    successRedirect: "/dashboard",
    failureRedirect: "/login",
  });
};
