import { buttonScenarios } from "../../src/tests/visual/Button.scenarios";
import * as components from "@mittwald/flow-remote-react-components";

// Bridge: expose the reusable Button visual scenarios as remote entries so the
// cross-version harness renders them (with the aliased version's components)
// through the iframe. The SAME scenarios drive the in-process screenshot tests
// in src/tests/visual/Button.browser.test.tsx.
export const states = () => buttonScenarios["Button states"](components);
export const colors = () => buttonScenarios["Button colors"](components);
export const withAvatar = () =>
  buttonScenarios["Button with avatar"](components);
export const edgeCases = () => buttonScenarios["Button edge cases"](components);
