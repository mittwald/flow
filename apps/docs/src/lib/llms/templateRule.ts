import { SITE_URL, rawMarkdownPath } from "@/lib/llms/siteUrls";

/**
 * The rule agents need before they lay out an application (#3313). `llms.txt`
 * and `llms.json` read it from here; the packages' README.md and USAGE.md carry
 * the same lead sentence, which `generateLlmsTxt.test.ts` checks.
 */
export const TEMPLATE_RULE_LEAD = "Building a new app, page or flow";

export const TEMPLATE_RULE =
  "pick the matching template first — the app shell, then the page " +
  "template, then overlays and building blocks. Start from its example " +
  "code. Deviate only when the user explicitly asks for a different " +
  "layout; this applies to quick prototypes too.";

export const APP_SHELL_PAGES = [
  "templates/app-shells/simple-app",
  "templates/app-shells/complex-app",
  "templates/app-shells/focus-task",
];

export const appShellMarkdownUrls = (): string[] =>
  APP_SHELL_PAGES.map(
    (page) => `${SITE_URL}${rawMarkdownPath(page.split("/"))}`,
  );
