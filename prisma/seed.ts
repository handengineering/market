import { PrismaClient } from "@prisma/client";
import { seedRoles } from "./seedRoles";

const prisma = new PrismaClient();

async function seed() {
  const emails = [
    "leanne53@gmail.com",
    "emelie8@yahoo.com",
    "margarette11@yahoo.com",
    "tianna_murazik@gmail.com",
    "demarcus.walker62@yahoo.com",
    "erick.wunsch@yahoo.com",
    "teagan_hansen@yahoo.com",
    "emerson_fisher@yahoo.com",
    "aylin.powlowski@hotmail.com",
    "clair_kozey46@gmail.com",
    "jon.renner90@gmail.com",
    "adaline.emmerich@yahoo.com",
    "nina_gottlieb83@yahoo.com",
    "delfina_leffler@hotmail.com",
    "presley_miller@gmail.com",
    "hubert.buckridge89@gmail.com",
    "keshawn_hegmann35@hotmail.com",
    "amaya.zemlak90@hotmail.com",
    "katelin.weimann@hotmail.com",
    "lexie6@gmail.com",
  ];

  await prisma.user.deleteMany({
    where: {
      email: {
        in: emails,
      },
    },
  });

  await prisma.user.createMany({
    data: emails.map((email) => {
      return { email: email };
    }),
  });

  const users = await prisma.user.findMany();

  const raffle = await prisma.raffle.create({
    data: {
      name: "IBM Model M",
      description: "Own your own piece of computing history",
      productSlugs: ["ibm-model-m"],
      startDateTime: new Date(2023, 1, 1),
      endDateTime: new Date(2023, 1, 2),
    },
  });

  await prisma.raffleEntry.createMany({
    data: users.map((user) => {
      return {
        userId: user.id,
        raffleId: raffle.id,
      };
    }),
  });

  await prisma.role.createMany({
    data: seedRoles.map((seedRole) => {
      return {
        name: seedRole.name,
        permissions: seedRole.permissions,
      };
    }),
  });

  console.log(`Database has been seeded. 🌱`);
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
