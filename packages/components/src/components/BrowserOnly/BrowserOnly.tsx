import { useIsMounted } from "@/lib/hooks";
import type { PropsWithChildren } from "react";

export type BrowserOnlyProps = PropsWithChildren;

export const BrowserOnly = (props: PropsWithChildren) => {
  if (useIsMounted()) {
    return props.children;
  }
};

export default BrowserOnly;
