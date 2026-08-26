import { config } from "@/config/schemas";
import { ExtBridgeError } from "@/error";

export const parseConfig = (something: unknown) => {
  const parsed = config.safeParse(something);
  if (parsed.error) {
    throw new ExtBridgeError("Invalid config: " + parsed.error.message);
  }
  return parsed.data;
};
