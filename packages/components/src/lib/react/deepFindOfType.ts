import type {
  ComponentProps,
  ElementType,
  FunctionComponentElement,
  ReactNode,
} from "react";
import { isValidElement } from "react";
import { deepFind, deepForEach } from "react-children-utilities";

const isOfType = <T extends ElementType>(
  c: ReactNode,
  searchType: T,
): c is FunctionComponentElement<ComponentProps<T>> => {
  if (!isValidElement(c)) {
    return false;
  }

  if (typeof searchType === "string") {
    if (typeof c.type === "string") {
      return c.type === searchType;
    }
    return false;
  }

  return c.type === searchType;
};

export const deepFindOfType = <T extends ElementType>(
  children: ReactNode,
  searchType: T,
): FunctionComponentElement<ComponentProps<T>> | undefined =>
  deepFind(children, (c) => isOfType(c, searchType)) as
    | FunctionComponentElement<ComponentProps<T>>
    | undefined;

export const deepFilterByType = <T extends ElementType>(
  children: ReactNode,
  searchType: T,
): Array<FunctionComponentElement<ComponentProps<T>>> => {
  const result: Array<FunctionComponentElement<ComponentProps<T>>> = [];

  deepForEach(children, (c) => {
    if (isOfType(c, searchType)) {
      result.push(c);
    }
  });

  return result;
};
