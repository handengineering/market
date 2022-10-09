import type { RaffleEntryStatus } from "@prisma/client";

export enum RaffleActivityStatus {
  UPCOMING = "UPCOMING",
  ACTIVE = "ACTIVE",
  PAST = "PAST",
  UNKNOWN = "UNKNOWN",
}

export function getRaffleActivityStatus(
  startDateTime: string,
  endDateTime: string,
  currentDateTime: string
): RaffleActivityStatus {
  if (currentDateTime < startDateTime) {
    return RaffleActivityStatus.UPCOMING;
  }

  if (startDateTime < currentDateTime && currentDateTime < endDateTime) {
    return RaffleActivityStatus.ACTIVE;
  }

  if (endDateTime < currentDateTime) {
    return RaffleActivityStatus.PAST;
  }

  return RaffleActivityStatus.UNKNOWN;
}

export function getRaffleStatusText(raffleEntryStatus: RaffleEntryStatus) {
  switch (raffleEntryStatus) {
    case "DRAWN":
      return `You won the raffle`;
    case "CREATED":
      return "Entry successful";
    case "ARCHIVED":
      return "You didn't win the raffle";
    case "CANCELED":
      return "Raffle cancelled";
    default:
      return "Unknown";
  }
}
