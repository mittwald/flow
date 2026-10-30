import { mapAttributeToReactProperty } from "@/lib/mapAttributeToReactProperty";
import { isReactSuspendedStyle } from "@/lib/propClassifiers";
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

    // React rejects a style string, as set by remote-dom for the style attribute
    if (typeof result["style"] === "string") {
      result["style"] = isReactSuspendedStyle(result["style"])
        ? { display: "none" }
        : undefined;
    }

    return createElement(element, mapKeys(result, mapAttributeToReactProperty));
  };
