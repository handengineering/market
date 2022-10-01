import { authenticator } from "~/services/auth.server";
import type { LoaderFunction } from "@remix-run/server-runtime";

export default function Screen() {
  return (
    <>
      <h1 className="mb-6 font-soehneBreit text-xl">Welcome</h1>
    </>
  );
}

export let loader: LoaderFunction = async ({ request }) => {
  return await authenticator.isAuthenticated(request, {
    failureRedirect: "/login",
  });
};
