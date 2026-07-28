/* eslint-disable @typescript-eslint/consistent-type-imports --
   These namespace imports are consumed only through `typeof` (below), which
   requires a value binding — `import type * as` cannot back `typeof`. This
   module is always imported via `import type`, so it emits no runtime code. */
import * as LocalComponents from "@mittwald/flow-react-components";
import * as RemoteComponents from "@/index";
/* eslint-enable @typescript-eslint/consistent-type-imports */
import type { ReactNode } from "react";

/**
 * The components bag a visual scenario renders with. It is the same in both
 * directions the scenario is used:
 *
 * - In-process (the `Local` / `Remote` visual environments), and
 * - Cross-version (an old published version's components in the iframe).
 */
export type ScenarioComponents =
  | typeof LocalComponents
  | typeof RemoteComponents;

/** A single visual scenario: build the tree from an injected components bag. */
export type VisualScenario = (components: ScenarioComponents) => ReactNode;

/** A named set of scenarios, keyed by the screenshot description. */
export type VisualScenarios = Record<string, VisualScenario>;
