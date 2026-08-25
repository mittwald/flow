/**
 * The examples the homepage tile cycles through. Each one runs the same story:
 * loose components — rendered one below the other, in the order they are
 * written — get nested step by step until Flow arranges them on its own.
 *
 * Every step must be a valid, self-contained example: it is what the preview
 * renders while the next step is being typed. Multi-root steps need the
 * fragment, and it doubles as the placeholder the wrapper later replaces.
 *
 * Lines that already exist in the previous step (compared without indentation)
 * are carried over instantly — only genuinely new lines are typed out. Keep
 * lines textually identical across steps so they are recognized.
 */

const indent = (lines: string) =>
  lines
    .split("\n")
    .map((line) => `  ${line}`)
    .join("\n");

const lines = (...parts: string[]) => parts.join("\n");

// A section header lifts the button up next to the heading; `LabeledValue` ties
// the label to its value.
const profileHeading = `  <Heading>Profil</Heading>`;
const profileButton = lines(
  `  <Button color="secondary" variant="soft">`,
  `    Bearbeiten`,
  `  </Button>`,
);
const profileLabel = `  <Label>E-Mail-Adresse</Label>`;
const profileValue = `  <Content>max@mustermann.de</Content>`;

const profileExample = [
  lines("<>", profileHeading, profileButton, "</>"),

  lines("<>", profileHeading, profileButton, profileLabel, profileValue, "</>"),

  lines(
    "<>",
    profileHeading,
    profileButton,
    "  <LabeledValue>",
    indent(profileLabel),
    indent(profileValue),
    "  </LabeledValue>",
    "</>",
  ),

  lines(
    "<Section>",
    "  <Header>",
    indent(profileHeading),
    indent(profileButton),
    "  </Header>",
    "  <LabeledValue>",
    indent(profileLabel),
    indent(profileValue),
    "  </LabeledValue>",
    "</Section>",
  ),
];

// `Combine` puts avatar and text side by side, aligned and spaced.
const initials = "<Initials>Max Mustermann</Initials>";
const avatar = lines("<Avatar>", indent(initials), "</Avatar>");
const person = lines(
  "<Text>",
  "  <strong>Max Mustermann</strong>",
  "  Organisationsinhaber",
  "</Text>",
);

const combineExample = [
  initials,

  avatar,

  lines("<>", indent(avatar), indent(person), "</>"),

  lines("<Combine>", indent(avatar), indent(person), "</Combine>"),
];

// `IllustratedMessage` centers the group, sizes the icon and spaces the parts.
const emptyStateIcon = `  <IconApp />`;
const emptyStateHeading = `  <Heading>Keine Apps installiert</Heading>`;
const emptyStateText = lines(
  "  <Text>",
  "    Lege deine erste App an, um mit der Arbeit an deiner",
  "    Webseite loszulegen.",
  "  </Text>",
);
const emptyStateButton = `  <Button>App anlegen</Button>`;

const emptyStateExample = [
  emptyStateIcon.trim(),

  lines("<>", emptyStateIcon, emptyStateHeading, "</>"),

  lines("<>", emptyStateIcon, emptyStateHeading, emptyStateText, "</>"),

  lines(
    "<>",
    emptyStateIcon,
    emptyStateHeading,
    emptyStateText,
    emptyStateButton,
    "</>",
  ),

  lines(
    "<IllustratedMessage>",
    emptyStateIcon,
    emptyStateHeading,
    emptyStateText,
    emptyStateButton,
    "</IllustratedMessage>",
  ),
];

export const composingCodeExamples: string[][] = [
  profileExample,
  combineExample,
  emptyStateExample,
];

/**
 * The examples themselves show only the JSX — the tile is about composition,
 * and an import block for a dozen components would more than double its height.
 * The editor scope is built from this instead.
 */
export const exampleImports = lines(
  "import {",
  "  Avatar,",
  "  Button,",
  "  Combine,",
  "  Content,",
  "  Header,",
  "  Heading,",
  "  IconApp,",
  "  IllustratedMessage,",
  "  Initials,",
  "  Label,",
  "  LabeledValue,",
  "  Section,",
  "  Text,",
  `} from "@mittwald/flow-react-components";`,
);
