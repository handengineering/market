import { Link, Outlet } from "@remix-run/react";
import permissions from "prisma/permissions";
import AppContainer from "~/components/AppContainer";
import Main from "~/components/Main";
import type { LoaderFunction } from "@remix-run/server-runtime";
import { redirect } from "@remix-run/server-runtime";
import { checkPermissions } from "~/services/permissions.server";

export default function Index() {
  return (
    <AppContainer>
      <Main>
        <h1>Admin Panel</h1>
        <ul>
          <li>
            <Link to="/admin/raffles">Raffles</Link>
          </li>
          <li>
            <Link to="/admin/raffle/new">New Raffle</Link>
          </li>
          <li>
            <Link to="/admin/products">Products</Link>
          </li>
        </ul>
        <hr />
        <Outlet />
      </Main>
    </AppContainer>
  );
}

export let loader: LoaderFunction = async ({ request }) => {
  const hasPermissions = await checkPermissions(
    request,
    permissions.administrator
  );

  if (!hasPermissions) return redirect("/dashboard");

  return {};
};
