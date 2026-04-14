import { config } from "@/config/schemas";
import { ExtBridgeError } from "@/error";
import z from "zod";

export const parseConfig = (something: unknown) => {
  const parsed = config
    .catchall(z.string().optional().nullable())
    .safeParse(something);
  if (parsed.error) {
    throw new ExtBridgeError("Invalid config: " + parsed.error.message);
  }
  return parsed.data;
};
