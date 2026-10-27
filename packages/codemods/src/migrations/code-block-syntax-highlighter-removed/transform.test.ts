import { describe, expect, test } from "vitest";
import { runTransform } from "../../tests/runTransform";

const transform = "code-block-syntax-highlighter-removed";

describe(transform, () => {
  test("drops the highlighter props and keeps the ones that survived", () => {
    const source = `import { CodeBlock } from "@mittwald/flow-react-components";

export const Demo = () => (
  <CodeBlock
    code="const a = 1;"
    language="ts"
    copyable
    showLineNumbers
    wrapLongLines
    startingLineNumber={5}
    useInlineStyles={false}
  />
);
`;

    const result = runTransform(transform, source);

    expect(result).toContain(`code="const a = 1;"`);
    expect(result).toContain(`language="ts"`);
    expect(result).toContain("copyable");
    expect(result).toContain("showLineNumbers");
    expect(result).not.toContain("wrapLongLines");
    expect(result).not.toContain("startingLineNumber");
    expect(result).not.toContain("useInlineStyles");
  });

  test("showLineNumbers survives, showInlineLineNumbers does not", () => {
    // The two differ by one word and only one of them was kept — the reason
    // this is worth a codemod rather than a grep.
    const source = `import { CodeBlock } from "@mittwald/flow-react-components";

export const Demo = () => <CodeBlock showLineNumbers showInlineLineNumbers />;
`;

    const result = runTransform(transform, source);

    expect(result).toContain("showLineNumbers");
    expect(result).not.toContain("showInlineLineNumbers");
  });

  test("style goes too — on CodeBlock it was the highlighter's theme", () => {
    const source = `import { CodeBlock } from "@mittwald/flow-react-components";

export const Demo = () => <CodeBlock style={theme} customStyle={{ margin: 0 }} />;
`;

    const result = runTransform(transform, source);

    expect(result).not.toContain("style");
  });

  test("drops a removed prop whatever its value is", () => {
    // Removed from the type, so an explicit attribute is wrong at any value.
    const source = `import { CodeBlock } from "@mittwald/flow-react-components";

export const Demo = () => <CodeBlock renderer={computed} PreTag={Pre} CodeTag="span" />;
`;

    const result = runTransform(transform, source);

    expect(result).not.toContain("renderer");
    expect(result).not.toContain("PreTag");
    expect(result).not.toContain("CodeTag");
  });

  test("resolves an aliased import", () => {
    const source = `import { CodeBlock as Snippet } from "@mittwald/flow-react-components";

export const Demo = () => <Snippet wrapLines code="x" />;
`;

    const result = runTransform(transform, source);

    expect(result).not.toContain("wrapLines");
    expect(result).toContain(`code="x"`);
  });

  test("resolves a namespace import", () => {
    const source = `import * as Flow from "@mittwald/flow-react-components";

export const Demo = () => <Flow.CodeBlock lineProps={props} />;
`;

    expect(runTransform(transform, source)).not.toContain("lineProps");
  });

  test("covers the remote package and its subpath entries", () => {
    const source = `import { CodeBlock } from "@mittwald/flow-remote-react-components";
import { CodeBlock as Universal } from "@mittwald/flow-react-components/flr-universal";

export const A = () => <CodeBlock wrapLongLines />;
export const B = () => <Universal wrapLongLines />;
`;

    expect(runTransform(transform, source)).not.toContain("wrapLongLines");
  });

  test("leaves another package's CodeBlock alone", () => {
    const source = `import { CodeBlock } from "some-other-docs-library";

export const Demo = () => <CodeBlock wrapLongLines showInlineLineNumbers />;
`;

    expect(runTransform(transform, source)).toBe(source);
  });

  test("leaves the same props on another Flow component alone", () => {
    // `color` is a live prop almost everywhere else in Flow — scoping this to
    // `CodeBlock` is what keeps the transform from stripping working code.
    const source = `import { CodeBlock, Button } from "@mittwald/flow-react-components";

export const Demo = () => (
  <>
    <Button color="danger" />
    <CodeBlock color="dark" />
  </>
);
`;

    const result = runTransform(transform, source);

    expect(result).toContain(`<Button color="danger" />`);
    expect(result).not.toContain("<CodeBlock color");
  });

  test("does not touch a spread, and still handles the props beside it", () => {
    const source = `import { CodeBlock } from "@mittwald/flow-react-components";

export const Demo = () => <CodeBlock {...rest} wrapLongLines />;
`;

    const result = runTransform(transform, source);

    expect(result).toContain("{...rest}");
    expect(result).not.toContain("wrapLongLines");
  });
});

/**
 * Consumers run codemods one after another, so a second pass over already
 * migrated code has to be a no-op — see `src/tests/transformCoverage.test.ts`
 * for why every transform is required to prove this.
 */
describe("running it twice changes nothing", () => {
  test("stays idempotent", () => {
    const source = `import { CodeBlock } from "@mittwald/flow-react-components";

export const Demo = () => (
  <>
    <CodeBlock code="a" wrapLongLines />
    <CodeBlock code="b" language="ts" />
  </>
);
`;

    const once = runTransform(transform, source);
    expect(runTransform(transform, once)).toBe(once);
  });
});
