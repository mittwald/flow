const DOCS_SITE = "https://flow.mittwald.de";

/**
 * Agents often enter the documentation through this index. The template rule
 * leads, so it is read before the agent starts composing a layout from the
 * components below (#3313).
 */
export const docsMeta = (packageName: string, version: string) => ({
  package: packageName,
  version,
  instructions: {
    templates:
      "Building a new app, page or flow: pick the matching template first — " +
      "the app shell, then the page template, then overlays and building " +
      "blocks. Start from its example code. Deviate only when the user " +
      "explicitly asks for a different layout; this applies to quick " +
      "prototypes too.",
    appShells: ["simple-app", "complex-app", "focus-task"].map(
      (shell) => `${DOCS_SITE}/raw/templates/app-shells/${shell}.md`,
    ),
    usage:
      `Read node_modules/${packageName}/USAGE.md first — its section ` +
      '"Start from a template" maps use cases to templates.',
  },
  docs: {
    site: DOCS_SITE,
    llmsTxt: `${DOCS_SITE}/llms.txt`,
    llmsJson: `${DOCS_SITE}/llms.json`,
    llmsFullTxt: `${DOCS_SITE}/llms-full.txt`,
    note:
      "Follow `instructions` before you look up components. The documentation " +
      "is written in German; component names and design-system terms are not " +
      "translated. llms.json lists every page with a Markdown URL under " +
      "/raw/<path>.md — use it to resolve a component name to its page.",
  },
});
