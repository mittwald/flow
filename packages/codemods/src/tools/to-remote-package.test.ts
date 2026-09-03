import { describe, expect, test } from "vitest";
import { runTransform } from "../tests/runTransform";

const transform = "to-remote-package";

describe(transform, () => {
  test("ports imports to the remote package", () => {
    const source = `import { Button } from "@mittwald/flow-react-components";
`;

    expect(runTransform(transform, source))
      .toBe(`import { Button } from "@mittwald/flow-remote-react-components";
`);
  });
});

/**
 * Consumers run codemods one after another, so a second pass over already
 * migrated code has to be a no-op. Unlike the transforms under
 * `src/migrations`, this one has no catalogue entry — it is a port, not a
 * migration (see the module doc in `to-remote-package.ts`) — so it falls
 * outside `src/tests/transformCoverage.test.ts`'s directory scan. It still gets
 * the same guarantee, just proven here instead of by that check.
 */
describe("running it twice changes nothing", () => {
  test("stays idempotent", () => {
    const source = `import { Button } from "@mittwald/flow-react-components";
import { Text } from "@mittwald/flow-remote-react-components";
import "@mittwald/flow-react-components/all.css";
`;

    const once = runTransform(transform, source);
    expect(runTransform(transform, once)).toBe(once);
  });
});
