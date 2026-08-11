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
 * The editor shows the composition alone — spelled out, the import of seven
 * components takes more room than the example itself. The editor scope is still
 * derived from a real import statement, just one the reader never sees.
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
    "  <Header>",
    ...header,
    "  </Header>",
    ...section,
    "</Section>",
  ].join("\n");

/**
 * The composition the "Fokus auf Developer Experience" tile builds up, one
 * nested layer per step — a profile section in the shape of the detail page
 * pattern.
 *
 * Every step inserts a block at a single position, inside `<Header>` or
 * `<Section>`. That is what lets the animation type the difference between two
 * steps.
 */
export const codeSteps = [
  snippet([heading], []),
  snippet([heading], [labeledValue]),
  snippet([heading, headerAction], [labeledValue]),
];
