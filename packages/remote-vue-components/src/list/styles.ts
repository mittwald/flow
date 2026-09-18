/*
 * Flow's own class names, from the List's CSS modules.
 *
 * Generated from each file's path (`flow--list--header--options` is
 * `Header.module.scss`'s `.options`), shipped in `@mittwald/flow-stylesheet`,
 * and not importable from a published package — so a Vue rebuild of a React
 * composition has to name them. The same trade `Modal` makes, and the same
 * argument for marking `List` `@flr-generate` instead.
 */
export const listStyles = {
  list: "flow--list",
  listWrapper: "flow--list--list-wrapper",
  hideVisuallyEmptyView: "flow--list--hide-visually-empty-view",
  items: "flow--list--items",
  itemsLoading: "flow--list--items--is-loading",
  itemsTiles: "flow--list--items--tiles",
  footer: "flow--list--footer",
  header: "flow--list--header",
  headerContent: "flow--list--header--header-content",
  headerOptions: "flow--list--header--options",
  headerWithSearch: "flow--list--header--with-search",
  hideOnMobile: "flow--list--header--hide-on-mobile",
  hideOnDesktop: "flow--list--header--hide-on-desktop",
} as const;

export const className = (
  ...parts: (string | false | undefined)[]
): string | undefined => {
  const used = parts.filter((p): p is string => !!p);
  return used.length > 0 ? used.join(" ") : undefined;
};
