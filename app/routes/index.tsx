import { Link, useLoaderData } from "@remix-run/react";
import type { LoaderFunction } from "@remix-run/server-runtime";
import AppContainer from "~/components/AppContainer";
import Button from "~/components/Button";
import Main from "~/components/Main";
import type { User } from "~/models/user.server";
import { authenticator } from "~/services/auth.server";

type LoaderData = {
  user: User;
};

export default function Index() {
  const { user } = useLoaderData() as LoaderData;

  return (
    <AppContainer>
      <Main>
        <h1>Hand Engineering Market</h1>
        {user ? (
          <p>Signed in as {user.email}</p>
        ) : (
          <div>
            <Link to="/join">
              <Button color="primary">Sign up</Button>
            </Link>{" "}
            <Link to="/login">
              <Button>Log In</Button>
            </Link>
          </div>
        )}
      </Main>
    </AppContainer>
  );
}

export let loader: LoaderFunction = async ({ request }) => {
  let user = await authenticator.isAuthenticated(request);

  return { user };
};
