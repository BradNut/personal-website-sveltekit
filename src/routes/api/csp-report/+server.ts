import type { RequestHandler } from '@sveltejs/kit';
import { StatusCodes } from '#lib/constants/status-codes.ts';

/** Browsers send one small report per violation; anything bigger is not a real report. */
const MAX_BODY_LENGTH = 16_384;
/** Keeps one log line per violation short, whatever a client sends. */
const MAX_FIELD_LENGTH = 120;

type CspReport = Partial<Record<'document-uri' | 'effective-directive' | 'violated-directive' | 'blocked-uri', unknown>>;

function field(value: unknown): string {
  return typeof value === 'string' && value ? value.slice(0, MAX_FIELD_LENGTH) : 'unknown';
}

/** The page path only: query strings and fragments can carry personal data. */
function pagePath(documentUri: unknown): string {
  try {
    return field(new URL(String(documentUri)).pathname);
  } catch {
    return 'unknown';
  }
}

function parseJson(body: string): unknown {
  try {
    return JSON.parse(body);
  } catch {
    return null;
  }
}

function parseReport(body: string): CspReport | null {
  if (body.length > MAX_BODY_LENGTH) return null;
  const report = (parseJson(body) as { 'csp-report'?: unknown } | null)?.['csp-report'];
  return report instanceof Object ? (report as CspReport) : null;
}

/**
 * The Content Security Policy `report-uri` (`CSP_REPORT_PATH`): logs a one-line summary of each
 * violation so report-only findings show up in the app logs. Always answers 204, so browsers
 * don't retry and the endpoint tells a caller nothing.
 */
export const POST: RequestHandler = async ({ request }) => {
  const report = parseReport(await request.text());
  if (report) {
    const directive = field(report['effective-directive'] ?? report['violated-directive']);
    console.warn(`[csp] ${directive} blocked ${field(report['blocked-uri'])} on ${pagePath(report['document-uri'])}`);
  }
  return new Response(null, { status: StatusCodes.NO_CONTENT });
};
