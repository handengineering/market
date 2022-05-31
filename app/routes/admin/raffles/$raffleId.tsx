import { Outlet } from "@remix-run/react";
import type { LoaderFunction } from "@remix-run/server-runtime";

import { authenticator } from "~/services/auth.server";

export default function RaffleId() {
  return <Outlet />;
}

export let loader: LoaderFunction = async ({ request }) => {
  let user = await authenticator.isAuthenticated(request, {
    failureRedirect: "/login",
  });

  return { user };
};
