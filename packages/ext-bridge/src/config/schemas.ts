import { z } from "zod";

const baseConfig = z.object({
  sessionId: z.string(),
  userId: z.string(),
  extensionId: z.string(),
  extensionInstanceId: z.string(),
});

const contextParameters = z
  .object({
    appId: z.string().optional(),
    projectId: z.string().optional(),
    customerId: z.string().optional(),
  })
  .catchall(z.string().optional());

export const config = z.union([baseConfig, contextParameters]);
