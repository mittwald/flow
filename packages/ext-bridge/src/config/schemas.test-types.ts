import type { ExtBridgeConfig, ExtBridgeConfigInput } from "@/types";
import { expectTypeOf } from "vitest";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function config() {
  const testConfig = {} as ExtBridgeConfig;

  /**
   * `ExtBridgeConfig` omits and re-declares the deprecated parameters, which
   * must not collapse the remaining properties into the catchall's index
   * signature — a required property stays required.
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  function testBaseConfig() {
    expectTypeOf<string>(testConfig.sessionId);
    expectTypeOf<string>(testConfig.userId);
    expectTypeOf<string>(testConfig.extensionId);
    expectTypeOf<string>(testConfig.extensionInstanceId);
    expectTypeOf<string>(testConfig.language);
    expectTypeOf<"dark" | "light">(testConfig.theme);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  function testKnownContextParameters() {
    expectTypeOf<string | undefined>(testConfig.projectId);
    expectTypeOf<string | undefined>(testConfig.appInstallationId);
    expectTypeOf<string | undefined>(testConfig.customerId);
    expectTypeOf<string | undefined>(testConfig.containerId);
    expectTypeOf<string | undefined>(testConfig.mailAddressId);
    expectTypeOf<string | undefined>(testConfig.domainId);
    expectTypeOf<string | undefined>(testConfig.variantKey);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  function testDeprecatedContextParametersStayDeclared() {
    expectTypeOf<string | undefined>(testConfig.emailAddressId);
    expectTypeOf<string | undefined>(testConfig.ingressId);
  }

  /**
   * Pins the contract the runtime catchall implements: an undeclared context
   * parameter is readable (the property exists) and never `null`.
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  function testUnknownContextParameters() {
    expectTypeOf<string | undefined>(testConfig.unknownProp);
    expectTypeOf(testConfig.unknownProp).toEqualTypeOf<string | undefined>();
  }
}

/**
 * The input side stays tolerant: a host may still send `null` for a context
 * parameter, declared or not.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function configInput() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const testConfigInput = {
    sessionId: "session-id",
    userId: "user-id",
    extensionId: "extension-id",
    extensionInstanceId: "extension-instance-id",
    language: "de-DE",
    theme: "light",
    containerId: null,
    unknownProp: null,
  } as const satisfies ExtBridgeConfigInput;
}
