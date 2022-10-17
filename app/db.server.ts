import { PrismaClient } from "@prisma/client";

let prisma: PrismaClient;

declare global {
  var __db__: PrismaClient;
}

// this is needed because in development we don't want to restart
// the server with every change, but we want to make sure we don't
// create a new connection to the DB with every change either.
// in production we'll have a single connection to the DB.
if (process.env.NODE_ENV === "production") {
  prisma = new PrismaClient();
} else {
  if (!global.__db__) {
    global.__db__ = new PrismaClient();
    global.__db__ = new PrismaClient({
      datasources: {
        db: {
          url: `${process.env
            .DATABASE_URL!}&connection_limit=40&pool_timeout=20`,
        },
      },
    });
  }
  prisma = global.__db__;
  prisma.$connect();
}

export { prisma };
