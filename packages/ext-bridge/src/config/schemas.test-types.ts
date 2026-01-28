import type { ExtBridgeConfig } from "@/types";
import { expectTypeOf } from "vitest";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function config() {
  const testConfig = {} as ExtBridgeConfig;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  function testKnownContextParameters() {
    expectTypeOf<string | undefined>(testConfig.projectId);
    expectTypeOf<string | undefined>(testConfig.appInstallationId);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  function testUnknownContextParameters() {
    expectTypeOf<string | null | undefined>(testConfig.unknownProp);
  }
}
