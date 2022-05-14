import { Link, Outlet, useLoaderData } from "@remix-run/react";
import type { LoaderFunction } from "@remix-run/server-runtime";
import AppContainer from "~/components/AppContainer";
import Card from "~/components/Card";
import Main from "~/components/Main";
import type { Raffle } from "~/models/raffle.server";
import { getRaffles } from "~/models/raffle.server";

type LoaderData = {
  raffles?: Raffle[];
};

export let loader: LoaderFunction = async ({ request }) => {
  const raffles: Raffle[] = await getRaffles();

  return { raffles };
};

export default function Raffles() {
  const { raffles } = useLoaderData() as LoaderData;

  return (
    <AppContainer>
      <Main>
        <Card>
          <h1>Hand Engineering Raffles</h1>

          {raffles && (
            <ul>
              {raffles.map((raffle) => {
                return (
                  <li key={raffle.id}>
                    <Link to={`/raffles/${raffle.id}`}>
                      {raffle.name} {raffle.id}
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </Card>
        <Outlet />
      </Main>
    </AppContainer>
  );
}
