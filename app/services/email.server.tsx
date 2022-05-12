import invariant from "tiny-invariant";
import formData from "form-data";
import Mailgun from "mailgun.js";
import type { SendEmailFunction } from "remix-auth-email-link";
import type { User } from "~/models/user.server";

const mailgun = new Mailgun(formData);

export let sendMagicLinkEmail: SendEmailFunction<User> = async (options) => {
  invariant(process.env.MAILGUN_API_KEY, "MAILGUN_API_KEY must be set");

  let subject = "Here's your Magic sign-in link";

  console.log("Trying to send email");

  const msg = {
    to: options.emailAddress, // Change to your recipient
    from: "contact@hand.engineering", // Change to your verified sender
    subject: subject,
    text: "Click here to login onto Hand Engineering Market",
    html: `<a href="${options.magicLink}">Click here to login onto Hand Engineering Market</a>`,
  };

  console.log(msg);

  console.log(process.env.SENDGRID_API_KEY);

  const mg = mailgun.client({
    username: "api",
    key: process.env.MAILGUN_API_KEY,
    url: "https://api.eu.mailgun.net",
  });

  const result = await mg.messages
    .create("mg.hand.engineering", msg)
    .catch((error: any) => {
      console.log(error);
    });

  console.log(result);
};
