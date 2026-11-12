import type { RedisOptions } from 'ioredis';
import { vi } from 'vitest';

/** Never settles: stands in for a command stuck behind an unreachable Redis. */
export const hang = () => new Promise<never>(() => {});

/** The ways a cache command can fail while Redis is unavailable, keyed by test-name fragment. */
export const cacheFailures = {
  throws: () => Promise.reject(new Error('ECONNREFUSED')),
  'times out': hang,
};

/**
 * Test double for the `ioredis` boundary. Like the real client, a command that gets no
 * reply rejects with "Command timed out" after `commandTimeout`, and only if one is set.
 */
export function createFakeIoredis() {
  const commands = { get: vi.fn(), set: vi.fn(), ttl: vi.fn(), del: vi.fn(), scan: vi.fn() };
  const constructed = vi.fn();
  const connection = { status: 'ready' };

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
    get = (...args: unknown[]) => this.send('get', args);
    set = (...args: unknown[]) => this.send('set', args);
    ttl = (...args: unknown[]) => this.send('ttl', args);
    del = (...args: unknown[]) => this.send('del', args);
    scan = (...args: unknown[]) => this.send('scan', args);

    /** One reply path for every command: the stubbed reply, raced against `commandTimeout` if set. */
    private send(name: keyof typeof commands, args: unknown[]) {
      const reply = Promise.resolve(commands[name](...args));
      const { commandTimeout } = this.options;
      if (typeof commandTimeout !== 'number') return reply;
      return Promise.race([reply, new Promise<never>((_, reject) => setTimeout(() => reject(new Error('Command timed out')), commandTimeout))]);
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
