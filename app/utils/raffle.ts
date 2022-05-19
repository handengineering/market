export enum RaffleActivityStatus {
  UPCOMING = "UPCOMING",
  ACTIVE = "ACTIVE",
  PAST = "PAST",
  UNKNOWN = "UNKNOWN",
}

export function getRaffleActivityStatus(
  startDateTime: Date,
  endDateTime: Date,
  currentDateTime: Date
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
