import { createClient, RedisClientType } from 'redis';

let client: RedisClientType | null = null;

export async function getRedisClient(): Promise<RedisClientType> {
  if (client && client.isOpen) {
    // Return existing connected client
    return client;
  }

  // Create new client if none exists
  client = createClient({
    username: 'default',
    password: process.env.REDIS_PASSWORD,
    socket: {
      host: process.env.REDIS_URL,
      port: 18151,
    },
  });

  client.on('error', (err) => console.error('Redis Client Error', err));

  await client.connect();
  return client;
}

