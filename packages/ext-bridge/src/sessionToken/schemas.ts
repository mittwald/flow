import { z } from "zod";

export const extensionScopes = z.string().array();
export const extensionContext = z.enum(["project", "customer"]);

export const sessionTokenPayload = z.object({
  sessionId: z.string(),
  userId: z.string(),
  extensionId: z.string(),
  extensionInstanceId: z.string(),
  contextId: z.string(),
  context: extensionContext,
  scopes: extensionScopes,
  authenticatableWithoutSecret: z.boolean(),
  publicKeySerial: z.string(),
  variantKey: z.string().optional(),
});
