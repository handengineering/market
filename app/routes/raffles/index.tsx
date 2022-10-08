import { useLoaderData } from "@remix-run/react";
import type { LoaderFunction } from "@remix-run/server-runtime";
import type { DiscordProfile } from "remix-auth-socials";
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
import { getDiscordGuildMembershipByProfileId } from "~/services/discord.server";

type LoaderData = {
  rafflesWithMatchingProducts?: RaffleWithMatchingProducts[];
  raffleEntries?: RaffleEntry[];
  currentDateTime: string;
  discordProfile: DiscordProfile | null;
  isMemberOfDiscord: boolean;
};

export let loader: LoaderFunction = async ({ request }) => {
  const raffles: Raffle[] = await getRaffles();

  let user = await authenticator.isAuthenticated(request, {
    failureRedirect: "/login",
  });

  const discordProfile = await getDiscordProfileByUserId(user.id);

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

  const discordGuildProfile =
    discordProfile &&
    (await getDiscordGuildMembershipByProfileId(discordProfile.id));

  const isMemberOfDiscord = discordGuildProfile?.user?.id;

  return {
    raffleEntries,
    rafflesWithMatchingProducts,
    currentDateTime,
    discordProfile: discordProfile,
    isMemberOfDiscord: isMemberOfDiscord,
  };
};

export default function Raffles() {
  const {
    raffleEntries,
    rafflesWithMatchingProducts,
    currentDateTime,
    discordProfile,
    isMemberOfDiscord,
  } = useLoaderData() as LoaderData;

  return (
    <>
      <h1 className="mb-6 font-soehneBreit text-xl">All Raffles</h1>

      {!discordProfile ? (
        <Banner linkText="Connect your Discord Account" linkUrl="/dashboard">
          You need to connect your Discord account, and be a member of the Hand
          Engineering Discord to join raffles. Connect your Discord profile
          here:
        </Banner>
      ) : null}
      {!isMemberOfDiscord && discordProfile ? (
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
                disabled={!isMemberOfDiscord}
              />
            );
          })}
      </div>
    </>
  );
}
