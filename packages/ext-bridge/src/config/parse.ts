import { config } from "@/config/schemas";

export const parseConfig = (something: unknown) => {
  const parsed = config.safeParse(something);
  if (parsed.error) {
    throw new Error("MwExtBridge config invalid: " + parsed.error.message);
  }
  return parsed.data;
};
