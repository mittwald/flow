export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://flow.mittwald.de"
).replace(/\/$/, "");

export const pagePath = (segments: string[]): string =>
  `/${segments.join("/")}`;

export const rawMarkdownPath = (segments: string[]): string =>
  `/raw/${segments.join("/")}.md`;

export const absoluteUrl = (relativePath: string): string =>
  `${SITE_URL}${relativePath}`;
