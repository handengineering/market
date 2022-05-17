import { Link, useLoaderData } from "@remix-run/react";
import type { LoaderFunction } from "@remix-run/server-runtime";
import Button from "~/components/Button";
import Grid from "~/components/Grid";
import RaffleItem, {
  RaffleDate,
  RaffleItemImage,
  RaffleStatus,
  RaffleTitle,
} from "~/components/RaffleItem";
import type { FullProduct } from "~/models/ecommerce-provider.server";
import type { Raffle } from "~/models/raffle.server";
import { getRaffles } from "~/models/raffle.server";
import commerce from "~/services/commerce.server";

type RaffleWithMatchingProducts = Raffle & { products: FullProduct[] };

type LoaderData = {
  rafflesWithMatchingProducts?: RaffleWithMatchingProducts[];
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

  console.log(rafflesWithMatchingProducts);

  return (
    <>
      <h2>All Raffles</h2>
      <Grid>
        {rafflesWithMatchingProducts &&
          rafflesWithMatchingProducts.map((raffle) => {
            return (
              <RaffleItem key={raffle.id}>
                <RaffleItemImage
                  src={raffle.products[0].image}
                  alt={raffle.name}
                />
                <RaffleTitle>{raffle.name}</RaffleTitle>

                <RaffleStatus>ACTIVE</RaffleStatus>
                <RaffleDate>July 31st 2022</RaffleDate>
                <br />
                <p>From {raffle.products[0].formattedPrice}</p>
                <Link to={raffle.id}>
                  <Button size="large" color="primary">
                    Continue
                  </Button>
                </Link>
              </RaffleItem>
            );
          })}
      </Grid>
    </>
  );
}
