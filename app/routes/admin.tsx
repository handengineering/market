import { Outlet } from "@remix-run/react";
import type { LoaderFunction } from "@remix-run/server-runtime";
import { requireAdminPermissions } from "~/services/permissions.server";

export default function Index() {
  return (
    <div>
      <h1 className="mb-6 font-soehneBreit text-xl text-neutral-700">Admin</h1>
      <Outlet />
    </div>
  );
}

export let loader: LoaderFunction = async ({ request }) => {
  await requireAdminPermissions(request);
  return null;
};
