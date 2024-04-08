import type { ReactNode } from "react";
import { Children } from "react";
import parse from "html-react-parser";

export const extractSvgFromString = (svgString: string): ReactNode => {
  const svg = Children.toArray(parse(svgString)).find(
    (item) => typeof item === "object" && "type" in item && item.type === "svg",
  );

  if (!svg) {
    throw new Error(`Invalid SVG string (got ${String(svgString)})`);
  }

  return svg;
};
