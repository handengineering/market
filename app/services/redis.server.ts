import { createClient } from "redis";
import invariant from "tiny-invariant";

invariant(process.env.REDIS_URL, "REDIS_URL environment variable is not set");

declare global {
  var redisClient: ReturnType<typeof createClient>;
}

let redisClient = (global.redisClient =
  global.redisClient ||
  createClient({
    url: process.env.REDIS_URL,
  }));

redisClient.on("error", (err) => console.error("client error", err));
redisClient.on("connect", () => console.log("client is connect"));
redisClient.on("reconnecting", () => console.log("client is reconnecting"));
redisClient.on("ready", () => console.log("client is ready"));

export default redisClient;
