// A dependency-free stand-in for the Wallabag API, run by Playwright as a web server so e2e tests see a
// fixed set of Favorite Articles. Articles are fetched server-side, so `page.route` cannot mock them.
// Usage: node tests/helpers/fake-wallabag/server.mjs <port>
import { readFileSync } from 'node:fs';
import { createServer } from 'node:http';

const ACCESS_TOKEN = 'fake-wallabag-access-token';
const { items } = JSON.parse(readFileSync(new URL('./entries.json', import.meta.url), 'utf8'));

/**
 * @param {import('node:http').ServerResponse} response
 * @param {number} status
 * @param {unknown} body
 */
function sendJson(response, status, body) {
  response.writeHead(status, { 'Content-Type': 'application/json' });
  response.end(JSON.stringify(body));
}

/**
 * One page of entries in Wallabag's HATEOAS shape; `page` and `perPage` behave as Wallabag's do.
 * @param {URLSearchParams} searchParams
 */
function entriesPage(searchParams) {
  const perPage = Number(searchParams.get('perPage')) || 30;
  const page = Number(searchParams.get('page')) || 1;
  const start = (page - 1) * perPage;
  return {
    page,
    limit: perPage,
    pages: Math.max(1, Math.ceil(items.length / perPage)),
    total: items.length,
    _embedded: { items: items.slice(start, start + perPage) },
  };
}

const server = createServer((request, response) => {
  const url = new URL(request.url ?? '/', 'http://localhost');

  if (request.method === 'POST' && url.pathname === '/oauth/v2/token') {
    request.resume();
    request.on('end', () => sendJson(response, 200, { access_token: ACCESS_TOKEN, expires_in: 3600, token_type: 'bearer' }));
    return;
  }

  if (request.method === 'GET' && url.pathname === '/api/entries.json') {
    if (request.headers.authorization !== `Bearer ${ACCESS_TOKEN}`) {
      sendJson(response, 401, { error: 'invalid_grant' });
      return;
    }
    sendJson(response, 200, entriesPage(url.searchParams));
    return;
  }

  // Playwright polls this to know the server is up
  if (request.method === 'GET' && url.pathname === '/healthz') {
    response.writeHead(204);
    response.end();
    return;
  }

  sendJson(response, 404, { error: 'not_found' });
});

const port = Number(process.argv[2]);
if (!Number.isInteger(port) || port < 1) {
  console.error('Usage: node tests/helpers/fake-wallabag/server.mjs <port>');
  process.exit(1);
}
server.listen(port, '127.0.0.1', () => console.info(`Fake Wallabag listening on http://127.0.0.1:${port}`));
