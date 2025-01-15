import { useContext } from "react";
import { viewComponentContext } from "~/lib/viewComponentContext/viewComponentContext";

export const useViewComponent = <T extends keyof FlowViewComponents>(
  name: T,
  fallback: FlowViewComponents[T],
): FlowViewComponents[T] => useContext(viewComponentContext)[name] ?? fallback;
