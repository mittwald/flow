export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://flow.mittwald.de"
).replace(/\/$/, "");

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
