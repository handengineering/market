import { Link, Outlet } from "@remix-run/react";
import permissions from "prisma/permissions";
import type { LoaderFunction } from "@remix-run/server-runtime";
import { redirect } from "@remix-run/server-runtime";
import { checkPermissions } from "~/services/permissions.server";
import Button from "~/components/Button";
import FlexContainer from "~/components/FlexContainer";

export default function Index() {
  return (
    <div className="flex h-full flex-col items-start gap-6 md:flex-row">
      <div className="w-full md:h-full  md:flex-shrink-0  md:flex-grow-0 md:basis-64">
        <h1 className="mb-6 font-soehneBreit text-xl uppercase">Admin</h1>

        <ul>
          <li className="mb-2">
            <Link to="/admin/raffles">Raffles</Link>
          </li>
          <li className="mb-2">
            <Link to="/admin/raffle/new">New Raffle</Link>
          </li>
          <li className="mb-2">
            <Link to="/admin/products">Products</Link>
          </li>
        </ul>
      </div>
      <Outlet />
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
