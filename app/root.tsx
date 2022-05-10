import type {
  MetaFunction,
} from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import { globalStyles } from "./styles/globalStyles";

export const meta: MetaFunction = () => ({
  charset: "utf-8",
  title: "Hand Engineering Market",
  viewport: "width=device-width,initial-scale=1",
});


export default function App() {

  globalStyles();
  
  return (
    <html lang="en" className="h-full">
      <head>
        <Meta />
        <Links />
      </head>
      <body className="h-full">
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
