import { useLoaderData, Form, useActionData, Link } from "@remix-run/react";
import {
  ActionFunction,
  ErrorBoundaryComponent,
  json,
  LoaderFunction,
} from "@remix-run/server-runtime";
import AppContainer from "~/components/AppContainer";
import Button from "~/components/Button";
import Card from "~/components/Card";
import ErrorText from "~/components/ErrorText";
import Input from "~/components/Input";
import Label from "~/components/Label";
import Main from "~/components/Main";
import { authenticator } from "~/services/auth.server";
import { sessionStorage } from "~/services/session.server";

type LoaderData = {
  magicLinkSent?: boolean;
};

export let loader: LoaderFunction = async ({ request }) => {
  await authenticator.isAuthenticated(request, {
    successRedirect: "/dashboard",
  });
  let session = await sessionStorage.getSession(request.headers.get("Cookie"));
  // This session key `auth:magiclink` is the default one used by the EmailLinkStrategy
  // you can customize it passing a `sessionMagicLinkKey` when creating an
  // instance.
  if (session.has("auth:magiclink"))
    return json<LoaderData>({ magicLinkSent: true });
  return json<LoaderData>({ magicLinkSent: false });
};

export let action: ActionFunction = async ({ request }) => {
  await authenticator.authenticate("email-link", request, {
    successRedirect: "/login",
  });
};

export const ErrorBoundary: ErrorBoundaryComponent = ({error}) => {
  return (
    <AppContainer>
      <Main>
        <Card position="center">
          <ErrorText>{error.message}</ErrorText>
          <Link to="/login">Try a different email?</Link>
        </Card>
      </Main>
    </AppContainer>
  )
};

// app/routes/login.tsx
export default function Login() {
  let { magicLinkSent } = useLoaderData<LoaderData>();
  let actionData = useActionData<ActionData>();
  const errors = actionData?.errors;

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
