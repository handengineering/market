// app/services/auth.server.ts
import { Authenticator } from "remix-auth";
import { FormStrategy } from "remix-auth-form";
import { DiscordStrategy } from "remix-auth-socials";
import { EmailLinkStrategy } from "remix-auth-email-link";
import invariant from "tiny-invariant";
import { createDiscordProfile } from "~/models/discordProfile.server";
import { getUserByEmail, verifyLogin } from "~/models/user.server";
import { sessionStorage, discordSessionStorage } from "./session.server";
import { sendMagicLinkEmail } from "./email.server";
import { verifyEmailAddress } from "~/services/verifier.server";
import type { User } from "~/models/user.server";

invariant(process.env.DISCORD_CLIENT_ID, "DISCORD_CLIENT_ID must be set");
invariant(
  process.env.DISCORD_CLIENT_SECRET,
  "DISCORD_CLIENT_SECRET must be set"
);
invariant(process.env.MAGIC_LINK_SECRET, "MAGIC_LINK_SECRET must be set");

export let authenticator = new Authenticator<User>(sessionStorage);
export let discordAuthenticator = new Authenticator<User>(
  discordSessionStorage
);

authenticator.use(
  new FormStrategy(async ({ form }) => {
    let email = form.get("email");
    let password = form.get("password");

    invariant(typeof email === "string", "email must be a string");
    invariant(email.length > 0, "username must not be empty");

    invariant(typeof password === "string", "password must be a string");
    invariant(password.length > 0, "password must not be empty");

    let user = await verifyLogin(email, password);

    invariant(user, "user does not exist");

    return user;
  }),
  "user-pass"
);

authenticator.use(
  new EmailLinkStrategy(
    {
      verifyEmailAddress,
      sendEmail: sendMagicLinkEmail,
      secret: process.env.MAGIC_LINK_SECRET,
      callbackURL: "/magic",
    },

    async ({
      email,
      form,
      magicLinkVerify,
    }: {
      email: string;
      form: FormData;
      magicLinkVerify: boolean;
    }) => {
      let user = await getUserByEmail(email);

      invariant(user, "user not found");
      return user;
    }
  )
);

discordAuthenticator.use(
  new DiscordStrategy(
    {
      clientID: process.env.DISCORD_CLIENT_ID,
      clientSecret: process.env.DISCORD_CLIENT_SECRET,
      callbackURL: "/auth/discord/callback",
      scope: ["identify", "email", "guilds"],
    },
    async ({ accessToken, profile }) => {
      invariant(profile, "profile not found");

      const { emails, displayName, id, __json } = profile;
      const { avatar } = __json;

      invariant(emails, "emails not found");
      invariant(avatar, "avatar not found");
      invariant(id, "id not found");

      const discordUserEmail = emails[0].value;
      const originalUser: User | null = await getUserByEmail(discordUserEmail);

      invariant(
        originalUser,
        `can't get original user by email: ${discordUserEmail}`
      );

      createDiscordProfile(
        id,
        originalUser.id,
        displayName,
        avatar,
        accessToken
      );

      return originalUser;
    }
  ),
  "discord"
);
