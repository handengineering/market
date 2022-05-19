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
import AppContainer from "./components/AppContainer";
import Button from "./components/Button";
import Main from "./components/Main";
import Header from "./components/Header";
import type { User } from "@prisma/client";
import { authenticator } from "./services/auth.server";

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
};

export default function App() {
  globalStyles();

  const { user } = useLoaderData() as LoaderData;

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
        <AppContainer>
          <Main>
            <Outlet />
          </Main>
        </AppContainer>
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}

export let loader: LoaderFunction = async ({ request }) => {
  let user = await authenticator.isAuthenticated(request);

  return { user };
};
