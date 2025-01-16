import { createElement } from "react";
import { mapKeys } from "remeda";
import clsx from "clsx";
import { mapAttributeToReactProperty } from "~/lib/mapAttributeToReactProperty";

type ElementTagNameMap = HTMLElementTagNameMap &
  Pick<
    SVGElementTagNameMap,
    Exclude<keyof SVGElementTagNameMap, keyof HTMLElementTagNameMap>
  >;

export const elementFactory =
  <E extends keyof ElementTagNameMap>(element: E) =>
  (props: Record<string, unknown>) => {
    const result = { ...props };

    // merge className and class
    result["className"] = clsx(
      String(result["className"]),
      String(result["class"]),
    );

    delete result["class"];

    return createElement(element, mapKeys(result, mapAttributeToReactProperty));
  };
