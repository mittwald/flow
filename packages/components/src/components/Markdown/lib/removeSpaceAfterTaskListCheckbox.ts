import type { ReactNode } from "react";
import { Children } from "react";
import { isTaskListCheckbox } from "@/components/Markdown/lib/isTaskListCheckbox";

/**
 * Between a task's checkbox and its text, remark-gfm puts a space. The checkbox
 * takes the bullet's place, so the space would indent the text past the text of
 * a plain item.
 */
export const removeSpaceAfterTaskListCheckbox = (
  children: ReactNode,
): ReactNode[] =>
  Children.toArray(children).map((child, index, all) =>
    isTaskListCheckbox(all[index - 1]) && typeof child === "string"
      ? child.replace(/^ /, "")
      : child,
  );
