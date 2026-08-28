import { describe, expect, test } from "vitest";
import { runTransform } from "../../tests/runTransform";

const transform = "imports-to-package-root";

describe(transform, () => {
  test("collapses subpath imports onto the package root", () => {
    const source = `import { Button } from "@mittwald/flow-react-components/components/Button";
import "@mittwald/flow-react-components/global.css";
`;

    expect(runTransform(transform, source))
      .toBe(`import { Button } from "@mittwald/flow-react-components";
import "@mittwald/flow-react-components/all.css";
`);
  });
});

/**
 * Consumers run codemods one after another, so a second pass over already
 * migrated code has to be a no-op — see `src/tests/transformCoverage.test.ts`
 * for why every transform is required to prove this.
 */
describe("running it twice changes nothing", () => {
  test("stays idempotent", () => {
    const source = `import { Button } from "@mittwald/flow-react-components/components/Button";
import { Text } from "@mittwald/flow-react-components/components/Text";
import { useForm } from "@mittwald/flow-react-components/react-hook-form/x";
import "@mittwald/flow-react-components/global.css";
`;

    const once = runTransform(transform, source);
    expect(runTransform(transform, once)).toBe(once);
  });
});
