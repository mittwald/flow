import { config } from "@/config/schemas";
import { debug } from "@/debug";
import { ExtBridgeError } from "@/error";

export const parseConfig = (something: unknown) => {
  debug("parsing config");
  const parsed = config.safeParse(something);
  if (parsed.error) {
    throw new ExtBridgeError("Invalid config: " + parsed.error.message);
  }
  return parsed.data;
};
