# Redis Service Usage

The Redis service uses a three-level key hierarchy for multi-project Redis database sharing:

**Key Pattern**: `personal-website:{prefix}:{key}`

This allows you to share a single Redis instance across multiple projects while maintaining complete isolation.

## Available Prefixes

```typescript
export const REDIS_PREFIXES = {
  ARTICLES: 'articles',
  BANDCAMP_ALBUMS: 'bandcampAlbums',
  PAGE_CACHE: 'pageCache',
} as const;
```

**Note**: The `personal-website` namespace is automatically prepended to all keys.

## Usage Examples

### Import

```typescript
import { redisService, REDIS_PREFIXES } from '$lib/server/redis';
```

### Get a value

```typescript
const value = await redisService.get({ 
  prefix: REDIS_PREFIXES.ARTICLES, 
  key: 'article-123' 
});
// Actual Redis key: "personal-website:articles:article-123"
```

### Set a value

```typescript
await redisService.set({ 
  prefix: REDIS_PREFIXES.ARTICLES, 
  key: 'article-123', 
  value: JSON.stringify(data) 
});
```

### Set with expiry (TTL in seconds)

```typescript
await redisService.setWithExpiry({ 
  prefix: REDIS_PREFIXES.ARTICLES, 
  key: 'article-123', 
  value: JSON.stringify(data),
  expiry: 43200  // 12 hours
});
```

### Delete a key

```typescript
await redisService.delete({ 
  prefix: REDIS_PREFIXES.ARTICLES, 
  key: 'article-123' 
});
```

### Get TTL (time to live)

```typescript
const ttl = await redisService.ttl({ 
  prefix: REDIS_PREFIXES.ARTICLES, 
  key: 'article-123' 
});
// Returns remaining seconds, or 0 if not set/expired
```

### Scan for keys with pattern

```typescript
const keys = await redisService.scan({ 
  prefix: REDIS_PREFIXES.ARTICLES, 
  pattern: 'article-*' 
});
// Returns array of keys without the prefix (e.g., ['article-123', 'article-456'])
```

## Current Usage

### Articles
- **Prefix**: `REDIS_PREFIXES.ARTICLES`
- **Keys**: Query parameter strings (e.g., `sort=updated&perPage=10&page=1`)
- **TTL**: 12 hours (43200 seconds)
- **Files**: 
  - `src/lib/api.ts`
  - `src/lib/services/articlesApi.ts`

### Bandcamp Albums
- **Prefix**: `REDIS_PREFIXES.BANDCAMP_ALBUMS`
- **Keys**: `albums`
- **TTL**: 12 hours (43200 seconds)
- **Files**:
  - `src/lib/util/fetchBandcampAlbums.ts`
  - `src/routes/api/bandcamp/albums/+server.ts`

### Page Cache
- **Prefix**: `REDIS_PREFIXES.PAGE_CACHE`
- **Status**: Available for use (not yet implemented)

## Benefits

1. **Multi-project support**: The `personal-website` namespace isolates this project's keys from other projects
2. **Namespace isolation**: Different data types are separated by prefix within the project
3. **Easy scanning**: Can find all keys of a specific type
4. **Better organization**: Clear three-level structure for Redis keys
5. **Consistent API**: All operations use the same pattern
6. **Graceful degradation**: Returns null/empty when Redis is disabled

## Key Structure Examples

- Article cache: `personal-website:articles:sort=updated&page=1`
- Bandcamp albums: `personal-website:bandcampAlbums:albums`
- Page cache: `personal-website:pageCache:home`

This structure allows you to:
- Share Redis with other projects (e.g., `other-project:articles:...`)
- Easily identify all keys for this project (`personal-website:*`)
- Organize data within the project by type (`personal-website:articles:*`)
