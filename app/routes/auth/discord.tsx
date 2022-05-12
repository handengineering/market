import { redirect } from "@remix-run/node";
import { discordAuthenticator } from "~/services/auth.server";
import type { ActionFunction, LoaderFunction } from "@remix-run/node";

export let loader: LoaderFunction = () => redirect("/login");

export let action: ActionFunction = ({ request }) => {
  return discordAuthenticator.authenticate("discord", request);
};
