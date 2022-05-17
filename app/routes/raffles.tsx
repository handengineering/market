import type { User } from "@prisma/client";
import { Link, Outlet, useLoaderData } from "@remix-run/react";
import type { LoaderFunction } from "@remix-run/server-runtime";
import AppContainer from "~/components/AppContainer";
import Button from "~/components/Button";
import Main from "~/components/Main";
import Navigation from "~/components/Navigation";
import { authenticator } from "~/services/auth.server";

type LoaderData = {
  user: User;
};

export default function Raffles() {
  const { user } = useLoaderData() as LoaderData;

  return (
    <>
      <Navigation>
        <Link to="/raffles">
          <Button>All Raffles</Button>
        </Link>
        <Link to="/dashboard">
          <Button>Dashboard</Button>
        </Link>
        {user ? (
          <Link to="/logout">
            <Button color="danger">Log Out ({user.email})</Button>
          </Link>
        ) : (
          <>
            <Link to="/join">
              <Button color="primary">Sign up</Button>
            </Link>
            <Link to="/login">
              <Button>Log In</Button>
            </Link>
          </>
        )}
      </Navigation>
      <AppContainer>
        <Main>
          <Outlet />
        </Main>
      </AppContainer>
    </>
  );
}

export let loader: LoaderFunction = async ({ request }) => {
  let user = await authenticator.isAuthenticated(request, {
    failureRedirect: "/login",
  });

  return { user };
};
