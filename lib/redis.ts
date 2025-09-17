import { createClient, RedisClientType } from 'redis';

let client: RedisClientType | null = null;

export async function getRedisClient(): Promise<RedisClientType> {
  if (client && client.isOpen) {
    return client;
  }

  client = createClient({
    username: 'default',
    password: process.env.REDIS_PASSWORD,
    socket: {
      host: process.env.REDIS_URL,
      port: 18151,
    },
  });

  client.on('error', (err) => { throw err });

  await client.connect();
  return client;
}

