import { useLoaderData, Form, Link, useSearchParams } from "@remix-run/react";
import { json } from "@remix-run/server-runtime";
import Button from "~/components/Button";
import Card from "~/components/Card";
import ErrorText from "~/components/ErrorText";
import Input from "~/components/Input";
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
    <Card>
      <ErrorText>{error.message}</ErrorText>
      <Link to="/login">Try a different email?</Link>
    </Card>
  );
};

// app/routes/login.tsx
export default function Login() {
  const [searchParams] = useSearchParams();
  let { magicLinkSent } = useLoaderData<LoaderData>();

  return (
    <div className="flex h-full flex-col items-center md:py-12">
      <h1 className="mb-6 font-soehneBreit text-xl">Login</h1>
      <FormWrapper>
        <Form action="/login" method="post">
          <Label htmlFor="email">Email</Label>

          <Input
            id="email"
            type="email"
            name="email"
            aria-label="email"
            required
          />

          {magicLinkSent ? (
            <p className="rounded bg-yellow-200 px-2 py-4 text-center text-sm">
              Magic link has been sent!
              <br /> Please check your email and click the link to login.
            </p>
          ) : (
            <Button color="primary" className="text-l w-full">
              Email a login link
            </Button>
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
    </div>
  );
}
