import { useLoaderData, Form, Link, useSearchParams } from "@remix-run/react";
import { json } from "@remix-run/server-runtime";
import AppContainer from "~/components/AppContainer";
import Button from "~/components/Button";
import Card from "~/components/Card";
import ErrorText from "~/components/ErrorText";
import Input from "~/components/Input";
import Main from "~/components/Main";
import { authenticator } from "~/services/auth.server";
import { sessionStorage } from "~/services/session.server";
import type {
  ActionFunction,
  ErrorBoundaryComponent,
  LoaderFunction,
} from "@remix-run/server-runtime";
import FormWrapper from "~/components/FormWrapper";
import Label from "~/components/Label";

type LoaderData = {
  magicLinkSent?: boolean;
};

export let loader: LoaderFunction = async ({ request }) => {
  await authenticator.isAuthenticated(request, {
    successRedirect: "/",
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

export const ErrorBoundary: ErrorBoundaryComponent = ({ error }) => {
  return (
    <AppContainer>
      <Main>
        <Card position="center">
          <ErrorText>{error.message}</ErrorText>
          <Link to="/login">Try a different email?</Link>
        </Card>
      </Main>
    </AppContainer>
  );
};

// app/routes/login.tsx
export default function Login() {
  const [searchParams] = useSearchParams();
  let { magicLinkSent } = useLoaderData<LoaderData>();

  return (
    <AppContainer>
      <Main centerItems>
        <h1>Hand Engineering Market</h1>
        <h2>Login</h2>

        <FormWrapper>
          <Form action="/login" method="post">
            <Label>
              Email
              <Input
                id="email"
                type="email"
                name="email"
                aria-label="email"
                required
              />
            </Label>

            {magicLinkSent ? (
              "Magic link has been sent!"
            ) : (
              <Button color="primary">Email a login link</Button>
            )}
          </Form>
        </FormWrapper>

        <div>
          Don't have an account?{" "}
          <Link
            to={{
              pathname: "/join",
              search: searchParams.toString(),
            }}
          >
            Join
          </Link>
        </div>
      </Main>
    </AppContainer>
  );
}
