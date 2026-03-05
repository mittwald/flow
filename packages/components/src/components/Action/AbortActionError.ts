export class AbortActionError extends Error {
  public constructor(message?: string) {
    super(message);
    this.name = "AbortActionError";
  }

  public static isAbortActionError(error: unknown): error is AbortActionError {
    return error instanceof AbortActionError;
  }

  public static rethrowIfNotAborted(error: unknown): void {
    if (!AbortActionError.isAbortActionError(error)) {
      throw error;
    }
  }
}
