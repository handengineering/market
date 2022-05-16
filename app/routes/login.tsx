import { useLoaderData, Form, Link, useSearchParams } from "@remix-run/react";
import { json } from "@remix-run/server-runtime";
import AppContainer from "~/components/AppContainer";
import Button from "~/components/Button";
import Card from "~/components/Card";
import ErrorText from "~/components/ErrorText";
import Input from "~/components/Input";
import Label from "~/components/Label";
import Main from "~/components/Main";
import { authenticator } from "~/services/auth.server";
import { sessionStorage } from "~/services/session.server";
import type {
  ActionFunction,
  ErrorBoundaryComponent,
  LoaderFunction,
} from "@remix-run/server-runtime";
import FormWrapper from "~/components/FormWrapper";

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
        <h1>Log In to Hand Engineering Market</h1>

        <FormWrapper>
          <Form action="/login" method="post">
            <div>
              <Label htmlFor="email">Email address</Label>
              <div>
                <Input id="email" type="email" name="email" required />
              </div>
            </div>
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
