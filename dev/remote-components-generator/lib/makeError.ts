import VError from "verror";
import { getProperty } from "dot-prop";

export const makeError = (error: unknown): Error =>
  error instanceof Error
    ? error
    : new VError(
        {
          name: getProperty(error, "name") ?? "Error",
        },
        getProperty(error, "message") ?? "",
      );
