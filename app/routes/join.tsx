import type {
  ActionFunction,
  LoaderFunction,
  MetaFunction,
} from "@remix-run/node";
import { json } from "@remix-run/node";
import { Form, Link, useActionData, useSearchParams } from "@remix-run/react";
import * as React from "react";

import { createUserSession } from "~/services/session.server";

import { createUser, getUserByEmail } from "~/models/user.server";
import { safeRedirect, validateEmail } from "~/utils";
import Input from "~/components/Input";
import Button from "~/components/Button";
import Card from "~/components/Card";
import AppContainer from "~/components/AppContainer";
import Main from "~/components/Main";
import Label from "~/components/Label";
import ErrorText from "~/components/ErrorText";

export const loader: LoaderFunction = async ({ request }) => {
  return json({});
};

interface ActionData {
  errors: {
    email?: string;
    password?: string;
  };
}

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const email = formData.get("email");
  const password = formData.get("password");
  const redirectTo = safeRedirect(formData.get("redirectTo"), "/");

  if (!validateEmail(email)) {
    return json<ActionData>(
      { errors: { email: "Email is invalid" } },
      { status: 400 }
    );
  }

  if (typeof password !== "string") {
    return json<ActionData>(
      { errors: { password: "Password is required" } },
      { status: 400 }
    );
  }

  if (password.length < 8) {
    return json<ActionData>(
      { errors: { password: "Password is too short" } },
      { status: 400 }
    );
  }

  const existingUser = await getUserByEmail(email);
  if (existingUser) {
    return json<ActionData>(
      { errors: { email: "A user already exists with this email" } },
      { status: 400 }
    );
  }

  const user = await createUser(email, password);

  return createUserSession({
    request,
    userId: user.id,
    remember: false,
    redirectTo,
  });
};

export const meta: MetaFunction = () => {
  return {
    title: "Sign Up",
  };
};

export default function Join() {
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") ?? undefined;
  const actionData = useActionData() as ActionData;
  const emailRef = React.useRef<HTMLInputElement>(null);
  const passwordRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (actionData?.errors?.email) {
      emailRef.current?.focus();
    } else if (actionData?.errors?.password) {
      passwordRef.current?.focus();
    }
  }, [actionData]);

  return (
    <AppContainer>
      <Main>
        <Card position="center">
          <Form method="post">
            <div>
              <Label htmlFor="email">Email address</Label>
              <div>
                <Input
                  fullWidth
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
                  <ErrorText id="email-error">{actionData.errors.email}</ErrorText>
                )}
              </div>
            </div>

            <div>
              <Label htmlFor="password">Password</Label>
              <div>
                <Input
                  fullWidth
                  id="password"
                  ref={passwordRef}
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  aria-invalid={actionData?.errors?.password ? true : undefined}
                  aria-describedby="password-error"
                />
                {actionData?.errors?.password && (
                  <ErrorText id="password-error">{actionData.errors.password}</ErrorText>
                )}
              </div>
            </div>

            <Input
              fullWidth
              type="hidden"
              name="redirectTo"
              value={redirectTo}
            />
            <Button fullWidth color="primary" type="submit">
              Create Account
            </Button>
            <div>
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
            </div>
          </Form>
        </Card>
      </Main>
    </AppContainer>
  );
}
