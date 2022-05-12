import { User } from "@prisma/client";
import { Link } from "@remix-run/react";
import { LoaderFunction, redirect } from "@remix-run/server-runtime";
import permissions from "prisma/permissions";
import AppContainer from "~/components/AppContainer";
import Main from "~/components/Main";
import { getRolesByUserId } from "~/models/role.server";
import { authenticator } from "~/services/auth.server";

export default function Index() {
  return (
    <AppContainer>
      <Main>
        <h1>Admin Panel</h1>
        <ul>
          <li>
            <Link to="/admin/raffle/new">Create New Raffle</Link>
          </li>
        </ul>
      </Main>
    </AppContainer>
  );
}

export let loader: LoaderFunction = async ({ request }) => {
  let user: User = await authenticator.isAuthenticated(request, {
    failureRedirect: "/login",
  });

  const roles = await getRolesByUserId(user.id);

  const hasPermissions = roles.some((role) => {
    return role.permissions & permissions.administrator;
  });

  if (!hasPermissions) {
    return redirect("/dashboard");
  }
  return user;
};
