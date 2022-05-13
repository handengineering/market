import { User, UserRole } from "@prisma/client";
import { prisma } from "~/db.server";
import { getUserRoleById, getUserRolesByUserId } from "./userRole.server";

export type { Role } from "@prisma/client";

export async function getRoleByUserRoleId(id: UserRole["id"]) {
  const userRole = await getUserRoleById(id);

  return prisma.role.findUnique({ where: { id: userRole?.roleId } });
}

export async function getRolesByUserId(id: User["id"]) {
  const userRoles = await getUserRolesByUserId(id);
  const roleIds = userRoles.map((userRole) => userRole.roleId);

  return prisma.role.findMany({ where: { id: { in: roleIds } } });
}
