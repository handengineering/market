import { RaffleEntryStatus } from "@prisma/client";
import { Form, useLoaderData } from "@remix-run/react";
import type { ActionFunction, LoaderFunction } from "@remix-run/server-runtime";
import { useState } from "react";
import Button from "~/components/Button";
import Card from "~/components/Card";
import Grid from "~/components/Grid";
import Input from "~/components/Input";
import Label from "~/components/Label";
import { prisma } from "~/db.server";
import type { RaffleEntry } from "~/models/raffleEntry.server";
import { getRaffleEntriesByRaffleId } from "~/models/raffleEntry.server";
import type { User } from "~/models/user.server";
import { getUsers } from "~/models/user.server";
import { styled } from "~/styles/stitches.config";

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
};

const RaffleEntryListItem = styled("li", {
  border: "1px solid $neutral500",
  backgroundColor: "$neutral100",
  borderRadius: "$1",
  padding: "$1",
});

export default function Index() {
  const { createdRaffleEntries, drawnRaffleEntries, users } =
    useLoaderData() as LoaderData;
  const [canRemoveAll, setCanRemoveAll] = useState(false);

  return (
    <Grid layout={{ "@initial": "mobile", "@bp2": "desktop" }}>
      {users && (
        <>
          <Card>
            <h2>Created Raffle Entries ({createdRaffleEntries?.length})</h2>
            <ul>
              {createdRaffleEntries &&
                createdRaffleEntries.map((raffleEntry) => {
                  const matchingUser = users.find((user) => {
                    return user.id === raffleEntry.userId;
                  });

                  return (
                    <RaffleEntryListItem key={raffleEntry.id}>
                      {matchingUser?.email}
                    </RaffleEntryListItem>
                  );
                })}
            </ul>
          </Card>
          <Card>
            <h2>Controls</h2>
            <Form method="post">
              <Label>
                Draw Count
                <Input type="number" name="drawCount" />
              </Label>
              <Button name="action" value="draw" color="primary">
                Draw Participants
              </Button>

              {canRemoveAll ? (
                <Button name="action" value="removeAll" color="danger">
                  Confirm Remove All Partipants
                </Button>
              ) : (
                <Button
                  onClick={(e) => {
                    e.preventDefault();
                    setCanRemoveAll(true);
                  }}
                >
                  Remove All Particpants
                </Button>
              )}
            </Form>
          </Card>
          <Card>
            <h2>Drawn Raffle Entries ({drawnRaffleEntries?.length})</h2>

            <ul>
              {drawnRaffleEntries &&
                drawnRaffleEntries.map((raffleEntry) => {
                  const matchingUser = users.find((user) => {
                    return user.id === raffleEntry.userId;
                  });

                  return (
                    <RaffleEntryListItem key={raffleEntry.id}>
                      {matchingUser?.email}
                    </RaffleEntryListItem>
                  );
                })}
            </ul>
          </Card>
        </>
      )}
    </Grid>
  );
}
