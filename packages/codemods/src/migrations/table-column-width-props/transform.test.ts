import { describe, expect, test } from "vitest";
import { runTransform } from "../../tests/runTransform";

const transform = "table-column-width-props";

describe(transform, () => {
  test("drops maxWidth and a null width, keeps a real width", () => {
    const source = `import { Table, TableColumn } from "@mittwald/flow-react-components";

export const Demo = () => (
  <Table>
    <TableColumn width="50%" minWidth={null} maxWidth={400} />
  </Table>
);
`;

    const result = runTransform(transform, source);

    expect(result).toContain(`width="50%"`);
    expect(result).not.toContain("maxWidth");
    expect(result).not.toContain("minWidth");
  });

  test("drops maxWidth whatever its value is", () => {
    // The prop was removed from the type, so an explicit attribute is wrong at
    // any value — an expression included. That is decidable without reading it.
    const source = `import { TableColumn } from "@mittwald/flow-react-components";

export const Demo = () => <TableColumn maxWidth={computed} width={200} />;
`;

    const result = runTransform(transform, source);

    expect(result).not.toContain("maxWidth");
    expect(result).toContain("width={200}");
  });

  test("leaves a width it cannot read", () => {
    // `width={maybeNull}` could be anything at runtime. Declining it is the same
    // choice `accent-box-color-to-background-color` makes for `color={…}`.
    const source = `import { TableColumn } from "@mittwald/flow-react-components";

export const Demo = () => <TableColumn width={maybeNull} minWidth={fallback} />;
`;

    expect(runTransform(transform, source)).toBe(source);
  });

  test("resolves an aliased import", () => {
    const source = `import { TableColumn as Column } from "@mittwald/flow-react-components";

export const Demo = () => <Column maxWidth={400} width={null} />;
`;

    const result = runTransform(transform, source);

    expect(result).not.toContain("maxWidth");
    expect(result).not.toContain("width");
  });

  test("resolves a namespace import", () => {
    const source = `import * as Flow from "@mittwald/flow-react-components";

export const Demo = () => <Flow.TableColumn maxWidth={400} />;
`;

    expect(runTransform(transform, source)).not.toContain("maxWidth");
  });

  test("covers the remote package and its subpath entries", () => {
    const source = `import { TableColumn } from "@mittwald/flow-remote-react-components";
import { TableColumn as Universal } from "@mittwald/flow-react-components/flr-universal";

export const A = () => <TableColumn maxWidth={1} />;
export const B = () => <Universal maxWidth={2} />;
`;

    expect(runTransform(transform, source)).not.toContain("maxWidth");
  });

  test("leaves another package's TableColumn alone", () => {
    const source = `import { TableColumn } from "some-other-table-library";

export const Demo = () => <TableColumn maxWidth={400} width={null} />;
`;

    expect(runTransform(transform, source)).toBe(source);
  });

  test("leaves the same props on another Flow component alone", () => {
    const source = `import { TableColumn, Image } from "@mittwald/flow-react-components";

export const Demo = () => (
  <>
    <Image maxWidth={400} />
    <TableColumn maxWidth={400} />
  </>
);
`;

    const result = runTransform(transform, source);

    expect(result).toContain("<Image maxWidth={400} />");
    expect(result).not.toContain("<TableColumn maxWidth");
  });

  test("does not touch a spread, and still handles the props beside it", () => {
    // A spread could carry `maxWidth` and there is no way to see it from here.
    const source = `import { TableColumn } from "@mittwald/flow-react-components";

export const Demo = () => <TableColumn {...rest} maxWidth={400} />;
`;

    const result = runTransform(transform, source);

    expect(result).toContain("{...rest}");
    expect(result).not.toContain("maxWidth");
  });
});

/**
 * Consumers run codemods one after another, so a second pass over already
 * migrated code has to be a no-op — see `src/tests/transformCoverage.test.ts`
 * for why every transform is required to prove this.
 */
describe("running it twice changes nothing", () => {
  test("stays idempotent", () => {
    const source = `import { TableColumn } from "@mittwald/flow-react-components";

export const Demo = () => (
  <>
    <TableColumn maxWidth={400} width={null} />
    <TableColumn width="50%" />
  </>
);
`;

    const once = runTransform(transform, source);
    expect(runTransform(transform, once)).toBe(once);
  });
});
