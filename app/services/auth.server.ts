// app/services/auth.server.ts
import { Authenticator } from "remix-auth";
import { EmailLinkStrategy } from "remix-auth-email-link";
import invariant from "tiny-invariant";
import { createUser, getUserByEmail } from "~/models/user.server";
import { sessionStorage } from "./session.server";
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

      console.log(user);

      if (!user) return await createUser(email);

      return user;
    }
  ),
  "email-link"
);
