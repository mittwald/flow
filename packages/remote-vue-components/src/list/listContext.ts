import { inject, provide, type InjectionKey } from "vue";
import type { ListModel } from "./model";

/**
 * The list a component inside it sees.
 *
 * `never`, not `any`: the item type is the consumer's, and every read of an
 * item goes through the consumer's own render function. `any` would be the
 * `Table<any>` variance trap — a `ListModel<never>` is not assignable to it.
 */
export type AnyListModel = ListModel<never>;

const listModelKey: InjectionKey<AnyListModel> = Symbol("flowListModel");

export const provideListModel = (model: AnyListModel): void =>
  provide(listModelKey, model);

export const injectListModel = (): AnyListModel => {
  const model = inject(listModelKey, undefined);

  if (!model) {
    throw new Error("This component must be used inside a <List />.");
  }

  return model;
};
