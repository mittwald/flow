/**
 * `fetch` for the review-environment scripts, with a retry for the failures a
 * GitHub runner produces on its own rather than because a request was wrong.
 *
 * A bare `fetch` gives every call one attempt and undici's 10 s connect
 * default, so a single stalled TCP handshake fails a whole preview deploy.
 *
 * What is retried is deliberately narrow:
 *
 * - **Connect-phase errors** — retried for every request. The failure happened
 *   before the request reached the server, so replaying it cannot duplicate a
 *   side effect.
 * - **Anything else** (a socket that died mid-flight, a per-attempt timeout, HTTP
 *   429, HTTP 5xx) — retried only for a request marked `idempotent`. Once a
 *   request may have reached the server, replaying a non-idempotent one could
 *   create a second ingress or a second PR comment.
 *
 * A 4xx is the server rejecting the request on its merits and is never retried;
 * it comes back for the caller to handle.
 */

const MAX_ATTEMPTS = 4;
const ATTEMPT_TIMEOUT_MS = 30_000;
const BASE_BACKOFF_MS = 500;

// undici surfaces these while still establishing the connection, i.e. before
// the server can have seen the request.
const CONNECT_PHASE_CODES = new Set([
  "UND_ERR_CONNECT_TIMEOUT",
  "ECONNREFUSED",
  "ENOTFOUND",
  "EAI_AGAIN",
]);

export interface ApiFetchOptions {
  /** Names the request in the retry log. */
  label: string;
  /**
   * Whether replaying this request is harmless — true for every read, and for a
   * write whose body describes a desired end state (a declarative PATCH) or
   * whose repetition is a no-op. False for a request that creates a resource.
   */
  idempotent?: boolean;
  /** Seams for the tests; production uses the globals. */
  fetchImpl?: typeof globalThis.fetch;
  sleep?: (ms: number) => Promise<void>;
}

const defaultSleep = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

const causeCode = (error: unknown): string | undefined => {
  const cause = (error as { cause?: unknown } | null)?.cause;
  const code = (cause as { code?: unknown } | null)?.code;
  return typeof code === "string" ? code : undefined;
};

export const isConnectPhaseError = (error: unknown): boolean =>
  CONNECT_PHASE_CODES.has(causeCode(error) ?? "");

export const isRetryableStatus = (status: number): boolean =>
  status === 429 || status >= 500;

const describeError = (error: unknown): string => {
  const code = causeCode(error);
  const message = error instanceof Error ? error.message : String(error);
  return code ? `${message} (${code})` : message;
};

export const apiFetch = async (
  url: string,
  init: RequestInit,
  options: ApiFetchOptions,
): Promise<Response> => {
  const {
    label,
    idempotent = false,
    fetchImpl = globalThis.fetch,
    sleep = defaultSleep,
  } = options;

  for (let attempt = 1; ; attempt++) {
    const isLastAttempt = attempt >= MAX_ATTEMPTS;

    const backOff = async (reason: string): Promise<void> => {
      const delay = BASE_BACKOFF_MS * 2 ** (attempt - 1);
      console.warn(
        `⏳ ${label} failed (${reason}) — attempt ${attempt}/${MAX_ATTEMPTS}, retrying in ${delay} ms`,
      );
      await sleep(delay);
    };

    try {
      const response = await fetchImpl(url, {
        ...init,
        signal: AbortSignal.timeout(ATTEMPT_TIMEOUT_MS),
      });

      if (!isRetryableStatus(response.status) || !idempotent || isLastAttempt) {
        return response;
      }

      // The body is not read on a retry; release the socket instead of leaving
      // it to the GC.
      await response.body?.cancel().catch(() => undefined);
      await backOff(`HTTP ${response.status}`);
    } catch (error) {
      if (!(isConnectPhaseError(error) || idempotent) || isLastAttempt) {
        throw error;
      }

      await backOff(describeError(error));
    }
  }
};
