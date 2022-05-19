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
import ErrorText from "~/components/ErrorText";
import { authenticator } from "~/services/auth.server";
import { sessionStorage } from "~/services/session.server";
import FormWrapper from "~/components/FormWrapper";
import Label from "~/components/Label";

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
    <Card position="center">
      <ErrorText>{error.message}</ErrorText>
      <Link to="/join">Try a different email?</Link>
    </Card>
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
    <>
      <h2>Join</h2>
      <FormWrapper>
        <Form method="post">
          <Label>
            Email
            <Input
              ref={emailRef}
              id="email"
              aria-label="email"
              required
              autoFocus={true}
              name="email"
              type="email"
              autoComplete="email"
              aria-invalid={actionData?.errors?.email ? true : undefined}
              aria-describedby="email-error"
            />
            {actionData?.errors?.email && (
              <ErrorText id="email-error">{actionData.errors.email}</ErrorText>
            )}
          </Label>

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
    </>
  );
}
