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

export default redisClient;
