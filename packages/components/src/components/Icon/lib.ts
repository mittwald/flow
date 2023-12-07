import { Children, ReactNode } from "react";
import parse from "html-react-parser";
import { array } from "prop-types";

export const extractSvgFromString = (svgString: string): ReactNode => {
  const svg = Children.toArray(parse(svgString)).find(
    (item) => typeof item === "object" && "type" in item && item.type === "svg",
  );

  if (!svg) {
    throw new Error("invalid svg string");
  }

  return svg;
};
