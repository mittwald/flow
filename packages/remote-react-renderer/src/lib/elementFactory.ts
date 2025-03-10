import { mapAttributeToReactProperty } from "@/lib/mapAttributeToReactProperty";
import clsx from "clsx";
import { createElement } from "react";
import { mapKeys } from "remeda";

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
      "className" in result && String(result["className"]),
      "class" in result && String(result["class"]),
    );

    delete result["class"];

    return createElement(element, mapKeys(result, mapAttributeToReactProperty));
  };
