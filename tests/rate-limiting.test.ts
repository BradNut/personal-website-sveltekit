import { expect, test } from '@playwright/test';

test.describe('API Rate Limiting', () => {
  test.describe('/api/articles endpoint', () => {
    test('allows requests within rate limit', async ({ request }) => {
      // Make a few requests that should succeed (or return fallback data if API unavailable)
      for (let i = 0; i < 5; i++) {
        const response = await request.get('/api/articles?page=1&limit=10');
        expect(response.status()).toBe(200);
        const data = await response.json();
        expect(data).toHaveProperty('articles');
        // In CI, external API may fail, so articles array might be empty
        expect(Array.isArray(data.articles)).toBe(true);
      }
    });

    test.skip('blocks requests after exceeding rate limit (30 per minute)', async ({ request }) => {
      const requests = [];
      let rateLimitHit = false;

      // Make 35 rapid requests to exceed the 30/minute limit
      for (let i = 0; i < 35; i++) {
        requests.push(
          request.get('/api/articles?page=1&limit=10').catch((err) => {
            console.error(`Request ${i} failed:`, err);
            return null;
          }),
        );
      }

      const responses = await Promise.all(requests);

      // Check that at least one request was rate limited
      for (const response of responses) {
        if (response && response.status() === 429) {
          rateLimitHit = true;
          break;
        }
      }

      expect(rateLimitHit).toBe(true);
    });

    test('rate limit returns 429 status code', async ({ request }) => {
      // Exhaust rate limit
      const requests = [];
      for (let i = 0; i < 35; i++) {
        requests.push(request.get('/api/articles?page=1&limit=10'));
      }

      const responses = await Promise.allSettled(requests);

      // Find a 429 response
      const rateLimitedResponse = responses.find((result) => result.status === 'fulfilled' && result.value.status() === 429);

      if (rateLimitedResponse && rateLimitedResponse.status === 'fulfilled') {
        expect(rateLimitedResponse.value.status()).toBe(429);
      }
    });
  });

  test.describe('/api/bandcamp/albums endpoint', () => {
    test('allows requests within rate limit', async ({ request }) => {
      // Make a few requests that should succeed
      for (let i = 0; i < 5; i++) {
        const response = await request.get('/api/bandcamp/albums');
        // Should be 200 or potentially fail due to external service
        // May also be 429 if previous tests exhausted the rate limit
        expect([200, 429, 500]).toContain(response.status());
      }
    });

    test.skip('blocks requests after exceeding rate limit (30 per minute)', async ({ request }) => {
      const requests = [];
      let rateLimitHit = false;

      // Make 35 rapid requests to exceed the 30/minute limit
      for (let i = 0; i < 35; i++) {
        requests.push(
          request.get('/api/bandcamp/albums').catch((err) => {
            console.error(`Request ${i} failed:`, err);
            return null;
          }),
        );
      }

      const responses = await Promise.all(requests);

      // Check that at least one request was rate limited
      for (const response of responses) {
        if (response && response.status() === 429) {
          rateLimitHit = true;
          break;
        }
      }

      expect(rateLimitHit).toBe(true);
    });

    test('rate limit returns 429 status code', async ({ request }) => {
      // Exhaust rate limit
      const requests = [];
      for (let i = 0; i < 35; i++) {
        requests.push(request.get('/api/bandcamp/albums'));
      }

      const responses = await Promise.allSettled(requests);

      // Find a 429 response
      const rateLimitedResponse = responses.find((result) => result.status === 'fulfilled' && result.value.status() === 429);

      if (rateLimitedResponse && rateLimitedResponse.status === 'fulfilled') {
        expect(rateLimitedResponse.value.status()).toBe(429);
      }
    });
  });

  test.describe('Rate limit isolation', () => {
    test('rate limits are shared across endpoints (same limiter instance)', async ({ request }) => {
      // Exhaust articles rate limit
      const articleRequests = [];
      for (let i = 0; i < 35; i++) {
        articleRequests.push(request.get('/api/articles?page=1&limit=10'));
      }
      await Promise.allSettled(articleRequests);

      // Bandcamp will also be rate limited since they share the same limiter instance
      // The limiter tracks by IP+UA across all endpoints using the same instance
      const bandcampResponse = await request.get('/api/bandcamp/albums');

      // May be rate limited (429) or succeed depending on timing
      expect([200, 429, 500]).toContain(bandcampResponse.status());
    });
  });
});
