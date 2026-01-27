import { z } from "zod";

const baseConfig = z.object({
  sessionId: z.string(),
  userId: z.string(),
  extensionId: z.string(),
  extensionInstanceId: z.string(),
  variantKey: z.string().optional().nullable(),
});

const contextParameters = z.object({
  appInstallationId: z.string().optional(),
  projectId: z.string().optional(),
  customerId: z.string().optional(),
});

export const config = baseConfig
  .extend(contextParameters.shape)
  .catchall(z.string());
