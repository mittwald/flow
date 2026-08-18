export type ComponentGrouping = "grouped" | "alphabetical";

export const componentGroupingStorageKey =
  "@mittwald/flow-docs/component-grouping";

export const defaultComponentGrouping: ComponentGrouping = "grouped";

export const parseComponentGrouping = (
  value: string | null | undefined,
): ComponentGrouping =>
  value === "alphabetical" ? "alphabetical" : defaultComponentGrouping;

/**
 * Both views are rendered, CSS picks one by this attribute. The script has to
 * run before the first paint, otherwise the stored view flashes the default
 * one.
 */
export const componentGroupingScript = `try{document.documentElement.dataset.componentGrouping=localStorage.getItem("${componentGroupingStorageKey}")==="alphabetical"?"alphabetical":"grouped"}catch(e){}`;
