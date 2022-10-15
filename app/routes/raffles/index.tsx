import type { User } from "@prisma/client";
import type { MetaFunction } from "@remix-run/node";
import { useFetcher, useLoaderData } from "@remix-run/react";
import type { LoaderFunction } from "@remix-run/server-runtime";
import { useEffect } from "react";
import invariant from "tiny-invariant";
import Banner from "~/components/Banner";
import RaffleItem from "~/components/RaffleItem";
import { getDiscordProfileByUserId } from "~/models/discordProfile.server";
import type {
  Raffle,
  RaffleWithMatchingProducts,
} from "~/models/raffle.server";
import { getRaffles } from "~/models/raffle.server";
import type { RaffleEntry } from "~/models/raffleEntry.server";
import { getRaffleEntriesByUserId } from "~/models/raffleEntry.server";
import { authenticator } from "~/services/auth.server";
import commerce from "~/services/commerce.server";
import { generateLoginLink } from "~/utils/discord";

type LoaderData = {
  rafflesWithMatchingProducts?: RaffleWithMatchingProducts[];
  raffleEntries?: RaffleEntry[];
  currentDateTime: string;
  discordProfile: { id: string } | null;
  currentUrl: string;
  user?: User;
  discordLinkUrl: string;
};

export let loader: LoaderFunction = async ({ request }) => {
  const raffles: Raffle[] = await getRaffles();

  let user = await authenticator.isAuthenticated(request);

  const discordProfile = user && (await getDiscordProfileByUserId(user.id));

  invariant(process.env.BASE_URL, "BASE_URL not set");

  const discordLinkUrl = generateLoginLink(process.env.BASE_URL, "/raffles");

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

  let raffleEntries = user && (await getRaffleEntriesByUserId(user.id));

  let currentDateTime = new Date().toISOString();

  return {
    raffleEntries,
    rafflesWithMatchingProducts,
    currentDateTime,
    discordProfile: discordProfile,
    currentUrl: request.url,
    user,
    discordLinkUrl,
  };
};

export let meta: MetaFunction<typeof loader> = ({
  data,
}: {
  data: LoaderData;
  params: any;
}) => {
  const { rafflesWithMatchingProducts } = data;
  const firstRaffleWithMatchingProducts = rafflesWithMatchingProducts
    ? rafflesWithMatchingProducts[0]
    : undefined;
  const matchingProduct = firstRaffleWithMatchingProducts
    ? firstRaffleWithMatchingProducts.products[0]
    : undefined;
  const productImage = matchingProduct ? matchingProduct.image : "";
  return {
    title: `Hand Engineering Raffles`,
    description: "Hand Engineering Raffles",
    "twitter:card": `Hand Engineering Raffles`,
    "twitter:site": "@haveanicedayeng",
    "twitter:title": `Hand Engineering Raffles`,
    "twitter:description": `Hand Engineering Raffles`,
    "twitter:creator": "@haveanicedayeng",
    "twitter:image": productImage,
    "og:title": `Hand Engineering Raffles`,
    "og:type": "website",
    "og:url": data.currentUrl,
    "og:image": productImage,
    "og:description": `Hand Engineering Raffles`,
    "og:site_name": "Hand Engineering",
  };
};

export default function Raffles() {
  const {
    raffleEntries,
    rafflesWithMatchingProducts,
    currentDateTime,
    discordProfile,
    user,
    discordLinkUrl,
  } = useLoaderData() as LoaderData;

  const fetcher = useFetcher();

  useEffect(() => {
    if (fetcher.type === "init") {
      fetcher.load(`/discordProfile/${discordProfile?.id}/isGuildMember`);
    }
  }, [fetcher, discordProfile]);

  const isMemberOfDiscord = fetcher.data;

  return (
    <>
      <h1 className="mb-8 font-soehneBreit text-xl">All Raffles</h1>

      {!user ? (
        <Banner linkText="Join Hand Engineering Market" linkUrl="/login">
          You need an account to enter raffles.
        </Banner>
      ) : null}

      {!discordProfile && user ? (
        <Banner
          linkText="Connect your Discord Account"
          linkUrl={discordLinkUrl}
        >
          You need to connect your Discord account, and be a member of the Hand
          Engineering Discord to join raffles. Connect your Discord profile
          here:
        </Banner>
      ) : null}
      {!isMemberOfDiscord && discordProfile && fetcher.type === "done" ? (
        <Banner
          linkText="Join Hand Engineering on Discord"
          linkUrl="https://discord.gg/handengineering"
        >
          You need to be a member of the Hand Engineering Discord to join
          raffles. Join here:
        </Banner>
      ) : null}
      <div className={"grid gap-6 md:grid-cols-2 lg:grid-cols-3"}>
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
                disabled={
                  !isMemberOfDiscord &&
                  !!discordProfile &&
                  fetcher.type === "done"
                }
              />
            );
          })}
      </div>
    </>
  );
}
