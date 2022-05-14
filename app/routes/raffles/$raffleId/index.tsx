import { Form, useLoaderData } from "@remix-run/react";
import type { ActionFunction, LoaderFunction } from "@remix-run/server-runtime";
import Button from "~/components/Button";
import Card from "~/components/Card";
import type { Raffle } from "~/models/raffle.server";
import { getRaffleById } from "~/models/raffle.server";
import type { RaffleEntry } from "~/models/raffleEntry.server";
import { getRaffleEntriesByUserId } from "~/models/raffleEntry.server";
import { createRaffleEntry } from "~/models/raffleEntry.server";
import { authenticator } from "~/services/auth.server";

type LoaderData = {
  raffle?: Raffle;
  raffleEntry?: RaffleEntry;
};

export let loader: LoaderFunction = async ({ request, params }) => {
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: "/login",
  });
  const raffleId = params.raffleId as string;
  const raffle = raffleId && (await getRaffleById(raffleId));
  const raffleEntries = await getRaffleEntriesByUserId(user.id);

  const raffleEntry = raffleEntries.find(
    (raffleEntry) =>
      raffleEntry.userId === user.id && raffleEntry.raffleId === raffleId
  );

  return { raffle, raffleEntry };
};

export let action: ActionFunction = async ({ request, params }) => {
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: "/login",
  });

  const raffleId = params.raffleId as string;

  return await createRaffleEntry(raffleId, user.id);
};

export default function LoginId() {
  const { raffle, raffleEntry } = useLoaderData() as LoaderData;

  return (
    <Card>
      <h2>{raffle && raffle.name}</h2>
      <Form method="post">
        {!raffleEntry ? (
          <Button fullWidth color="primary">
            Enter Raffle
          </Button>
        ) : (
          <Button fullWidth disabled>
            Raffle Entry Sent
          </Button>
        )}
      </Form>
    </Card>
  );
}
