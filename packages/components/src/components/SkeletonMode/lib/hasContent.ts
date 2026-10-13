import { Children, type ReactNode } from "react";
import { getTextOfChild } from "./isTextChild";

/** Whether `children` renders anything — `null`, booleans and empty text do not. */
export const hasContent = (children: ReactNode): boolean =>
  Children.toArray(children).some((child) => getTextOfChild(child) !== "");
