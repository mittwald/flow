import { getAllDocPages } from "@/lib/llms/docPages";
import { APP_PACKAGE, REMOTE_PACKAGE } from "@/lib/llms/remoteUsage";
import { SITE_URL, pagePath, rawMarkdownPath } from "@/lib/llms/siteUrls";
import {
  TEMPLATE_RULE,
  TEMPLATE_RULE_LEAD,
  appShellMarkdownUrls,
} from "@/lib/llms/templateRule";

export const generateLlmsJson = () => {
  const pages = getAllDocPages().map((page) => ({
    title: page.title,
    ...(page.description ? { description: page.description } : {}),
    url: `${SITE_URL}${pagePath(page.segments)}`,
    markdown: `${SITE_URL}${rawMarkdownPath(page.segments)}`,
    ...(page.component ? { component: page.component } : {}),
    ...(page.remote ? { remote: page.remote } : {}),
  }));

  return {
    name: "mittwald Flow",
    description:
      "Design system of mittwald: accessible, brand-aligned React components, " +
      "design tokens and patterns. Documentation is written in German.",
    // Ahead of `pages`: an agent that filters the page list by component names
    // never reaches the templates otherwise (#3313).
    instructions: {
      templates: `${TEMPLATE_RULE_LEAD}: ${TEMPLATE_RULE}`,
      appShells: appShellMarkdownUrls(),
      usage:
        `Building an application with ${APP_PACKAGE}: read ` +
        `node_modules/${APP_PACKAGE}/USAGE.md first. Building an mStudio ` +
        `extension with ${REMOTE_PACKAGE}: read ` +
        `node_modules/${REMOTE_PACKAGE}/USAGE.md first.`,
    },
    package: APP_PACKAGE,
    remotePackage: REMOTE_PACKAGE,
    repository: "https://github.com/mittwald/flow",
    llmsTxt: `${SITE_URL}/llms.txt`,
    llmsFullTxt: `${SITE_URL}/llms-full.txt`,
    pageCount: pages.length,
    pages,
  };
};
