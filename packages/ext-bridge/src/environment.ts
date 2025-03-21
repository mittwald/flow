import { env } from "std-env";

/** @internal */
export const MW_EXT_API_URL =
  env["MW_EXT_API_URL"] ?? "https://api.mittwald.de";
