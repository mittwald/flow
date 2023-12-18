import { ComponentType } from "react";
import { Item, ItemProps } from "react-stately";

export interface NavigationCollectionItemProps<T = never> extends ItemProps<T> {
  isCurrent?: boolean;
}

export const NavigationCollectionItem =
  Item as ComponentType<NavigationCollectionItemProps>;
