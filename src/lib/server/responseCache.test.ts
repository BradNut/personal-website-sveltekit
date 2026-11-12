import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cacheFailures, timed } from '$lib/server/testing/fakeIoredis';

vi.mock('varlock/env', () => ({
  initVarlockEnv: vi.fn(),
  ENV: { USE_REDIS_CACHE: true, REDIS_URI: 'redis://test-host:6379' },
}));

// Fake the ioredis boundary so the real redisService (and its fail-open handling) runs
const { fake } = await vi.hoisted(async () => {
  const { createFakeIoredis } = await import('$lib/server/testing/fakeIoredis');
  return { fake: createFakeIoredis() };
});
vi.mock('ioredis', () => ({ Redis: fake.Redis }));
vi.mock('$app/environment', () => ({ building: false }));

import { createResponseCache } from './responseCache';

type Payload = { items: string[] };
const cache = createResponseCache<Payload>({ prefix: 'things', ttlSeconds: 600 });
const payload: Payload = { items: ['a', 'b'] };

beforeEach(() => {
  vi.resetAllMocks();
  vi.spyOn(console, 'warn').mockImplementation(() => {});
});

describe('createResponseCache', () => {
  it('returns the cached payload with its remaining TTL as max-age', async () => {
    fake.commands.get.mockResolvedValueOnce(JSON.stringify(payload));
    fake.commands.ttl.mockResolvedValueOnce(120);

    const result = await cache.read('key');

    expect(result).toEqual({ value: payload, cacheControl: 'max-age=120' });
    expect(fake.commands.get).toHaveBeenCalledWith('personal-website:things:key');
  });

  for (const ttl of [0, -1, -2]) {
    it(`returns no-cache on a hit when the TTL is ${ttl}, never a zero or negative max-age`, async () => {
      fake.commands.get.mockResolvedValueOnce(JSON.stringify(payload));
      fake.commands.ttl.mockResolvedValueOnce(ttl);

      const result = await cache.read('key');

      expect(result).toEqual({ value: payload, cacheControl: 'no-cache' });
    });
  }

  it('returns null on a miss without looking up the TTL', async () => {
    fake.commands.get.mockResolvedValueOnce(null);

    expect(await cache.read('key')).toBeNull();
    expect(fake.commands.ttl).not.toHaveBeenCalled();
  });

  it('treats an unreadable entry as a miss', async () => {
    fake.commands.get.mockResolvedValueOnce('{not json');

    expect(await cache.read('key')).toBeNull();
  });

  it('writes the payload as JSON with the cache TTL as expiry', async () => {
    await cache.write('key', payload);

    expect(fake.commands.set).toHaveBeenCalledWith('personal-website:things:key', JSON.stringify(payload), 'EX', 600);
  });

  it('exposes the full TTL as the cache-control for freshly fetched payloads', () => {
    expect(cache.freshCacheControl).toBe('max-age=600');
  });
});

describe('createResponseCache — Redis unavailable', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  for (const [failure, command] of Object.entries(cacheFailures)) {
    it(`reads as a miss within a second when the cache read ${failure}`, async () => {
      fake.commands.get.mockImplementation(command);

      const { value, elapsedMs } = await timed(cache.read('key'));

      expect(value).toBeNull();
      expect(elapsedMs).toBeLessThanOrEqual(1000);
    });

    it(`skips the write within a second when the cache write ${failure}`, async () => {
      fake.commands.set.mockImplementation(command);

      const { elapsedMs } = await timed(cache.write('key', payload));

      expect(elapsedMs).toBeLessThanOrEqual(1000);
    });
  }
});
