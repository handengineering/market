export const generateLoginLink = (baseUrl: string, redirectTo: string) =>
  `https://discord.com/api/oauth2/authorize?client_id=973191766905856010&redirect_uri=${encodeURIComponent(
    baseUrl
  )}%2Fauth%2Fdiscord%2Fcallback&response_type=token&scope=identify%20email&state=${Buffer.from(
    JSON.stringify({ redirectTo })
  ).toString("base64")}`;
