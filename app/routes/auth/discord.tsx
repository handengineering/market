import { ActionFunction, LoaderFunction, redirect } from "@remix-run/node";
import { discordAuthenticator } from "~/services/auth.server";

export let loader: LoaderFunction = () => redirect("/login");

export let action: ActionFunction = ({ request }) => {
  return discordAuthenticator.authenticate("discord", request);
};

