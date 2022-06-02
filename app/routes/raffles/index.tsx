import { useLoaderData } from "@remix-run/react";
import type { LoaderFunction } from "@remix-run/server-runtime";
import Grid from "~/components/Grid";
import RaffleItem from "~/components/RaffleItem";
import type {
  Raffle,
  RaffleWithMatchingProducts,
} from "~/models/raffle.server";
import { getRaffles } from "~/models/raffle.server";
import type { RaffleEntry } from "~/models/raffleEntry.server";
import { getRaffleEntriesByUserId } from "~/models/raffleEntry.server";
import { authenticator } from "~/services/auth.server";
import commerce from "~/services/commerce.server";

type LoaderData = {
  rafflesWithMatchingProducts?: RaffleWithMatchingProducts[];
  raffleEntries?: RaffleEntry[];
  currentDateTime: string;
};

export let loader: LoaderFunction = async ({ request }) => {
  const raffles: Raffle[] = await getRaffles();

  let user = await authenticator.isAuthenticated(request, {
    failureRedirect: "/login",
  });

  const rafflesWithMatchingProducts = await Promise.all(
    raffles.map(async (raffle) => {
      const matchingProducts = await Promise.all(
        raffle.productSlugs.map(async (productSlug) => {
          const product = await commerce.getProduct("en", productSlug);
          return product;
        })
      );

      return {
        ...raffle,
        products: matchingProducts,
      };
    })
  );

  let raffleEntries = await getRaffleEntriesByUserId(user.id);

  let currentDateTime = new Date().toISOString();

  return { raffleEntries, rafflesWithMatchingProducts, currentDateTime };
};

export default function Raffles() {
  const { raffleEntries, rafflesWithMatchingProducts, currentDateTime } =
    useLoaderData() as LoaderData;
  return (
    <>
      <h2>All Raffles</h2>
      <Grid columns={2}>
        {rafflesWithMatchingProducts &&
          rafflesWithMatchingProducts.map((raffle) => {
            const raffleEntryExists = !!raffleEntries?.some(
              (raffleEntry) => raffleEntry.raffleId === raffle.id
            );

            return (
              <RaffleItem
                key={raffle.id}
                raffle={raffle}
                currentDateTime={currentDateTime}
                raffleEntryExists={raffleEntryExists}
              />
            );
          })}
      </Grid>
    </>
  );
}
