import { inject, provide, type InjectionKey, type Ref } from "vue";

/**
 * What an expandable item tells the view inside it.
 *
 * Flow's React list writes the same three things into a props context for the
 * `Content slot="bottom"` of that one item — an id, whether it is open, and how
 * to toggle it. There is no such context here, so the item provides it and
 * `ListItemView` injects it.
 */
export interface ListItemAccordion {
  readonly isExpanded: Ref<boolean>;
  readonly contentId: string;
  toggle: () => void;
}

const key: InjectionKey<ListItemAccordion> = Symbol("flowListItemAccordion");

export const provideItemAccordion = (accordion: ListItemAccordion): void =>
  provide(key, accordion);

/** `undefined` unless the list is in accordion mode. */
export const injectItemAccordion = (): ListItemAccordion | undefined =>
  inject(key, undefined);
