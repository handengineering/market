import { Link } from "@remix-run/react";
import { format, parseISO } from "date-fns";
import type { RaffleWithMatchingProducts } from "~/models/raffle.server";
import { styled } from "~/styles/stitches.config";
import { getRaffleActivityStatus } from "~/utils/raffle";
import Button from "~/components/Button";
import Image from "~/components/Image";
import clsx from "clsx";

export const RaffleDate = styled("p", {
  fontSize: "$2",
  marginBottom: "$3",
  opacity: ".5",
});

export interface RaffleItemProps {
  raffle: RaffleWithMatchingProducts;
  currentDateTime: string;
  raffleEntryExists: boolean;
}

const raffleStatusClasses = {
  base: "bg-neutral100 rounded py-1 px-2 mb-4 border-2 border-solid text-sm",
  status: {
    UPCOMING: "text-yellow-700 bg-yellow300 border-yellow500",
    ACTIVE: "text-green-700 bg-green300 border-green500",
    PAST: "text-red-700 bg-red300 border-red500",
    UNKNOWN: "text-neutral-700 bg-neutral300 border-neutral500",
  },
};

export default function RaffleItem({
  raffle,
  currentDateTime,
  raffleEntryExists,
  ...rest
}: RaffleItemProps) {
  const formattedStartDateTime = format(
    parseISO(raffle.startDateTime.toString()),
    "do MMMM yyyy"
  );

  const formattedEndDateTime = format(
    parseISO(raffle.endDateTime.toString()),
    "do MMMM yyyy"
  );
  let raffleStatus = getRaffleActivityStatus(
    raffle.startDateTime.toString(),
    raffle.endDateTime.toString(),
    currentDateTime
  );

  return (
    <div
      {...rest}
      className="relative mb-6 flex flex-1 flex-col items-center after:absolute after:bottom-0 after:left-0 after:-z-10 after:h-3/4 after:w-full after:rounded after:bg-gradient-to-b after:from-neutral300 after:to-neutral100 after:content-['']"
    >
      <Image
        src={raffle.products[0].image}
        alt={raffle.name}
        className="mb-6 w-3/4"
      />
      <h2 className="mb-4 whitespace-nowrap text-lg text-primary500">
        {raffle.name}
      </h2>

      <span
        className={clsx(
          raffleStatusClasses.base,
          raffleStatus && raffleStatusClasses.status[raffleStatus]
        )}
      >
        {getRaffleActivityStatus(
          raffle.startDateTime.toString(),
          raffle.endDateTime.toString(),
          currentDateTime
        )}
      </span>
      <RaffleDate>
        {formattedStartDateTime}–{formattedEndDateTime}
      </RaffleDate>
      <br />
      <p className="mb-2">From {raffle.products[0].formattedPrice}</p>
      <Link to={raffle.id}>
        <Button color="primary" className="mb-2">
          View Details
        </Button>
      </Link>
      <RaffleDate>{raffleEntryExists && `Raffle Entry Submitted`}</RaffleDate>
    </div>
  );
}
