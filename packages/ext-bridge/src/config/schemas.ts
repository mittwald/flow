import { z } from "zod";

/**
 * Schema of an optional config value: `string | undefined` to a consumer.
 *
 * A host that sends `null` degrades to "value absent" instead of failing the
 * config parse — a failed parse throws and the extension never starts.
 */
const optionalString = z
  .string()
  .nullable()
  .optional()
  .transform((value) => value ?? undefined);

/**
 * Breaking Change warning: Do not remove/rename/modify existing properties in
 * the config schema, as they might be used by existing extensions.
 */
const baseConfig = z.object({
  sessionId: z.string(),
  userId: z.string(),
  extensionId: z.string(),
  extensionInstanceId: z.string(),
  variantKey: optionalString,
});

/**
 * The context parameters the mStudio host can supply, in addition to
 * `sessionId`.
 *
 * Breaking Change warning: Do not remove/rename/modify existing properties in
 * the config schema, as they might be used by existing extensions.
 */
const contextParameters = z.object({
  aiApiKeyId: optionalString,
  appInstallationId: optionalString,
  backupId: optionalString,
  certificateId: optionalString,
  containerId: optionalString,
  contractId: optionalString,
  conversationId: optionalString,
  cronjobId: optionalString,
  customerId: optionalString,
  databaseId: optionalString,
  deliveryBoxId: optionalString,
  domainId: optionalString,
  // `emailAddressId` and `ingressId` are deprecated. Their `@deprecated` tags
  // live on `DeprecatedContextParameters` in ./types.ts — JSDoc on a zod shape
  // does not survive the declaration emit.
  emailAddressId: optionalString,
  ingressId: optionalString,
  leadId: optionalString,
  licenseId: optionalString,
  mailAddressId: optionalString,
  projectId: optionalString,
  registryId: optionalString,
  scheduleId: optionalString,
  serverId: optionalString,
  sftpUserId: optionalString,
  sshUserId: optionalString,
  stackId: optionalString,
  templateId: optionalString,
  zoneId: optionalString,
});

/**
 * The catchall keeps a context parameter mStudio starts sending before this
 * schema declares it. It is part of the exported schema on purpose: the type
 * and the runtime parse must agree about unknown keys.
 */
export const config = baseConfig
  .extend(contextParameters.shape)
  .catchall(optionalString);
