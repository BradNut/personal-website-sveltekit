type RetryOptions = {
  /** Return false to stop retrying and rethrow immediately (e.g. timeouts or 4xx responses). */
  shouldRetry?: (error: unknown) => boolean;
};

function describeError(error: unknown): string {
  if (error instanceof Error) return `${error.name}: ${error.message}`;
  return String(error);
}

/**
 * Retry helper with exponential backoff
 * Retries a function up to maxRetries times with exponential delay between attempts
 */
export async function retryWithBackoff<T>(fn: () => Promise<T>, maxRetries = 3, baseDelay = 500, options: RetryOptions = {}): Promise<T> {
  let lastError: unknown;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;

      if (attempt === maxRetries || options.shouldRetry?.(error) === false) {
        throw lastError;
      }

      // Exponential backoff: 500ms, 1s, 2s
      const delay = baseDelay * 2 ** attempt;
      console.log(`Attempt ${attempt + 1} failed (${describeError(error)}), retrying in ${delay}ms...`);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  throw lastError;
}
