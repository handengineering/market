import { createClient } from "redis";

declare global {
  var redisClient: ReturnType<typeof createClient>;
}

let redisClient = (global.redisClient =
  global.redisClient ||
  createClient({
    url: process.env.REDIS_URL,
  }));

export default redisClient;
