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
import type {
  ErrorBoundaryComponent,
  LinksFunction,
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

import globalStylesheetUrl from "./styles/global.css";
import tailwindStylesheetUrl from "./styles/tailwind.css";

export const links: LinksFunction = () => {
  return [
    { rel: "stylesheet", href: globalStylesheetUrl },
    { rel: "stylesheet", href: tailwindStylesheetUrl },
  ];
};

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
  const { user, isAdmin } = useLoaderData() as LoaderData;

  return (
    <html lang="en" className="h-full">
      <head>
        <Meta />
        <Links />
      </head>
      <body className="flex h-full flex-col items-center bg-neutral100 font-soehne text-primary700">
        <Header>
          {user ? (
            <>
              <Link to="/">
                <Button color="inverse" className="w-full md:w-auto">
                  Dashboard
                </Button>
              </Link>
              <Link to="/raffles">
                <Button color="inverse" className="w-full md:w-auto">
                  All Raffles
                </Button>
              </Link>

              <Link to="/logout">
                <Button color="danger" className="w-full md:w-auto">
                  Log Out ({user.email})
                </Button>
              </Link>
            </>
          ) : (
            <>
              <Link to="/join">
                <Button color="secondary" className="w-full md:w-auto">
                  Sign up
                </Button>
              </Link>
              <Link to="/login">
                <Button color="inverse" className="w-full md:w-auto">
                  Log In
                </Button>
              </Link>
            </>
          )}
          {isAdmin && (
            <Link to="/admin">
              <Button color="tertiary" className="w-full md:w-auto">
                Admin
              </Button>
            </Link>
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
