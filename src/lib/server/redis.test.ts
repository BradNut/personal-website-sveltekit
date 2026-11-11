import { beforeEach, describe, expect, it, vi } from 'vitest';

const { env, appEnv, redisCtor, getMock } = vi.hoisted(() => ({
  env: { USE_REDIS_CACHE: true, REDIS_URI: 'redis://cache.internal:6379' },
  appEnv: { building: false },
  redisCtor: vi.fn(),
  getMock: vi.fn(),
}));

vi.mock('ioredis', () => ({
  Redis: class {
    constructor(uri: string) {
      redisCtor(uri);
    }
    on = vi.fn();
    get = getMock;
  },
}));
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

beforeEach(() => {
  redisCtor.mockReset();
  getMock.mockReset();
  env.USE_REDIS_CACHE = true;
  appEnv.building = false;
});

describe('redisService', () => {
  it('does not connect when the module is imported', async () => {
    await loadService();
    expect(redisCtor).not.toHaveBeenCalled();
  });

  it('connects once on first use and reuses the client', async () => {
    getMock.mockResolvedValue('cached');
    const service = await loadService();

    await expect(service.get({ prefix: 'articles', key: 'k' })).resolves.toBe('cached');
    await service.get({ prefix: 'articles', key: 'k2' });

    expect(redisCtor).toHaveBeenCalledTimes(1);
    expect(redisCtor).toHaveBeenCalledWith('redis://cache.internal:6379');
    expect(getMock).toHaveBeenCalledWith('personal-website:articles:k');
  });

  it('never connects during vite build', async () => {
    appEnv.building = true;
    const service = await loadService();

    await expect(service.get({ prefix: 'articles', key: 'k' })).resolves.toBeNull();
    expect(redisCtor).not.toHaveBeenCalled();
  });

  it('never connects when caching is disabled', async () => {
    env.USE_REDIS_CACHE = false;
    const service = await loadService();

    await expect(service.ttl({ prefix: 'articles', key: 'k' })).resolves.toBe(0);
    expect(redisCtor).not.toHaveBeenCalled();
  });
});
