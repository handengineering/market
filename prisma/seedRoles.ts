const permissions = {
  default: 1 << 0,
  administrator: 1 << 1,
};

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
