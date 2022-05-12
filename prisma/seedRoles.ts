import permissions from "./permissions";

export const seedRoles = [
  {
    name: "Default",
    permissions: permissions.default | permissions.administrator,
  },
  {
    name: "Admin",
    permissions: permissions.default | permissions.administrator,
  },
];
