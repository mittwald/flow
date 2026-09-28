import { getAllDocPages, type DocPage } from "@/lib/llms/docPages";
import {
  APP_PACKAGE,
  REMOTE_PACKAGE,
  componentsWithoutRemote,
} from "@/lib/llms/remoteUsage";
import { SITE_URL, rawMarkdownPath } from "@/lib/llms/siteUrls";

/** The pages that decide most questions, in reading order. */
export const START_PAGES = [
  "foundations/structure/layout",
  "foundations/structure/spacing",
  "templates/bausteine/formular",
  "templates/seiten/uebersichtsseite",
  "templates/seiten/detailseite",
  "foundations/content-guidelines/error-handling",
  "foundations/content-guidelines/sprach-guide",
  "get-started/versioning",
];

const markdownUrl = (page: DocPage): string =>
  `${SITE_URL}${rawMarkdownPath(page.segments)}`;

const toListItem = (page: DocPage): string => {
  const suffix = page.description ? `: ${page.description}` : "";
  return `- [${page.title}](${markdownUrl(page)})${suffix}`;
};

const sectionHeading = (section: string): string =>
  section
    .split("-")
    .map((word) => `${word.charAt(0).toUpperCase()}${word.substring(1)}`)
    .join(" ");

/** Pages arrive in content order, so the sections keep it too. */
const groupBySection = (pages: DocPage[]): Map<string, DocPage[]> => {
  const sections = new Map<string, DocPage[]>();
  for (const page of pages) {
    const section = page.segments[0] ?? "";
    sections.set(section, [...(sections.get(section) ?? []), page]);
  }
  return sections;
};

const startPages = (pages: DocPage[]): DocPage[] =>
  START_PAGES.map((key) => {
    const page = pages.find((p) => p.segments.join("/") === key);
    if (!page) {
      throw new Error(`llms.txt start page "${key}" does not exist`);
    }
    return page;
  });

const header = (pages: DocPage[]): string =>
  [
    "# mittwald Flow",
    "",
    "> Flow is the design system of mittwald: accessible React components, " +
      "design tokens and patterns for mStudio user interfaces. The " +
      "documentation is written in German; component names and " +
      "design-system terms (Variants, Colors, Props) are not translated.",
    "",
    "Every link below points to the Markdown version of a page. Fetch the " +
      "page before you decide on a component, a layout or a UI text — do not " +
      "answer from memory. Start with these:",
    "",
    ...startPages(pages).map(toListItem),
    "",
    `**Building an application** with \`${APP_PACKAGE}\`: read ` +
      `\`node_modules/${APP_PACKAGE}/USAGE.md\` first. It ships with the ` +
      "package, matches your installed version and covers setup, layout, " +
      "spacing and what you may depend on. " +
      `\`${APP_PACKAGE}/component-index\` lists every component with its ` +
      "props.",
    "",
    `**Building an mStudio extension** with \`${REMOTE_PACKAGE}\`: read ` +
      `\`node_modules/${REMOTE_PACKAGE}/USAGE.md\` first. The components ` +
      "have the same names and props, with these differences:",
    "",
    `- Import from \`${REMOTE_PACKAGE}\`, the form components \`Field\`, ` +
      `\`ResetButton\` and \`SubmitButton\` from ` +
      `\`${REMOTE_PACKAGE}/react-hook-form\`. The examples on the pages ` +
      `import from \`${APP_PACKAGE}\`, which does not render in an extension.`,
    "- Every component page states at its top whether the component exists " +
      "remotely and which props do not reach the host.",
    `- Not available remotely: ${componentsWithoutRemote().join(", ")}.`,
  ].join("\n");

const optionalSection = (): string =>
  [
    "## Optional",
    "",
    `- [Full documentation](${SITE_URL}/llms-full.txt): every page in one ` +
      "file — large; fetch single pages instead where you can.",
    `- [Manifest](${SITE_URL}/llms.json): title, description, page URL, ` +
      "Markdown URL and remote availability per page, as JSON.",
  ].join("\n");

export const generateLlmsTxt = (): string => {
  const pages = getAllDocPages();

  const sections = [...groupBySection(pages)].map(([section, sectionPages]) =>
    [`## ${sectionHeading(section)}`, "", ...sectionPages.map(toListItem)].join(
      "\n",
    ),
  );

  return [header(pages), ...sections, optionalSection()].join("\n\n") + "\n";
};
