import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "@remix-run/react";
import type {
  ActionFunction,
  ErrorBoundaryComponent,
  LinksFunction,
  LoaderFunction,
  MetaFunction,
} from "@remix-run/node";
import Main from "./components/Main";
import Header from "./components/Header";

import globalStylesheetUrl from "./styles/global.css";
import tailwindStylesheetUrl from "./styles/tailwind.css";
import type { User } from "@prisma/client";
import permissions from "prisma/permissions";
import { authenticator } from "./services/auth.server";
import { checkPermissions } from "./services/permissions.server";

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

type LoaderData = {
  user: User;
  isAdmin: boolean;
};

export let loader: LoaderFunction = async ({ request }) => {
  let user = await authenticator.isAuthenticated(request);

  let isAdmin = await checkPermissions(request, permissions.administrator);

  return { user, isAdmin };
};

export let action: ActionFunction = () => {
  return null;
};

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

export default function App() {
  const { user, isAdmin } = useLoaderData() as unknown as LoaderData;

  return (
    <html lang="en" className="h-full">
      <head>
        <Meta />
        <Links />
      </head>
      <body className="flex h-full flex-col items-center bg-neutral-100 font-soehne text-primary-700">
        <Header user={user} isAdmin={isAdmin} />

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
