export const stringifyError = (error: unknown): string =>
  error instanceof Error ? (error.stack ?? error.message) : String(error);
