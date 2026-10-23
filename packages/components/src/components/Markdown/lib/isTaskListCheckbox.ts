import type { ReactNode } from "react";
import { isValidElement } from "react";

/** Whether a rendered markdown element is the checkbox of a GFM task item. */
export const isTaskListCheckbox = (child: ReactNode): boolean =>
  isValidElement<{ node?: { tagName?: string } }>(child) &&
  child.props.node?.tagName === "input";
