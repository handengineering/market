import { Link, useLoaderData } from "@remix-run/react";
import type { LoaderFunction } from "@remix-run/server-runtime";
import { redirect } from "@remix-run/server-runtime";
import clsx from "clsx";
import { isAfter, isBefore } from "date-fns";
import invariant from "tiny-invariant";
import { useMachine } from "@xstate/react";

import Button from "~/components/Button";
import { raffleStatusClasses } from "~/components/RaffleItem";
import { getDiscordProfileByUserId } from "~/models/discordProfile.server";
import type { FullProduct } from "~/models/ecommerce-provider.server";
import type { Raffle } from "~/models/raffle.server";
import { getRaffleById } from "~/models/raffle.server";
import type { RaffleEntry } from "~/models/raffleEntry.server";
import { getRaffleEntriesByUserId } from "~/models/raffleEntry.server";
import { authenticator } from "~/services/auth.server";
import commerce from "~/services/commerce.server";
import { formatDateTime } from "~/utils/date";
import { getRaffleActivityStatus } from "~/utils/raffle";
import durationMachine from "./durationMachine";

type RaffleWithMatchingProducts = Raffle & {
  products: (FullProduct | undefined)[];
};

type LoaderData = {
  raffleWithMatchingProducts: RaffleWithMatchingProducts;
  raffleEntry?: RaffleEntry;
};

export let loader: LoaderFunction = async ({ request, params }) => {
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: "/login",
  });
  const raffleId = params.raffleId as string;
  const raffle: Raffle | null = await getRaffleById(raffleId);
  const raffleEntries = await getRaffleEntriesByUserId(user.id);

  const discordProfile = getDiscordProfileByUserId(user.id);

  if (!discordProfile) {
    return redirect("/join/discord");
  }

  if (!raffle) {
    return redirect("/raffles");
  }

  const raffleEntry = raffleEntries.find(
    (raffleEntry) =>
      raffleEntry.userId === user.id && raffleEntry.raffleId === raffleId
  );

  const matchingProducts: (FullProduct | undefined)[] = await Promise.all(
    raffle.productSlugs
      .map(async (productSlug) => {
        const product = await commerce.getProduct("en", productSlug);
        return product;
      })
      .filter(Boolean)
  );

  const raffleWithMatchingProducts: RaffleWithMatchingProducts | null = {
    ...raffle,
    products: matchingProducts,
  };

  invariant(
    raffleWithMatchingProducts,
    "no raffle with matching products found"
  );

  if (!raffleWithMatchingProducts) {
    return redirect("/raffles");
  }

  return { raffleWithMatchingProducts, raffleEntry };
};

export default function Index() {
  const { raffleWithMatchingProducts, raffleEntry } =
    useLoaderData() as unknown as LoaderData;

  const { startDateTime, status, endDateTime, name } =
    raffleWithMatchingProducts;

  const [state] = useMachine(durationMachine, {
    context: { startDateTime },
  });

  const { timeUntilRaffle } = state.context;

  console.log(state);

  const raffleActivityStatus = getRaffleActivityStatus(
    startDateTime.toString(),
    endDateTime.toString(),
    new Date().toISOString()
  );

  const firstRaffleProduct = raffleWithMatchingProducts.products[0];

  const currentDateTime = new Date();

  return (
    <>
      <>
        <div>
          <div className="flex flex-col">
            <div className="flex items-center gap-4">
              <h1 className="mb-4  font-soehneBreit text-2xl text-primary-500">
                {name}
              </h1>
              <span
                className={clsx(
                  raffleStatusClasses.base,
                  status && raffleStatusClasses.status[raffleActivityStatus]
                )}
              >
                {raffleActivityStatus}
              </span>
            </div>

            {raffleActivityStatus === "UPCOMING" ? (
              <div>
                <div>
                  <p className="mb-2 text-xl">
                    {formatDateTime(startDateTime)}–
                    {formatDateTime(endDateTime)}{" "}
                  </p>
                </div>
                <div className="mb-6 text-sm text-neutral-700">
                  {timeUntilRaffle}
                </div>
              </div>
            ) : (
              <div>
                <p className="mb-6 text-xl">
                  {formatDateTime(startDateTime)}–{formatDateTime(endDateTime)}{" "}
                </p>
              </div>
            )}
          </div>
        </div>

        {firstRaffleProduct ? (
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <img
                src={firstRaffleProduct.image}
                alt={raffleWithMatchingProducts?.name}
                width="100%"
              />
            </div>
            <div className="flex flex-col justify-between">
              <div>
                <h2 className="mb-4 text-lg">Description</h2>
                <p className="mb-6">{firstRaffleProduct.description}</p>
              </div>
              {!raffleEntry ? (
                <Link
                  to={`/raffles/${raffleWithMatchingProducts.id}/configure`}
                >
                  <Button
                    color={
                      isBefore(currentDateTime, new Date(startDateTime)) ||
                      isAfter(currentDateTime, new Date(endDateTime))
                        ? "disabled"
                        : "primary"
                    }
                    className="w-full rounded-lg py-6 text-xl"
                    disabled={
                      isBefore(currentDateTime, new Date(startDateTime)) ||
                      isAfter(currentDateTime, new Date(endDateTime))
                    }
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
        ) : null}
      </>
    </>
  );
}
