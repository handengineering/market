import { RaffleEntryStatus } from "@prisma/client";
import { Form, useLoaderData } from "@remix-run/react";
import type { ActionFunction, LoaderFunction } from "@remix-run/server-runtime";
import { redirect } from "@remix-run/server-runtime";
import clsx from "clsx";
import { useState } from "react";
import Button from "~/components/Button";
import Input from "~/components/Input";
import Label from "~/components/Label";
import { prisma } from "~/db.server";
import { deleteRaffleById, getRaffleById } from "~/models/raffle.server";
import type { RaffleEntry } from "~/models/raffleEntry.server";
import { getRaffleEntriesByRaffleId } from "~/models/raffleEntry.server";
import type { User } from "~/models/user.server";
import { getUserById } from "~/models/user.server";
import { getUsers } from "~/models/user.server";
import { sendConfirmationEmail } from "~/services/email.server";
import { requireAdminPermissions } from "~/services/permissions.server";

type LoaderData = {
  createdRaffleEntries?: RaffleEntry[];
  drawnRaffleEntries?: RaffleEntry[];
  users?: User[];
};

function shuffleArray<T>(array: T[]) {
  let currentIndex = array.length,
    randomIndex;

  while (currentIndex != 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }

  return array;
}

export let loader: LoaderFunction = async ({ request, params }) => {
  await requireAdminPermissions(request);

  const raffleId = params.raffleId as string;

  const raffleEntries = await getRaffleEntriesByRaffleId(raffleId);

  const users = await getUsers();

  const createdRaffleEntries = raffleEntries?.filter(
    (raffleEntry) => raffleEntry.status === RaffleEntryStatus.CREATED
  );

  const drawnRaffleEntries = raffleEntries?.filter(
    (raffleEntry) => raffleEntry.status === RaffleEntryStatus.DRAWN
  );

  return { createdRaffleEntries, drawnRaffleEntries, users };
};

export let action: ActionFunction = async ({ request, params }) => {
  const raffleId = params.raffleId as string;

  const raffleEntries = await getRaffleEntriesByRaffleId(raffleId);
  const raffle = await getRaffleById(raffleId);

  const formData = await request.formData();
  const drawCount = formData.get("drawCount");

  const createdRaffleEntries = raffleEntries?.filter(
    (raffleEntry) => raffleEntry.status === RaffleEntryStatus.CREATED
  );

  const drawnRaffleEntries = raffleEntries?.filter(
    (raffleEntry) => raffleEntry.status === RaffleEntryStatus.DRAWN
  );

  const shuffledCreatedRaffleEntries = shuffleArray(createdRaffleEntries);

  if (typeof drawCount !== "string") {
    throw "drawCount must be a string";
  }

  const shuffledCreatedRaffleEntriesToBeDrawn =
    shuffledCreatedRaffleEntries.slice(0, parseInt(drawCount));

  if (formData.get("action") === "draw") {
    return await prisma.raffleEntry.updateMany({
      where: {
        userId: {
          in: shuffledCreatedRaffleEntriesToBeDrawn.map(
            (raffleEntry) => raffleEntry.userId
          ),
        },
        raffleId: raffleId,
      },
      data: {
        status: RaffleEntryStatus.DRAWN,
      },
    });
  }

  if (formData.get("action") === "removeAll") {
    return await prisma.raffleEntry.updateMany({
      where: {
        userId: {
          in: drawnRaffleEntries.map((raffleEntry) => raffleEntry.userId),
        },
        raffleId: raffleId,
      },
      data: {
        status: RaffleEntryStatus.CREATED,
      },
    });
  }

  if (formData.get("action") === "sendConfirmation") {
    for (const entry of drawnRaffleEntries) {
      const user = await getUserById(entry.userId);

      const confirmationLink = `${process.env.BASE_URL}/raffles/${raffleId}/confirmation`;

      user &&
        raffle &&
        (await sendConfirmationEmail(
          user.email,
          raffle.productSlugs[0],
          confirmationLink
        ));
    }
    return redirect("/admin/raffles");
  }

  if (formData.get("action") === "deleteRaffle") {
    raffle && deleteRaffleById(raffle.id);
    return redirect("/admin/raffles");
  }
};

export default function Index() {
  const { createdRaffleEntries, drawnRaffleEntries, users } =
    useLoaderData() as LoaderData;
  const [canRemoveAll, setCanRemoveAll] = useState(false);

  return (
    <div className="grid gap-6 md:grid-cols-3">
      {users && (
        <>
          <div className="mb-6">
            <h2 className="mb-6 font-soehneBreit text-lg">
              Created Raffle Entries ({createdRaffleEntries?.length})
            </h2>
            <ul>
              {createdRaffleEntries &&
                createdRaffleEntries.map((raffleEntry) => {
                  const matchingUser = users.find((user) => {
                    return user.id === raffleEntry.userId;
                  });

                  return (
                    <li
                      key={raffleEntry.id}
                      className="mb-2 rounded bg-yellow-200 p-2"
                    >
                      {matchingUser?.email}
                    </li>
                  );
                })}
            </ul>
          </div>
          <div className="mb-6">
            <h2 className="mb-6 font-soehneBreit text-lg">Controls</h2>
            <Form method="post">
              <Label>
                Draw Count
                <Input type="number" name="drawCount" />
              </Label>
              <Button
                name="action"
                value="draw"
                color="primary"
                className="mb-2 w-full last:mb-0"
              >
                Draw Participants
              </Button>

              {canRemoveAll ? (
                <Button
                  name="action"
                  value="removeAll"
                  color="danger"
                  className="mb-2 w-full last:mb-0"
                >
                  Confirm Remove All Partipants
                </Button>
              ) : (
                <Button
                  onClick={(e) => {
                    e.preventDefault();
                    setCanRemoveAll(true);
                  }}
                  className="mb-2 w-full last:mb-0"
                >
                  Remove All Particpants
                </Button>
              )}
              <Button
                name="action"
                value="sendConfirmation"
                color="danger"
                className="mb-2 w-full last:mb-0"
              >
                Send Confirmation and Archive
              </Button>
              <Button
                size="small"
                name="action"
                value="deleteRaffle"
                color="danger"
                className="mb-2 last:mb-0"
              >
                Delete Raffle
              </Button>
            </Form>
          </div>
          <div className="mb-6">
            <h2 className="mb-6 font-soehneBreit text-lg">
              Drawn Raffle Entries ({drawnRaffleEntries?.length})
            </h2>

            <ul>
              {drawnRaffleEntries &&
                drawnRaffleEntries.map((raffleEntry) => {
                  const matchingUser = users.find((user) => {
                    return user.id === raffleEntry.userId;
                  });

                  return (
                    <li
                      key={raffleEntry.id}
                      className={clsx(
                        "mb-2 rounded bg-green-200 p-2",
                        canRemoveAll && "bg-red-200"
                      )}
                    >
                      {matchingUser?.email}
                    </li>
                  );
                })}
            </ul>
          </div>
        </>
      )}
    </div>
  );
}
