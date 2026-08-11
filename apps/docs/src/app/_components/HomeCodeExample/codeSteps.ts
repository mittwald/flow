const heading = `  <Heading>Domain hinzufügen</Heading>`;

const text = `  <Text>Verbinde deine Domain mit deinem Projekt.</Text>`;

const actionGroup = [
  `  <ActionGroup>`,
  `    <Button color="accent">Domain verbinden</Button>`,
  `    <Button color="secondary" variant="soft">Abbrechen</Button>`,
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
const withText = [...base, "Text"];
const withActions = ["ActionGroup", "Button", ...withText];

/**
 * The composition the "Fokus auf Developer Experience" tile builds up, one
 * nested layer per step. Every step inserts at a single position (either inside
 * the import braces or before the closing `</Section>`) so the animation can
 * type the difference between two steps.
 */
export const codeSteps = [
  snippet(base, [heading]),
  snippet(withText, [heading]),
  snippet(withText, [heading, text]),
  snippet(withActions, [heading, text]),
  snippet(withActions, [heading, text, actionGroup]),
];
