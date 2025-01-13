import { createElement } from "react";
import { mapReactElementAttributes } from "@/lib/mapReactElementAttributes";

export type ElementTagNameMap = HTMLElementTagNameMap &
  Pick<
    SVGElementTagNameMap,
    Exclude<keyof SVGElementTagNameMap, keyof HTMLElementTagNameMap>
  >;

export const elementFactory =
  <E extends keyof ElementTagNameMap>(element: E) =>
  (props: ElementTagNameMap[E]) => {
    return createElement(element, mapReactElementAttributes(props));
  };
