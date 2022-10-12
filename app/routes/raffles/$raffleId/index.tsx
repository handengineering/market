import { Link, useLoaderData } from "@remix-run/react";
import type { LoaderFunction } from "@remix-run/server-runtime";
import { redirect } from "@remix-run/server-runtime";
import clsx from "clsx";
import {
  formatDuration,
  intervalToDuration,
  isAfter,
  isBefore,
} from "date-fns";
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
import type { RaffleActivityStatus } from "~/utils/raffle";
import { getRaffleActivityStatus, getRaffleStatusText } from "~/utils/raffle";
import durationMachine from "./durationMachine";
import { marked } from "marked";
import type { MetaFunction } from "@remix-run/node";
import type { DiscordProfile, User } from "@prisma/client";
import Banner from "~/components/Banner";
import { getDiscordGuildMembershipByProfileId } from "~/services/discord.server";

type RaffleWithMatchingProducts = Raffle & {
  products: (FullProduct | undefined)[];
};

type LoaderData = {
  raffleWithMatchingProducts: RaffleWithMatchingProducts;
  raffleEntry?: RaffleEntry;
  currentUrl: string;
  user?: User;
  discordProfile?: DiscordProfile;
  isMemberOfDiscord: boolean;
};

export let loader: LoaderFunction = async ({ request, params }) => {
  const user = await authenticator.isAuthenticated(request);
  const raffleId = params.raffleId as string;
  const raffle: Raffle | null = await getRaffleById(raffleId);
  const raffleEntries = user && (await getRaffleEntriesByUserId(user.id));

  const discordProfile = user && (await getDiscordProfileByUserId(user.id));

  const discordGuildProfile =
    discordProfile &&
    (await getDiscordGuildMembershipByProfileId(discordProfile.id));

  const isMemberOfDiscord = !!discordGuildProfile?.user?.id;

  if (!raffle) {
    return redirect("/raffles");
  }

  const raffleEntry =
    raffleEntries &&
    raffleEntries.find(
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

  return {
    raffleWithMatchingProducts,
    raffleEntry,
    currentUrl: request.url,
    user,
    discordProfile,
    isMemberOfDiscord,
  };
};

export let meta: MetaFunction<typeof loader> = ({
  data,
}: {
  data: LoaderData;
  params: any;
}) => {
  const firstProduct = data.raffleWithMatchingProducts.products[0];

  invariant(firstProduct, "firstProduct not found");

  const { startDateTime } = data.raffleWithMatchingProducts;
  const { title, description } = firstProduct;
  const formattedStartDateTime = formatDateTime(startDateTime);

  const fullDescription = `${title} Raffle is going live on ${formattedStartDateTime}. ${description}`;

  return {
    title: `${title} Raffle`,
    description: fullDescription,
    "twitter:card": `${title} Raffle`,
    "twitter:site": "@haveanicedayeng",
    "twitter:title": `${title} Raffle`,
    "twitter:description": `${title} Raffle is going live on ${formattedStartDateTime}. More info: ${data.currentUrl}.`,
    "twitter:creator": "@haveanicedayeng",
    "twitter:image": firstProduct.image,
    "og:title": `${title} Raffle`,
    "og:type": "website",
    "og:url": data.currentUrl,
    "og:image": firstProduct.image,
    "og:description": fullDescription,
    "og:site_name": "Hand Engineering",
  };
};

function getRaffleActivityInfo(
  raffleEntry: RaffleEntry | undefined,
  raffleWithMatchingProducts: RaffleWithMatchingProducts,
  canEnterRaffle: boolean,
  raffleActivityStatus: RaffleActivityStatus,
  getRaffleActivitySubtitle: (status: RaffleActivityStatus) => string
) {
  if (!raffleEntry && raffleActivityStatus !== "PAST") {
    return (
      <>
        <Link to={`/raffles/${raffleWithMatchingProducts.id}/configure`}>
          <Button
            color={canEnterRaffle ? "disabled" : "primary"}
            size="large"
            disabled={canEnterRaffle}
            className="w-full"
          >
            {raffleActivityStatus === "ACTIVE"
              ? "Enter Raffle"
              : getRaffleActivitySubtitle(raffleActivityStatus)}
          </Button>
        </Link>
      </>
    );
  }

  if (raffleEntry) {
    return (
      <>
        Entry successful!{" "}
        <div className="text-yellow-700">
          Sent on {formatDateTime(raffleEntry.createdAt)}
        </div>
        <div className="text-yellow-700">
          Status: {getRaffleStatusText(raffleEntry.status)}
        </div>
      </>
    );
  }

  return (
    <>
      You didn't enter this raffle{" "}
      <div className="text-yellow-700">
        Raffle drawn on {formatDateTime(raffleWithMatchingProducts.endDateTime)}
      </div>
    </>
  );
}

export default function Index() {
  const {
    raffleWithMatchingProducts,
    raffleEntry,
    user,
    discordProfile,
    isMemberOfDiscord,
  } = useLoaderData() as unknown as LoaderData;

  const { startDateTime, status, endDateTime, name } =
    raffleWithMatchingProducts;

  const [state] = useMachine(durationMachine, {
    context: {
      startDateTime,
      timeUntilRaffle: formatDuration(
        intervalToDuration({
          start: new Date(),
          end: new Date(startDateTime),
        })
      ),
    },
  });

  const { timeUntilRaffle } = state.context;

  function getRaffleActivitySubtitle(
    raffleActivityStatus: RaffleActivityStatus
  ) {
    switch (raffleActivityStatus) {
      case "UPCOMING":
        return timeUntilRaffle;
      case "ACTIVE":
        return "Live now";
      case "PAST":
        return "Completed";
      default:
        return "Unknown";
    }
  }

  const raffleActivityStatus = getRaffleActivityStatus(
    startDateTime.toString(),
    endDateTime.toString(),
    new Date().toISOString()
  );

  const firstRaffleProduct = raffleWithMatchingProducts.products[0];

  if (!firstRaffleProduct) {
    return redirect("/raffles");
  }

  const { metafields } = firstRaffleProduct;

  console.log(metafields);

  const componentsMetafield = metafields.find(
    (metafield) => metafield.key === "components"
  );
  const accessoriesMetafield = metafields.find(
    (metafield) => metafield.key === "accessories"
  );

  const currentDateTime = new Date();

  const canEnterRaffle =
    isBefore(currentDateTime, new Date(startDateTime)) ||
    isAfter(currentDateTime, new Date(endDateTime));

  return (
    <>
      <>
        {!user ? (
          <Banner linkText="Join Hand Engineering Market" linkUrl="/login">
            You need an account to enter raffles.
          </Banner>
        ) : null}

        {!discordProfile && user ? (
          <Banner linkText="Connect your Discord Account" linkUrl="/dashboard">
            You need to connect your Discord account, and be a member of the
            Hand Engineering Discord to join raffles. Connect your Discord
            profile here:
          </Banner>
        ) : null}
        {!isMemberOfDiscord && discordProfile && user ? (
          <Banner
            linkText="Join Hand Engineering on Discord"
            linkUrl="https://discord.gg/handengineering"
          >
            You need to be a member of the Hand Engineering Discord to join
            raffles. Join here:
          </Banner>
        ) : null}
        {firstRaffleProduct ? (
          <div className="grid-cols-3 gap-16 md:grid">
            <div className="col-span-2">
              <div className="flex flex-col">
                <div className="flex items-center gap-4 md:basis-2/3">
                  <h1 className="mb-4 font-soehneBreit text-2xl text-primary-500">
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

                <div>
                  <div>
                    <p className="mb-2 text-xl">
                      {formatDateTime(startDateTime)}–
                      {formatDateTime(endDateTime)}{" "}
                    </p>
                  </div>
                  <div className="mb-6 text-sm text-neutral-700">
                    {getRaffleActivitySubtitle(raffleActivityStatus)}
                  </div>
                </div>
              </div>
              <img
                src={firstRaffleProduct.image}
                alt={raffleWithMatchingProducts?.name}
                width="100%"
              />
            </div>
            <div className="col-span-1 flex flex-col">
              {user && discordProfile && isMemberOfDiscord ? (
                <div className="mb-4 rounded-md bg-yellow-100 p-4">
                  {getRaffleActivityInfo(
                    raffleEntry,
                    raffleWithMatchingProducts,
                    canEnterRaffle,
                    raffleActivityStatus,
                    getRaffleActivitySubtitle
                  )}
                </div>
              ) : null}
              <div>
                <p className="mb-6 text-2xl">
                  {firstRaffleProduct.formattedPrice}
                </p>
                {componentsMetafield ? (
                  <div
                    dangerouslySetInnerHTML={{
                      __html: marked.parse(componentsMetafield?.value),
                    }}
                    className="prose prose-brand"
                  />
                ) : null}
                {accessoriesMetafield ? (
                  <div
                    dangerouslySetInnerHTML={{
                      __html: marked.parse(accessoriesMetafield?.value),
                    }}
                    className="prose prose-brand"
                  />
                ) : null}
              </div>
            </div>
          </div>
        ) : null}
      </>
    </>
  );
}
