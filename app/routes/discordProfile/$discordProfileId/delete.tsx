import invariant from "tiny-invariant";
import {
  deleteDiscordProfileById,
  getDiscordProfileByUserId,
} from "~/models/discordProfile.server";
import { authenticator, discordAuthenticator } from "~/services/auth.server";
import type { ActionFunction } from "@remix-run/server-runtime";

export let action: ActionFunction = async ({ request, params }) => {
  let user = await authenticator.isAuthenticated(request, {
    failureRedirect: "/login",
  });

  const discordProfileId = params.discordProfileId as string;
  const discordProfile = await getDiscordProfileByUserId(user.id);

  invariant(discordProfile, `DiscordProfile not found for User ${user.id}`);

  if ((discordProfile.userId = user.id)) {
    try {
      await deleteDiscordProfileById(discordProfileId);
    } catch (e) {
      console.error(e);
    }
  }

  return discordAuthenticator.logout(request, { redirectTo: "/dashboard" });
};
