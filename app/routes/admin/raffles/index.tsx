import { Link, useLoaderData } from "@remix-run/react";
import type { LoaderFunction } from "@remix-run/server-runtime";
import Button from "~/components/Button";
import Card from "~/components/Card";
import type { FullProduct } from "~/models/ecommerce-provider.server";
import type { Raffle } from "~/models/raffle.server";
import { getRaffles } from "~/models/raffle.server";
import type { RaffleEntry } from "~/models/raffleEntry.server";
import commerce from "~/services/commerce.server";
import { requireAdminPermissions } from "~/services/permissions.server";

type RaffleWithMatchingProducts = Raffle & { products: FullProduct[] };

type LoaderData = {
  rafflesWithMatchingProducts?: RaffleWithMatchingProducts[];
  raffleEntries?: RaffleEntry[];
};

export let loader: LoaderFunction = async ({ request }) => {
  await requireAdminPermissions(request);

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
    <div className="w-full">
      <h2 className="mb-6 font-soehneBreit text-lg">All Raffles</h2>
      <div className="grid w-full gap-6 md:grid-cols-3">
        {rafflesWithMatchingProducts &&
          rafflesWithMatchingProducts.map((raffle) => {
            return (
              <Card
                key={raffle.id}
                className="mb-6 items-center justify-center space-y-6"
              >
                <h2 className="whitespace-nowrap text-lg text-primary500">
                  {raffle.name}
                </h2>
                <p>From {raffle.products[0].formattedPrice}</p>
                <Link to={raffle.id}>
                  <Button size="large" color="primary">
                    View Details
                  </Button>
                </Link>
              </Card>
            );
          })}
      </div>
    </div>
  );
}
