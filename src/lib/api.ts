
/**
 * Safe API client for VYREX Intelligence Layer
 * Handles JSON parsing, network errors, and retries.
 */

export interface ApiRequestOptions extends RequestInit {
  retries?: number;
  retryDelay?: number;
}

export interface ApiResponse<T = any> {
  data?: T;
  error?: string;
  status: number;
}

/**
 * Executes a safe fetch with automatic retries and JSON validation.
 */
export async function safeRequest<T = any>(
  url: string,
  options: ApiRequestOptions = {}
): Promise<T> {
  const { retries = 1, retryDelay = 1000, ...fetchOptions } = options;
  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      if (attempt > 0) {
        console.warn(`[API] Retrying request to ${url} (Attempt ${attempt}/${retries})...`);
        await new Promise(resolve => setTimeout(resolve, retryDelay));
      }

      const response = await fetch(url, fetchOptions);
      const contentType = response.headers.get("content-type") || "";

      // Log full response for debugging (only in console)
      console.log(`[API] ${options.method || 'GET'} ${url} - Status: ${response.status}`);

      let result: any = {};
      if (contentType.includes("application/json")) {
        try {
          result = await response.json();
        } catch (parseError) {
          console.error("[API] JSON Parse Error:", parseError);
        }
      } else {
        const text = await response.text();
        result = { error: text || "Unknown error response" };
      }

      if (!response.ok) {
        const error: any = new Error(result.error || result.message || `Request failed with status ${response.status}`);
        error.status = response.status;
        error.data = result;
        throw error;
      }

      return result as T;

    } catch (err: any) {
      lastError = err;
      const status = err.status || 0;
      
      console.error(`[API] Error on attempt ${attempt}:`, err.message, status ? `(Status: ${status})` : '');
      
      // Don't retry if it's a client-side 4xx error (except 429)
      if (status >= 400 && status < 500 && status !== 429) {
        break;
      }
      
      if (attempt < retries) {
        const delay = retryDelay * Math.pow(2, attempt); // Exponential backoff
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }

  throw lastError || new Error("Unknown API error");
}
