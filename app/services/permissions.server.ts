import { getRolesByUserId } from "~/models/role.server";
import type { User } from "~/models/user.server";
import { authenticator } from "./auth.server";

export async function checkPermissions(request: Request, permissions: number) {
  let user: User = await authenticator.isAuthenticated(request, {
    failureRedirect: "/login",
  });

  const roles = await getRolesByUserId(user.id);

  const hasPermissions = roles.some((role) => {
    return role.permissions & permissions;
  });

  return hasPermissions;
}
