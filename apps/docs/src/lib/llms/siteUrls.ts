export const CANONICAL_SITE_URL = "https://flow.mittwald.de";

export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? CANONICAL_SITE_URL
).replace(/\/$/, "");

/**
 * Whether this build serves the production site. A preview deployment (the
 * `next` line, a pull-request preview) is a byte-identical copy of the content
 * under its own permanent or temporary hostname, so it must stay out of search
 * indexes — see `robots.ts`.
 */
export const IS_CANONICAL_SITE = SITE_URL === CANONICAL_SITE_URL;

export const pagePath = (segments: string[]): string =>
  `/${segments.join("/")}`;

export const rawMarkdownPath = (segments: string[]): string =>
  `/raw/${segments.join("/")}.md`;

export const absoluteUrl = (relativePath: string): string =>
  `${SITE_URL}${relativePath}`;

export const claudePromptUrl = (prompt: string): string =>
  `https://claude.ai/new?q=${encodeURIComponent(prompt)}`;

export const chatGptPromptUrl = (prompt: string): string =>
  `https://chatgpt.com/?hints=search&q=${encodeURIComponent(prompt)}`;
