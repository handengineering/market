import invariant from "tiny-invariant";
import formData from "form-data";
import Mailgun from "mailgun.js";
import type { SendEmailFunction } from "remix-auth-email-link";
import type { User } from "~/models/user.server";

const mailgun = new Mailgun(formData);

export let sendMagicLinkEmail: SendEmailFunction<User> = async (options) => {
  invariant(process.env.MAILGUN_API_KEY, "MAILGUN_API_KEY must be set");

  let subject = "Here's your Magic sign-in link";

  const msg = {
    to: options.emailAddress, // Change to your recipient
    from: "Hand Engineering <contact@hand.engineering>", // Change to your verified sender
    subject: subject,
    text: "Click here to login onto Hand Engineering Market",
    template: "main",
    "h:X-Mailgun-Variables": JSON.stringify({
      title: subject,
      description: `<a href="${options.magicLink}">Click here to login in to Hand Engineering Market</a>`,
    }),
  };

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
  console.log(msg);
};

export let sendConfirmationEmail = async (
  emailAddress: string,
  productName: string,
  confirmationLink: string
) => {
  invariant(process.env.MAILGUN_API_KEY, "MAILGUN_API_KEY must be set");

  let subject = `Congratulations, you have won a spot in the ${productName} raffle`;

  const msg = {
    to: emailAddress, // Change to your recipient
    from: "Hand Engineering <contact@hand.engineering>", // Change to your verified sender
    subject: subject,
    text: "Click here to complete your purchase",
    template: "main",
    "h:X-Mailgun-Variables": JSON.stringify({
      // be sure to stringify your payload
      title: subject,
      description: `<a href="${confirmationLink}">Click here to complete your purchase</a>`,
    }),
  };

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
  console.log(msg);
};
