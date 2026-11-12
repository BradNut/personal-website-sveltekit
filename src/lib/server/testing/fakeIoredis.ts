import { vi } from 'vitest';

type RedisOptions = { commandTimeout?: number };

/** Never settles: stands in for a command stuck behind an unreachable Redis. */
export const hang = () => new Promise<never>(() => {});

/**
 * Test double for the `ioredis` boundary. Like the real client, a command that gets no
 * reply rejects with "Command timed out" after `commandTimeout`, and only if one is set.
 */
export function createFakeIoredis() {
  const commands = { get: vi.fn(), set: vi.fn(), ttl: vi.fn(), del: vi.fn(), scan: vi.fn() };
  const constructed = vi.fn();
  const connection = { status: 'ready' };

  function withCommandTimeout<T>(reply: Promise<T>, options: RedisOptions): Promise<T> {
    const { commandTimeout } = options;
    if (typeof commandTimeout !== 'number') return reply;
    return Promise.race([reply, new Promise<never>((_, reject) => setTimeout(() => reject(new Error('Command timed out')), commandTimeout))]);
  }

  class Redis {
    private readonly options: RedisOptions;
    constructor(uri: string, options: RedisOptions = {}) {
      this.options = options;
      constructed(uri, options);
    }
    get status() {
      return connection.status;
    }
    on() {
      return this;
    }
    get(...args: unknown[]) {
      return withCommandTimeout(Promise.resolve(commands.get(...args)), this.options);
    }
    set(...args: unknown[]) {
      return withCommandTimeout(Promise.resolve(commands.set(...args)), this.options);
    }
    ttl(...args: unknown[]) {
      return withCommandTimeout(Promise.resolve(commands.ttl(...args)), this.options);
    }
    del(...args: unknown[]) {
      return withCommandTimeout(Promise.resolve(commands.del(...args)), this.options);
    }
    scan(...args: unknown[]) {
      return withCommandTimeout(Promise.resolve(commands.scan(...args)), this.options);
    }
  }

  return { Redis, commands, constructed, connection };
}

/** Settles `promise` while advancing fake timers, and reports how much fake time it took. */
export async function timed<T>(promise: Promise<T>): Promise<{ value: T; elapsedMs: number }> {
  const start = Date.now();
  let settled = false;
  const tracked = promise.finally(() => {
    settled = true;
  });
  await vi.advanceTimersByTimeAsync(0);
  while (!settled && Date.now() - start < 5_000) {
    await vi.advanceTimersByTimeAsync(50);
  }
  if (!settled) throw new Error('still pending after 5s of fake time');
  return { value: await tracked, elapsedMs: Date.now() - start };
}
