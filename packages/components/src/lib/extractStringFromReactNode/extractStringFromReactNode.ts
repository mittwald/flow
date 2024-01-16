import { ReactNode } from "react";

export const extractStringFromReactNode = (node: ReactNode): string => {
  if (typeof node === "string") {
    return node;
  } else if (typeof node === "number") {
    return node.toString();
  } else if (typeof node === "boolean") {
    return node ? "true" : "false";
  } else if (typeof node === "object" && node && "props" in node) {
    return extractStringFromReactNode(node.props.children);
  }
  return "";
};
