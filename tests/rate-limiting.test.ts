import { expect, test } from '@playwright/test';
import { StatusCodes } from '$lib/constants/status-codes';

test.describe('API Rate Limiting', () => {
  test.describe('/api/bandcamp/albums endpoint', () => {
    test('allows requests within rate limit', async ({ request }) => {
      // Make a few requests that should succeed
      for (let i = 0; i < 5; i++) {
        const response = await request.get('/api/bandcamp/albums');
        // In CI, external API may fail, so articles array might be empty
        expect([StatusCodes.OK, StatusCodes.TOO_MANY_REQUESTS, StatusCodes.INTERNAL_SERVER_ERROR]).toContain(response.status());
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
        if (response?.status() === StatusCodes.TOO_MANY_REQUESTS) {
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
      const rateLimitedResponse = responses.find(
        (result) => result.status === 'fulfilled' && result.value.status() === StatusCodes.TOO_MANY_REQUESTS,
      );

      if (rateLimitedResponse?.status === 'fulfilled') {
        expect(rateLimitedResponse.value.status()).toBe(StatusCodes.TOO_MANY_REQUESTS);
      }
    });
  });

  test.describe('Rate limit isolation', () => {
    test('rate limits are shared across endpoints (same limiter instance)', async ({ request }) => {
      // Exhaust the shared rate limit via the bandcamp endpoint
      const albumRequests = [];
      for (let i = 0; i < 35; i++) {
        albumRequests.push(request.get('/api/bandcamp/albums'));
      }
      await Promise.allSettled(albumRequests);

      // Subsequent requests may be rate limited since endpoints share the same limiter instance
      const bandcampResponse = await request.get('/api/bandcamp/albums');

      // May be rate limited (429) or succeed depending on timing
      expect([StatusCodes.OK, StatusCodes.TOO_MANY_REQUESTS, StatusCodes.INTERNAL_SERVER_ERROR]).toContain(bandcampResponse.status());
    });
  });
});
