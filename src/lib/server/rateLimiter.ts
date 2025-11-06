import { type Rate, RateLimiter } from 'sveltekit-rate-limiter/server';

export interface RateLimiterConfig {
  IP?: Rate | Rate[];
  IPUA?: Rate | Rate[];
}

/**
 * Creates a rate limiter with custom or default configuration
 * Default: 100 requests per hour per IP, 30 requests per minute per IP + User Agent
 */
export function createRateLimiter(config?: RateLimiterConfig): RateLimiter {
  return new RateLimiter({
    IP: config?.IP ?? [100, 'h'], // 100 requests per hour per IP
    IPUA: config?.IPUA ?? [30, 'm'], // 30 requests per minute per IP + User Agent
  });
}

// Default rate limiter for general API endpoints
// Allows browsing multiple pages without cache, but prevents abuse
export const apiRateLimiter = createRateLimiter();
