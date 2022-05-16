import type {
  ActionFunction,
  ErrorBoundaryComponent,
  LoaderFunction,
  MetaFunction,
} from "@remix-run/node";
import { json } from "@remix-run/node";
import {
  Form,
  Link,
  useActionData,
  useLoaderData,
  useSearchParams,
} from "@remix-run/react";
import * as React from "react";
import Input from "~/components/Input";
import Button from "~/components/Button";
import Card from "~/components/Card";
import AppContainer from "~/components/AppContainer";
import Main from "~/components/Main";
import Label from "~/components/Label";
import ErrorText from "~/components/ErrorText";
import { authenticator } from "~/services/auth.server";
import { sessionStorage } from "~/services/session.server";
import FormWrapper from "~/components/FormWrapper";

type LoaderData = {
  magicLinkSent?: boolean;
};

type ActionData = {
  errors: {
    email?: string;
  };
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

export const action: ActionFunction = async ({ request }) => {
  await authenticator.authenticate("email-link", request, {
    successRedirect: "/join",
  });
};

export const meta: MetaFunction = () => {
  return {
    title: "Sign Up",
  };
};

export const ErrorBoundary: ErrorBoundaryComponent = ({ error }) => {
  return (
    <AppContainer>
      <Main>
        <Card position="center">
          <ErrorText>{error.message}</ErrorText>
          <Link to="/join">Try a different email?</Link>
        </Card>
      </Main>
    </AppContainer>
  );
};

export default function Join() {
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") ?? undefined;
  const actionData = useActionData() as ActionData;
  let { magicLinkSent } = useLoaderData<LoaderData>();
  const emailRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (actionData?.errors?.email) {
      emailRef.current?.focus();
    }
  }, [actionData]);

  return (
    <AppContainer>
      <Main centerItems>
        <h1>Join Hand Engineering Market</h1>

        <FormWrapper>
          <Form method="post">
            <div>
              <Label htmlFor="email">Email address</Label>
              <Input
                ref={emailRef}
                id="email"
                required
                autoFocus={true}
                name="email"
                type="email"
                autoComplete="email"
                aria-invalid={actionData?.errors?.email ? true : undefined}
                aria-describedby="email-error"
              />
              {actionData?.errors?.email && (
                <ErrorText id="email-error">
                  {actionData.errors.email}
                </ErrorText>
              )}
            </div>

            <Input type="hidden" name="redirectTo" value={redirectTo} />

            {magicLinkSent ? (
              "Magic link has been sent!"
            ) : (
              <Button color="primary" type="submit">
                Create Account
              </Button>
            )}
          </Form>
        </FormWrapper>
        <div>
          Already have an account?{" "}
          <Link
            to={{
              pathname: "/login",
              search: searchParams.toString(),
            }}
          >
            Log in
          </Link>
        </div>
      </Main>
    </AppContainer>
  );
}
