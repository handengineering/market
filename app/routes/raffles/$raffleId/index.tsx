import { Link, useLoaderData } from "@remix-run/react";
import type { LoaderFunction } from "@remix-run/server-runtime";
import Button from "~/components/Button";
import type { FullProduct } from "~/models/ecommerce-provider.server";
import type { Raffle } from "~/models/raffle.server";
import { getRaffleById } from "~/models/raffle.server";
import type { RaffleEntry } from "~/models/raffleEntry.server";
import { getRaffleEntriesByUserId } from "~/models/raffleEntry.server";
import { authenticator } from "~/services/auth.server";
import commerce from "~/services/commerce.server";

type RaffleWithMatchingProducts = Raffle & { products: FullProduct[] };

type LoaderData = {
  raffleWithMatchingProducts?: RaffleWithMatchingProducts;
  raffleEntry?: RaffleEntry;
};

export let loader: LoaderFunction = async ({ request, params }) => {
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: "/login",
  });
  const raffleId = params.raffleId as string;
  const raffle: Raffle | null = await getRaffleById(raffleId);
  const raffleEntries = await getRaffleEntriesByUserId(user.id);

  const raffleEntry = raffleEntries.find(
    (raffleEntry) =>
      raffleEntry.userId === user.id && raffleEntry.raffleId === raffleId
  );

  const matchingProducts =
    raffle &&
    (await Promise.all(
      raffle.productSlugs.map(async (productSlug) => {
        const product = await commerce.getProduct("en", productSlug);
        return product;
      })
    ));

  const raffleWithMatchingProducts = {
    ...raffle,
    products: matchingProducts,
  };

  return { raffleWithMatchingProducts, raffleEntry };
};

export default function Index() {
  const { raffleWithMatchingProducts, raffleEntry } =
    useLoaderData() as LoaderData;

  return (
    <>
      {raffleWithMatchingProducts ? (
        <>
          <h1 className="mb-4 font-soehneBreit text-xl font-bold uppercase text-primary-500">
            {raffleWithMatchingProducts.name}
          </h1>
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <img
                src={raffleWithMatchingProducts.products[0].image}
                alt={raffleWithMatchingProducts?.name}
                width="100%"
              />
            </div>
            <div className="flex flex-col justify-between">
              <div>
                <h2 className="mb-4 text-lg">Description</h2>
                <p className="mb-6">
                  {raffleWithMatchingProducts.products[0].description}
                </p>
              </div>
              {!raffleEntry ? (
                <Link
                  to={`/raffles/${raffleWithMatchingProducts.id}/configure`}
                >
                  <Button
                    color="primary"
                    className="w-full rounded-lg py-6 text-xl"
                  >
                    Configure
                  </Button>
                </Link>
              ) : (
                <Button disabled className="w-full rounded-lg py-6 text-xl">
                  Entry Sent
                </Button>
              )}
            </div>
          </div>
        </>
      ) : null}
    </>
  );
}
