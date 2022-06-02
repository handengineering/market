import { Link, Outlet } from "@remix-run/react";
import permissions from "prisma/permissions";
import type { LoaderFunction } from "@remix-run/server-runtime";
import { redirect } from "@remix-run/server-runtime";
import { checkPermissions } from "~/services/permissions.server";
import Button from "~/components/Button";
import FlexContainer from "~/components/FlexContainer";

export default function Index() {
  return (
    <div className="flex h-full flex-row items-start gap-6">
      <div className="h-full flex-shrink-0 flex-grow-0 basis-64  rounded  bg-neutral200 p-6">
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
      </div>
      <FlexContainer>
        <Outlet />
      </FlexContainer>
    </div>
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
