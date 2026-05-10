/**
 * Retry helper with exponential backoff
 * Retries a function up to maxRetries times with exponential delay between attempts
 */
export async function retryWithBackoff<T>(
	fn: () => Promise<T>,
	maxRetries = 3,
	baseDelay = 500,
): Promise<T> {
	let lastError: Error | undefined;

	for (let attempt = 0; attempt <= maxRetries; attempt++) {
		try {
			return await fn();
		} catch (error) {
			lastError = error as Error;

			if (attempt === maxRetries) {
				throw lastError;
			}

			// Exponential backoff: 500ms, 1s, 2s
			const delay = baseDelay * 2 ** attempt;
			console.log(`Attempt ${attempt + 1} failed, retrying in ${delay}ms...`);
			await new Promise((resolve) => setTimeout(resolve, delay));
		}
	}

	throw lastError;
}
