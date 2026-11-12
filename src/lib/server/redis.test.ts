import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { hang, timed } from './testing/fakeIoredis';

const { env, appEnv, fake } = await vi.hoisted(async () => {
  const { createFakeIoredis } = await import('./testing/fakeIoredis');
  return {
    env: { USE_REDIS_CACHE: true, REDIS_URI: 'redis://cache.internal:6379' },
    appEnv: { building: false },
    fake: createFakeIoredis(),
  };
});

vi.mock('ioredis', () => ({ Redis: fake.Redis }));
vi.mock('varlock/env', () => ({ initVarlockEnv: vi.fn(), ENV: env }));
vi.mock('$app/environment', () => ({
  get building() {
    return appEnv.building;
  },
}));

async function loadService() {
  vi.resetModules();
  return (await import('./redis')).redisService;
}

const articleKey = { prefix: 'articles', key: 'k' };

beforeEach(() => {
  env.USE_REDIS_CACHE = true;
  appEnv.building = false;
  fake.connection.status = 'ready';
  vi.spyOn(console, 'warn').mockImplementation(() => {});
});

afterEach(() => {
  vi.useRealTimers();
});

describe('redisService', () => {
  it('does not connect when the module is imported', async () => {
    await loadService();
    expect(fake.constructed).not.toHaveBeenCalled();
  });

  it('connects once on first use and reuses the client', async () => {
    fake.commands.get.mockResolvedValue('cached');
    const service = await loadService();

    await expect(service.get(articleKey)).resolves.toBe('cached');
    await service.get({ prefix: 'articles', key: 'k2' });

    expect(fake.constructed).toHaveBeenCalledTimes(1);
    expect(fake.constructed).toHaveBeenCalledWith('redis://cache.internal:6379', {
      commandTimeout: 500,
      connectTimeout: 1000,
      maxRetriesPerRequest: 1,
    });
    expect(fake.commands.get).toHaveBeenCalledWith('personal-website:articles:k');
  });

  it('never connects during vite build', async () => {
    appEnv.building = true;
    const service = await loadService();

    await expect(service.get(articleKey)).resolves.toBeNull();
    expect(fake.constructed).not.toHaveBeenCalled();
  });

  it('never connects when caching is disabled', async () => {
    env.USE_REDIS_CACHE = false;
    const service = await loadService();

    await expect(service.ttl(articleKey)).resolves.toBe(0);
    expect(fake.constructed).not.toHaveBeenCalled();
  });
});

describe('redisService when Redis is unavailable', () => {
  it('treats a read that throws as a cache miss', async () => {
    fake.commands.get.mockRejectedValue(new Error('ECONNREFUSED'));
    const service = await loadService();

    await expect(service.get(articleKey)).resolves.toBeNull();
  });

  it('treats a read that times out as a cache miss within a second', async () => {
    vi.useFakeTimers();
    fake.commands.get.mockImplementation(hang);
    const service = await loadService();

    const { value, elapsedMs } = await timed(service.get(articleKey));

    expect(value).toBeNull();
    expect(elapsedMs).toBeLessThanOrEqual(1000);
  });

  it('logs and skips a write that throws', async () => {
    fake.commands.set.mockRejectedValue(new Error('ECONNREFUSED'));
    const service = await loadService();

    await expect(service.setWithExpiry({ ...articleKey, value: 'v', expiry: 60 })).resolves.toBeUndefined();
    expect(console.warn).toHaveBeenCalled();
  });

  it('logs and skips a write that times out, within a second', async () => {
    vi.useFakeTimers();
    fake.commands.set.mockImplementation(hang);
    const service = await loadService();

    const { value, elapsedMs } = await timed(service.setWithExpiry({ ...articleKey, value: 'v', expiry: 60 }));

    expect(value).toBeUndefined();
    expect(elapsedMs).toBeLessThanOrEqual(1000);
    expect(console.warn).toHaveBeenCalled();
  });

  it('skips commands without waiting while the client is reconnecting', async () => {
    vi.useFakeTimers();
    fake.commands.get.mockImplementation(hang);
    fake.commands.set.mockImplementation(hang);
    const service = await loadService();
    await timed(service.get(articleKey)); // first connection attempt fails
    fake.connection.status = 'reconnecting';

    const read = await timed(service.get(articleKey));
    const write = await timed(service.setWithExpiry({ ...articleKey, value: 'v', expiry: 60 }));

    expect(read.value).toBeNull();
    expect(read.elapsedMs).toBe(0);
    expect(write.elapsedMs).toBe(0);
  });

  it('resumes caching once Redis is back, without a restart', async () => {
    fake.commands.get.mockRejectedValueOnce(new Error('ECONNREFUSED')).mockResolvedValue('cached');
    const service = await loadService();
    await service.get(articleKey);
    fake.connection.status = 'reconnecting';
    await service.get(articleKey);

    fake.connection.status = 'ready';

    await expect(service.get(articleKey)).resolves.toBe('cached');
    expect(fake.constructed).toHaveBeenCalledTimes(1);
  });
});
