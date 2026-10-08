/*
 * The overlays' UI text, copied from Flow's locale files.
 *
 * Flow's are compiled into the React bundle by a locale plugin and are not
 * importable from a published package, so the only way a Vue binding can put
 * words on these overlays is to carry its own. A rewording on the Flow side
 * fails `src/tests/CopiedTexts.test.ts`. The generated `Modal` this layer
 * argues for would remove the copy.
 */

/**
 * `Modal confirmOnClose`, from
 * `packages/components/src/components/Modal/locales/*.locale.json`. `close`
 * also labels the modal's own close button, as Flow's `close` key does.
 */
export const confirmCloseTexts = {
  "en-US": {
    heading: "Unsaved changes",
    text: "You have unsaved changes. Are you sure you want to close the modal? All changes will be lost.",
    close: "Close",
    keepOpen: "Keep editing",
  },
  "de-DE": {
    heading: "Ungespeicherte Änderungen",
    text: "Du hast ungespeicherte Änderungen. Möchtest du das Modal wirklich schließen? Alle Änderungen gehen dabei verloren.",
    close: "Schließen",
    keepOpen: "Weiter bearbeiten",
  },
};

/**
 * The `LightBox` close button's label, from
 * `packages/components/src/components/LightBox/locales/*.locale.json`.
 */
export const lightBoxCloseTexts = { "de-DE": "Schließen", "en-US": "Close" };
