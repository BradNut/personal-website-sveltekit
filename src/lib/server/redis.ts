import { Redis } from 'ioredis';
import { REDIS_URI, USE_REDIS_CACHE } from '$env/static/private';

type RedisLike = {
  get: (key: string) => Promise<string | null>;
  set: (key: string, value: string, mode?: 'EX', ttlSeconds?: number) => Promise<'OK'>;
  ttl: (key: string) => Promise<number>;
};

function createStub(): RedisLike {
  return {
    async get() {
      return null;
    },
    async set() {
      // no-op stub returns OK to match ioredis contract
      return 'OK' as const;
    },
    async ttl() {
      return 0;
    },
  };
}

export const redis: RedisLike =
  USE_REDIS_CACHE === 'true' && REDIS_URI
    ? (new Redis(REDIS_URI) as unknown as RedisLike)
    : createStub();
