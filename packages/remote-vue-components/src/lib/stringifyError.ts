export const stringifyError = (error: unknown) =>
  typeof error === "object" && error instanceof Error
    ? error.message
    : String(error);
