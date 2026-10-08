import { isValidElement, type ReactNode } from "react";
import { isRemoteTextRenderProps } from "@/lib/react/remote";

/**
 * Whether `child` is a text node — locally a string or number, remotely a
 * `RemoteTextRenderer` element.
 */
export const isTextChild = (child: ReactNode): boolean =>
  typeof child === "string" ||
  typeof child === "number" ||
  (isValidElement(child) && isRemoteTextRenderProps(child.props));

/** The text of a text node from {@link isTextChild}, `undefined` otherwise. */
export const getTextOfChild = (child: ReactNode): string | undefined => {
  if (typeof child === "string" || typeof child === "number") {
    return String(child);
  }

  return isValidElement(child) && isRemoteTextRenderProps(child.props)
    ? child.props.remote.data
    : undefined;
};
