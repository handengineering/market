import type { ActionFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { useSubmit } from "@remix-run/react";
import { useEffect } from "react";
import invariant from "tiny-invariant";
import { createDiscordProfile } from "~/models/discordProfile.server";
import { authenticator } from "~/services/auth.server";

export default function Screen() {
  let submit = useSubmit();
  useEffect(() => {
    let fragment = new URLSearchParams(window.location.hash.slice(1));

    const accessToken = fragment.get("access_token");
    const tokenType = fragment.get("token_type");
    const state = fragment.get("state");

    accessToken &&
      tokenType &&
      submit(
        { accessToken, tokenType, state: state || "" },
        { method: "post", replace: true }
      );
  });

  return null;
}

export let action: ActionFunction = async ({ request }) => {
  const user = await authenticator.isAuthenticated(request);

  invariant(user, "user not found");

  const formData = await request.formData();
  const tokenType = await formData.get("tokenType");
  const accessToken = await formData.get("accessToken");
  const state = await formData.get("state");

  const decodedState =
    state && JSON.parse(Buffer.from(state.toString(), "base64").toString());

  invariant(accessToken, "accessToken not found");

  const discordProfileResult = await fetch(
    "https://discord.com/api/users/@me",
    {
      headers: {
        authorization: `${tokenType} ${accessToken}`,
      },
    }
  );

  const discordProfileJson = await discordProfileResult.json();

  const { id, username, avatar } = discordProfileJson;

  await createDiscordProfile(
    id,
    user.id,
    username,
    avatar,
    accessToken?.toString()
  );

  return redirect(decodedState.redirectTo || "/");
};
