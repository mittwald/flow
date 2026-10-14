/*
 * Stands in for `@fortawesome/sharp-regular-svg-icons` when the Pro icons are
 * not installed — see `next.config.js` — and is what TypeScript checks the
 * Styleguide's imports against (`paths` in `tsconfig.json`), so CI type-checks
 * without a license. A Pro-only icon needs a free substitute here, or the
 * import fails to type-check.
 */
export * from "@fortawesome/free-solid-svg-icons";
export { faKeyboard as faCommand } from "@fortawesome/free-solid-svg-icons";
