import {
  Link,
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "@remix-run/react";
import { globalStyles } from "./styles/globalStyles";
import type {
  ErrorBoundaryComponent,
  LoaderFunction,
  MetaFunction,
} from "@remix-run/node";
import Button from "./components/Button";
import Main from "./components/Main";
import Header from "./components/Header";
import type { User } from "@prisma/client";
import { authenticator } from "./services/auth.server";
import { checkPermissions } from "./services/permissions.server";
import permissions from "prisma/permissions";

export const meta: MetaFunction = () => ({
  charset: "utf-8",
  title: "Hand Engineering Market",
  viewport: "width=device-width,initial-scale=1",
});

export const ErrorBoundary: ErrorBoundaryComponent = ({ error }) => {
  return (
    <div>
      <h1>Error</h1>
      <p>{error.message}</p>
      <p>The stack trace is:</p>
      <pre>{error.stack}</pre>
    </div>
  );
};

type LoaderData = {
  user: User;
  isAdmin: boolean;
};

export default function App() {
  globalStyles();

  const { user, isAdmin } = useLoaderData() as LoaderData;

  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
      </head>
      <body>
        <Header>
          <Link to="/">
            <Button color="inverse">Dashboard</Button>
          </Link>
          <Link to="/raffles">
            <Button color="inverse">All Raffles</Button>
          </Link>

          {isAdmin && (
            <Link to="/admin">
              <Button color="tertiary">Admin</Button>
            </Link>
          )}

          {user ? (
            <Link to="/logout">
              <Button color="danger">Log Out ({user.email})</Button>
            </Link>
          ) : (
            <>
              <Link to="/join">
                <Button color="secondary">Sign up</Button>
              </Link>
              <Link to="/login">
                <Button color="inverse">Log In</Button>
              </Link>
            </>
          )}
        </Header>
        <Main>
          <Outlet />
        </Main>
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}

export let loader: LoaderFunction = async ({ request }) => {
  let user = await authenticator.isAuthenticated(request);

  let isAdmin = await checkPermissions(request, permissions.administrator);

  return { user, isAdmin };
};
