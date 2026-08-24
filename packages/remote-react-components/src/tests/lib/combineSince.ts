/**
 * First version that exports `Combine` (the renamed `Align`).
 *
 * The cross-version harness resolves components from old published versions,
 * which only export `Align` — a scenario rendering `Combine` has nothing to
 * resolve there and is skipped via `crossVersion({ below: combineSince })`.
 */
export const combineSince = "0.2.0-alpha.1050";
