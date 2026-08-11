const heading = `    <Heading>WordPress 6.5.3</Heading>`;

const headerAction = `    <Button color="secondary" variant="soft">Öffnen</Button>`;

const labeledValue = [
  `  <LabeledValue>`,
  `    <Label>Installationsverzeichnis</Label>`,
  `    <InlineCode>/wordpress-th6v8</InlineCode>`,
  `  </LabeledValue>`,
].join("\n");

interface Snippet {
  components: string[];
  header: string[];
  section: string[];
}

const snippet = ({ components, header, section }: Snippet): string =>
  [
    "import {",
    ...components.map((component) => `  ${component},`),
    `} from "@mittwald/flow-react-components";`,
    "",
    "<Section>",
    "  <Header>",
    ...header,
    "  </Header>",
    ...section,
    "</Section>",
  ].join("\n");

const base = ["Header", "Heading", "Section"];
const withValue = [
  "Header",
  "Heading",
  "InlineCode",
  "Label",
  "LabeledValue",
  "Section",
];
const withAction = ["Button", ...withValue];

/**
 * The composition the "Fokus auf Developer Experience" tile builds up, one
 * nested layer per step — the app details of the Anlegeprozess pattern.
 *
 * Every step inserts at a single position: a contiguous run of imports (the
 * component names are picked so the additions stay adjacent in alphabetical
 * order) or a block inside `<Header>` or `<Section>`. That is what lets the
 * animation type the difference between two steps.
 */
export const codeSteps = [
  snippet({ components: base, header: [heading], section: [] }),
  snippet({ components: withValue, header: [heading], section: [] }),
  snippet({
    components: withValue,
    header: [heading],
    section: [labeledValue],
  }),
  snippet({
    components: withAction,
    header: [heading],
    section: [labeledValue],
  }),
  snippet({
    components: withAction,
    header: [heading, headerAction],
    section: [labeledValue],
  }),
];
