import { redirect } from "@remix-run/server-runtime";
import permissions from "prisma/permissions";
import { getRolesByUserId } from "~/models/role.server";
import { authenticator } from "./auth.server";

export async function checkPermissions(request: Request, permissions: number) {
  let user = await authenticator.isAuthenticated(request);

  const roles = user && (await getRolesByUserId(user.id));

  const hasPermissions =
    roles &&
    roles.some((role) => {
      return role.permissions & permissions;
    });

  return hasPermissions;
}

export async function requireAdminPermissions(request: Request) {
  const hasPermissions = await checkPermissions(
    request,
    permissions.administrator
  );

  if (!hasPermissions) {
    throw redirect("/");
  }
}

export async function redirectUnlessPermissions(
  request: Request,
  permissions: number,
  redirectRoute: string = "/login"
) {
  const hasPermissions = await checkPermissions(request, permissions);

  if (!hasPermissions) redirect(redirectRoute);
}
