export class MutedActionError extends Error {
  public constructor(message?: string) {
    super(message);
    this.name = "MutedActionError";
  }

  public static isMutedActionError(error: unknown): error is MutedActionError {
    return error instanceof MutedActionError;
  }

  public static rethrowIfNotMuted(error: unknown): void {
    if (!MutedActionError.isMutedActionError(error)) {
      throw error;
    }
  }
}
