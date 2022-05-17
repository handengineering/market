import { useLoaderData } from "@remix-run/react";
import type { ActionFunction, LoaderFunction } from "@remix-run/server-runtime";
import Card from "~/components/Card";
import Grid from "~/components/Grid";

import type { RaffleEntry } from "~/models/raffleEntry.server";
import { getRaffleEntriesByRaffleId } from "~/models/raffleEntry.server";
import { createRaffleEntry } from "~/models/raffleEntry.server";
import type { User } from "~/models/user.server";
import { getUsers } from "~/models/user.server";
import { authenticator } from "~/services/auth.server";

type LoaderData = {
  raffleEntries?: RaffleEntry[];
  users?: User[];
};

export let loader: LoaderFunction = async ({ request, params }) => {
  const raffleId = params.raffleId as string;

  const raffleEntries = await getRaffleEntriesByRaffleId(raffleId);

  const users = await getUsers();

  return { raffleEntries, users };
};

export let action: ActionFunction = async ({ request, params }) => {
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: "/login",
  });

  const raffleId = params.raffleId as string;

  return await createRaffleEntry(raffleId, user.id);
};

export default function RaffleId() {
  const { raffleEntries, users } = useLoaderData() as LoaderData;
  return (
    <Grid>
      {raffleEntries && users && (
        <>
          <Card>
            <ul>
              {raffleEntries.map((raffleEntry) => {
                const matchingUser = users.find((user) => {
                  return user.id === raffleEntry.userId;
                });

                return <li key={raffleEntry.id}>{matchingUser?.email}</li>;
              })}
            </ul>
          </Card>
          <Card></Card>
          <Card></Card>
        </>
      )}
    </Grid>
  );
}
