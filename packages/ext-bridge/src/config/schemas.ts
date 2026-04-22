import { z } from "zod";

/**
 * Breaking Change warning: Do not remove/rename/modify existing properties in
 * the config schema, as they might be used by existing extensions.
 */
const baseConfig = z.object({
  sessionId: z.string(),
  userId: z.string(),
  extensionId: z.string(),
  extensionInstanceId: z.string(),
  variantKey: z.string().optional().nullable(),
});

/**
 * Breaking Change warning: Do not remove/rename/modify existing properties in
 * the config schema, as they might be used by existing extensions.
 */
const contextParameters = z.object({
  appInstallationId: z.string().optional(),
  projectId: z.string().optional(),
  customerId: z.string().optional(),
});

export const config = baseConfig.extend(contextParameters.shape);
