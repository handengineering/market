import { Link, useLoaderData } from "@remix-run/react";
import type { LoaderFunction } from "@remix-run/server-runtime";
import Button from "~/components/Button";
import Card from "~/components/Card";
import Grid from "~/components/Grid";
import { RaffleTitle } from "~/components/RaffleItem";
import type { FullProduct } from "~/models/ecommerce-provider.server";
import type { Raffle } from "~/models/raffle.server";
import { getRaffles } from "~/models/raffle.server";
import type { RaffleEntry } from "~/models/raffleEntry.server";
import commerce from "~/services/commerce.server";

type RaffleWithMatchingProducts = Raffle & { products: FullProduct[] };

type LoaderData = {
  rafflesWithMatchingProducts?: RaffleWithMatchingProducts[];
  raffleEntries?: RaffleEntry[];
};

export let loader: LoaderFunction = async ({ request }) => {
  const raffles: Raffle[] = await getRaffles();

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

  return { rafflesWithMatchingProducts };
};

export default function Raffles() {
  const { rafflesWithMatchingProducts } = useLoaderData() as LoaderData;

  return (
    <>
      <h2>All Raffles</h2>
      <Grid layout={{ "@initial": "mobile", "@bp2": "desktop" }}>
        {rafflesWithMatchingProducts &&
          rafflesWithMatchingProducts.map((raffle) => {
            return (
              <Card key={raffle.id}>
                <RaffleTitle>{raffle.name}</RaffleTitle>

                <p>From {raffle.products[0].formattedPrice}</p>
                <Link to={raffle.id}>
                  <Button size="large" color="primary">
                    View Details
                  </Button>
                </Link>
              </Card>
            );
          })}
      </Grid>
    </>
  );
}
