const heading = `  <Heading>WordPress 6.5.3</Heading>`;

const labeledValue = [
  `  <LabeledValue>`,
  `    <Label>Installationsverzeichnis</Label>`,
  `    <InlineCode>/wordpress-th6v8</InlineCode>`,
  `  </LabeledValue>`,
].join("\n");

const actionGroup = [
  `  <ActionGroup>`,
  `    <Button color="accent">App öffnen</Button>`,
  `    <Button color="secondary" variant="soft">`,
  `      Einstellungen`,
  `    </Button>`,
  `  </ActionGroup>`,
].join("\n");

const snippet = (components: string[], children: string[]): string =>
  [
    "import {",
    ...components.map((component) => `  ${component},`),
    `} from "@mittwald/flow-react-components";`,
    "",
    "<Section>",
    ...children,
    "</Section>",
  ].join("\n");

const base = ["Heading", "Section"];
const withValue = ["Heading", "InlineCode", "Label", "LabeledValue", "Section"];
const withActions = ["ActionGroup", "Button", ...withValue];

/**
 * The composition the "Fokus auf Developer Experience" tile builds up, one
 * nested layer per step — the app details of the Anlegeprozess pattern.
 *
 * Every step inserts at a single position: a contiguous run of imports (the
 * component names are picked so the additions stay adjacent in alphabetical
 * order) or a block before the closing `</Section>`. That is what lets the
 * animation type the difference between two steps.
 */
export const codeSteps = [
  snippet(base, [heading]),
  snippet(withValue, [heading]),
  snippet(withValue, [heading, labeledValue]),
  snippet(withActions, [heading, labeledValue]),
  snippet(withActions, [heading, labeledValue, actionGroup]),
];
