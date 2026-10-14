import type { ReactNode } from "react";
import { Children, isValidElement } from "react";

/**
 * A hard line break reaches React as a `<br>` followed by the newline of the
 * source. Under `white-space: break-spaces` that newline breaks a second time.
 */
export const removeNewlinesAfterBreaks = (children: ReactNode): ReactNode[] =>
  Children.toArray(children).map((child, index, all) => {
    const previous = all[index - 1];
    const followsBreak = isValidElement(previous) && previous.type === "br";

    return followsBreak && typeof child === "string"
      ? child.replace(/^\r?\n/, "")
      : child;
  });
