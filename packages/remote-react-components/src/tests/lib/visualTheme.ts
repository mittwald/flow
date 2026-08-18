/**
 * The visual suite already runs in two browsers, so the theme rides along on
 * the browser instead of doubling the run time with a second axis (see
 * `dev/vitest/setupVisualTheme.ts`): Firefox renders the dark theme, the others
 * light.
 *
 * Detected from the user agent, NOT `vitest/browser`'s `server`: the scenario
 * files reach this helper (via `alphaColorAccentBoxBackground`), and scenarios
 * are also loaded in the cross-version iframe — a plain dev-server document
 * outside Vitest — where a top-level `import … from "vitest/browser"` throws
 * ("can be imported only inside the Browser Mode") and crashes the remote
 * document before it can render. The user agent is available in every browser
 * realm and agrees with the Vitest browser instance name.
 */
export const isDarkVisualTheme = (): boolean =>
  typeof navigator !== "undefined" && navigator.userAgent.includes("Firefox");
