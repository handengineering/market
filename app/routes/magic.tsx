import { authenticator } from "~/services/auth.server";
import type { LoaderFunction } from "@remix-run/server-runtime";

export let loader: LoaderFunction = async ({ request }) => {
  await authenticator.authenticate("email-link", request, {
    successRedirect: "/",
    failureRedirect: "/login",
  });
};
