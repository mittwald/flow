import { mapAttributeToReactProperty } from "@/lib/mapAttributeToReactProperty";
import clsx from "clsx";
import { createElement } from "react";
import { mapKeys } from "remeda";

type ElementTagNameMap = HTMLElementTagNameMap &
  Pick<
    SVGElementTagNameMap,
    Exclude<keyof SVGElementTagNameMap, keyof HTMLElementTagNameMap>
  >;

interface Options {
  isVoidElement?: boolean;
}

export const elementFactory =
  <E extends keyof ElementTagNameMap>(element: E, options: Options = {}) =>
  (props: Record<string, unknown>) => {
    const result = { ...props };
    const { isVoidElement = false } = options;

    if (isVoidElement) {
      delete result["children"];
    }

    // merge className and class
    result["className"] = clsx(
      "className" in result && String(result["className"]),
      "class" in result && String(result["class"]),
    );

    delete result["class"];

    return createElement(element, mapKeys(result, mapAttributeToReactProperty));
  };
