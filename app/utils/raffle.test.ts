import { getRaffleActivityStatus, RaffleActivityStatus } from "./raffle";

const earlyDateTime = new Date("01 January 2022 12:00 UTC");
const middleDateTime = new Date("01 Febuary 2022 12:00 UTC");
const lateDateTime = new Date("01 March 2022 12:00 UTC");

test("getRaffleActivityStatus returns the correct activity status", () => {
  expect(
    getRaffleActivityStatus(earlyDateTime, middleDateTime, lateDateTime)
  ).toBe(RaffleActivityStatus.PAST);
  expect(
    getRaffleActivityStatus(earlyDateTime, lateDateTime, middleDateTime)
  ).toBe(RaffleActivityStatus.ACTIVE);
  expect(
    getRaffleActivityStatus(middleDateTime, lateDateTime, earlyDateTime)
  ).toBe(RaffleActivityStatus.UPCOMING);
});
