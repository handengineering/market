import { isEmailBurner } from "burner-email-providers";
import { validateEmail } from "~/utils";
import type { VerifyEmailFunction } from "remix-auth-email-link";

export let verifyEmailAddress: VerifyEmailFunction = async (email) => {
  if (!validateEmail(email)) throw new Error("Invalid email address.");
  if (!email.includes("@example.com") && isEmailBurner(email))
    throw new Error("Invalid email address.");
};
