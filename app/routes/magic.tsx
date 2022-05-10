import { LoaderFunction } from "@remix-run/server-runtime";
import { authenticator } from "~/services/auth.server";

export let loader: LoaderFunction = async ({ request }) => {
  await authenticator.authenticate("email-link", request, {

    successRedirect: "/dashboard",
    failureRedirect: "/login",
  });
};
