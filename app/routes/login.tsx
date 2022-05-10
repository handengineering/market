import { useLoaderData, Form } from "@remix-run/react";
import {
  ActionFunction,
  json,
  LoaderFunction,
} from "@remix-run/server-runtime";
import AppContainer from "~/components/AppContainer";
import Button from "~/components/Button";
import Card from "~/components/Card";
import Input from "~/components/Input";
import Label from "~/components/Label";
import Main from "~/components/Main";
import { authenticator } from "~/services/auth.server";
import { sessionStorage } from "~/services/session.server";

export let loader: LoaderFunction = async ({ request }) => {
  await authenticator.isAuthenticated(request, { successRedirect: "/dashboard" });
  let session = await sessionStorage.getSession(request.headers.get("Cookie"));
  // This session key `auth:magiclink` is the default one used by the EmailLinkStrategy
  // you can customize it passing a `sessionMagicLinkKey` when creating an
  // instance.
  if (session.has("auth:magiclink")) return json({ magicLinkSent: true });
  return json({ magicLinkSent: false });
};

export let action: ActionFunction = async ({ request }) => {
  // The success redirect is required in this action, this is where the user is
  // going to be redirected after the magic link is sent, note that here the
  // user is not yet authenticated, so you can't send it to a private page.
  await authenticator.authenticate("email-link", request, {
    successRedirect: "/dashboard",
    // If this is not set, any error will be throw and the ErrorBoundary will be
    // rendered.
    failureRedirect: "/login",
  });
};

// app/routes/login.tsx
export default function Login() {
  let { magicLinkSent } = useLoaderData<{ magicLinkSent: boolean }>();
  return (
    <AppContainer>
      <Main>
        <Card position="center">
          <Form action="/login" method="post">
            <h2>Log in to your account.</h2>
            <div>
              <Label htmlFor="email">Email address</Label>
              <Input fullWidth id="email" type="email" name="email" required />
            </div>
            {magicLinkSent ? (
              "Magic link has been sent!"
            ) : (
              <Button fullWidth color="primary">
                Email a login link
              </Button>
            )}
          </Form>
        </Card>
      </Main>
    </AppContainer>
  );
}
