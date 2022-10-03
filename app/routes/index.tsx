import { authenticator } from "~/services/auth.server";
import type { LoaderFunction } from "@remix-run/server-runtime";
import Image from "~/components/Image";
import Banner from "~/components/Banner";

export default function Screen() {
  return (
    <>
      <Banner className="mb-4" linkText="View Raffles" linkUrl="/raffles">
        2000 Mini SE Raffle live Monday 17th October, 2022.
      </Banner>
      <Image src="/images/banner.png" />
    </>
  );
}

export let loader: LoaderFunction = async ({ request }) => {
  return await authenticator.isAuthenticated(request, {
    failureRedirect: "/login",
  });
};
