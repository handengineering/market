import type { EntryContext } from "@remix-run/node";
import { RemixServer } from "@remix-run/react";
import { renderToString } from "react-dom/server";
import { fetchAllGuildMembers } from "./services/discord.server";
import redisClient from "./services/redis.server";

setInterval(async () => {
  const allGuildMembers = await fetchAllGuildMembers();
  await redisClient.set("discordGuildMembers", allGuildMembers);
}, 60000);

export default function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  remixContext: EntryContext
) {
  const markup = renderToString(
    <RemixServer context={remixContext} url={request.url} />
  );

  responseHeaders.set("Content-Type", "text/html");

  return new Response("<!DOCTYPE html>" + markup, {
    status: responseStatusCode,
    headers: responseHeaders,
  });
}
