const components = [
  "Button",
  "Content",
  "Header",
  "Heading",
  "Label",
  "LabeledValue",
  "Section",
];

/**
 * Source of the editor scope. The steps leave the import out on purpose —
 * spelled out it takes more room in the tile than the composition itself.
 */
export const scopeSource = `import { ${components.join(", ")} } from "@mittwald/flow-react-components";`;

const heading = `    <Heading>Profil</Heading>`;

const headerAction = [
  `    <Button color="secondary" variant="soft">`,
  `      Bearbeiten`,
  `    </Button>`,
].join("\n");

const labeledValue = [
  `  <LabeledValue>`,
  `    <Label>E-Mail-Adresse</Label>`,
  `    <Content>max@mustermann.de</Content>`,
  `  </LabeledValue>`,
].join("\n");

const snippet = (header: string[], section: string[]): string =>
  [
    "<Section>",
    ...(header.length > 0 ? ["  <Header>", ...header, "  </Header>"] : []),
    ...section,
    "</Section>",
  ].join("\n");

/**
 * Every step must add one block at a single position — that is what lets the
 * animation type the difference between two steps. A step that wraps an
 * existing element or grows in two places appears at once instead.
 */
export const codeSteps = [
  snippet([], []),
  snippet([heading], []),
  snippet([heading], [labeledValue]),
  snippet([heading, headerAction], [labeledValue]),
];
