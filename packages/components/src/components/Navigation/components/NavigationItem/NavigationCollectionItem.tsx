import { ComponentProps, ComponentType } from "react";
import { Item, ItemProps } from "react-stately";

export interface NavigationCollectionItemProps<T = never> extends ItemProps<T> {
  isCurrent?: boolean;
  linkComponent?: ComponentType<Omit<ComponentProps<"a">, "ref">>;
}

export const NavigationCollectionItem =
  Item as ComponentType<NavigationCollectionItemProps>;
