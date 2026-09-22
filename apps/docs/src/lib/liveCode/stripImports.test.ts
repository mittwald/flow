import { expect, test } from "vitest";
import { stripImports } from "./stripImports";

test("removes a single-line import", () => {
  expect(
    stripImports(
      `import { Button } from "@mittwald/flow-react-components";\n\n<Button>Button</Button>;\n`,
    ),
  ).toBe("<Button>Button</Button>;");
});

test("removes a multi-line import", () => {
  expect(
    stripImports(
      `import {\n  Button,\n  Heading,\n} from "@mittwald/flow-react-components";\n\n<Heading>Titel</Heading>;\n`,
    ),
  ).toBe("<Heading>Titel</Heading>;");
});

test("keeps the code between imports readable", () => {
  expect(
    stripImports(
      `import { useState } from "react";\n\nconst items = [1, 2];\n\nimport { List } from "@mittwald/flow-react-components";\n\n<List items={items} />;\n`,
    ),
  ).toBe("const items = [1, 2];\n\n<List items={items} />;");
});

test("returns unparsable code unchanged", () => {
  const code = `import { Button } from "@mittwald/flow-react-components"\n\n<Button>`;
  expect(stripImports(code)).toBe(code);
});
