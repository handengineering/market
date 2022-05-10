// app/routes/login.tsx
import { Form } from "@remix-run/react";
import { ActionFunction, LoaderFunction } from "@remix-run/server-runtime";
import AppContainer from "~/components/AppContainer";
import Button from "~/components/Button";
import Card from "~/components/Card";
import Input from "~/components/Input";
import Label from "~/components/Label";
import Main from "~/components/Main";
import { authenticator } from "~/services/auth.server";

// First we create our UI with the form doing a POST and the inputs with the
// names we are going to use in the strategy
export default function Screen() {
  return (
    <AppContainer>
      <Main>
        <Card position="center">
          <h2>Sign in</h2>
          <div>
            <Form method="post">
              <div>
                <Label htmlFor="email">Email address</Label>
                <div>
                  <Input fullWidth type="email" name="email" required />
                </div>
              </div>
              <div>
                <Label htmlFor="password">Password</Label>

                <div>
                  <Input
                  fullWidth
                    type="password"
                    name="password"
                    autoComplete="current-password"
                    required
                  />
                </div>
              </div>
              <Button fullWidth color="primary">Log in</Button>
            </Form>
          </div>
        </Card>
      </Main>
    </AppContainer>
  );
}

// Second, we need to export an action function, here we will use the
// `authenticator.authenticate method`
export let action: ActionFunction = async ({ request }) => {
  // we call the method with the name of the strategy we want to use and the
  // request object, optionally we pass an object with the URLs we want the user
  // to be redirected to after a success or a failure
  return await authenticator.authenticate("user-pass", request, {
    successRedirect: "/dashboard",
    failureRedirect: "/login",
  });
};

// Finally, we can export a loader function where we check if the user is
// authenticated with `authenticator.isAuthenticated` and redirect to the
// dashboard if it is or return null if it's not
export let loader: LoaderFunction = async ({ request }) => {
  // If the user is already authenticated redirect to /dashboard directly
  return await authenticator.isAuthenticated(request, {
    successRedirect: "/dashboard",
  });
};
