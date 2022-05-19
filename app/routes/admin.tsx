import { Link, Outlet } from "@remix-run/react";
import permissions from "prisma/permissions";
import type { LoaderFunction } from "@remix-run/server-runtime";
import { redirect } from "@remix-run/server-runtime";
import { checkPermissions } from "~/services/permissions.server";
import Sidebar, { SidebarWraper } from "~/components/Sidebar";
import Button from "~/components/Button";
import FlexContainer from "~/components/FlexContainer";

export default function Index() {
  return (
    <SidebarWraper layout={{ "@initial": "mobile", "@bp2": "desktop" }}>
      <Sidebar layout={{ "@initial": "mobile", "@bp2": "desktop" }}>
        <h2>🛠 Admin</h2>

        <ul>
          <li>
            <Link to="/admin/raffles">
              <Button>Raffles</Button>
            </Link>
          </li>
          <li>
            <Link to="/admin/raffle/new">
              <Button>New Raffle</Button>
            </Link>
          </li>
          <li>
            <Link to="/admin/products">
              <Button>Products</Button>
            </Link>
          </li>
        </ul>
      </Sidebar>
      <FlexContainer layout={{ "@initial": "mobile", "@bp2": "desktop" }}>
        <Outlet />
      </FlexContainer>
    </SidebarWraper>
  );
}

export let loader: LoaderFunction = async ({ request }) => {
  const hasPermissions = await checkPermissions(
    request,
    permissions.administrator
  );

  if (!hasPermissions) return redirect("/");

  return {};
};
