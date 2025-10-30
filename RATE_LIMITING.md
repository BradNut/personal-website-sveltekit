# Rate Limiting

All API endpoints are protected with rate limiting to prevent abuse while allowing normal browsing.

## Configuration

### Default Rate Limits

All API endpoints use the following default limits:
- **30 requests per minute** per IP + User Agent combination
- **100 requests per hour** per IP address

**Protected Endpoints**:
- `/api/articles`
- `/api/bandcamp/albums`

**Behavior**:
- Returns `429 Too Many Requests` when limit is exceeded
- Limits are tracked in-memory (resets on server restart)
- No Redis required - uses built-in memory store

## How it works

The rate limiter uses two levels of protection:

1. **IPUA Limiter** (IP + User Agent): 30 requests/minute
   - Tracks requests by IP address + User Agent string
   - Prevents rapid-fire requests from the same client
   - Allows ~2 requests per second sustained

2. **IP Limiter**: 100 requests/hour
   - Tracks requests by IP address only
   - Prevents sustained abuse even if User Agent is changed
   - Allows browsing ~100 pages per hour

### Call Order

Limiters are checked in order of smallest unit first:
```
IPUA (30/min) → IP (100/hour)
```

If the IPUA limit is hit first, the request is blocked immediately without checking the IP limit.

## Why these limits?

These limits are designed to:
- ✅ Allow normal browsing with cache disabled (30 pages/min is generous)
- ✅ Allow pagination through many articles
- ✅ Support legitimate use cases like testing
- ❌ Prevent automated scraping
- ❌ Prevent DoS attacks
- ❌ Prevent excessive API calls that hit Wallabag

## Testing Rate Limits

You can test the rate limiter locally:

```bash
# Make rapid requests to trigger the limit
for i in {1..35}; do
  curl -s http://localhost:5173/api/articles?page=1 > /dev/null
  echo "Request $i"
done
```

After 30 requests within a minute, you should see:
```json
{
  "message": "Too many requests. Please try again later."
}
```

## Implementation

Uses `sveltekit-rate-limiter` package with a centralized configuration:

**Files**:
- `src/lib/server/rateLimiter.ts` - Shared rate limiter configuration
- `src/routes/api/articles/+server.ts` - Articles endpoint
- `src/routes/api/bandcamp/albums/+server.ts` - Bandcamp endpoint

**Features**:
- No external dependencies (in-memory store)
- Automatic cleanup of expired entries
- Centralized configuration for consistency
- Support for custom rate limits per endpoint

### Custom Rate Limits

You can create custom rate limiters for specific endpoints:

```typescript
import { createRateLimiter } from '$lib/server/rateLimiter';

// Stricter limits for sensitive endpoints
const strictLimiter = createRateLimiter({
  IP: [50, 'h'],
  IPUA: [10, 'm']
});

// Or override just one setting
const customLimiter = createRateLimiter({
  IPUA: [5, 'm'] // IP will use default [100, 'h']
});
```

## Testing

E2E tests verify rate limiting behavior:

```bash
# Run all tests including rate limiting
pnpm test:integration

# Run only rate limiting tests
pnpm exec playwright test rate-limiting

# Run with UI for debugging
pnpm test:ui
```

Tests verify:
- ✅ Requests within limits are allowed
- ✅ Requests exceeding limits return 429
- ✅ Rate limits work on all protected endpoints

## Future Considerations

If you need to:
- **Share limits across multiple servers**: Implement a Redis-based store
- **Adjust limits**: Modify the configuration in `src/lib/server/rateLimiter.ts`
- **Add more endpoints**: Import `apiRateLimiter` or create custom limits with `createRateLimiter()`
- **Whitelist IPs**: Create a custom limiter plugin
