import { z } from "zod";

const baseConfig = z.object({
  sessionId: z.string(),
  userId: z.string(),
  extensionId: z.string(),
  extensionInstanceId: z.string(),
});

const contextParameters = z
  .object({
    appInstallationId: z.string().optional(),
    projectId: z.string().optional(),
    customerId: z.string().optional(),
  })
  .catchall(z.string());

export const config = baseConfig.merge(contextParameters);
